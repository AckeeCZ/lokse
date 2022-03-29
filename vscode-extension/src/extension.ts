import * as vscode from "vscode";
import * as execa from "execa";
import type { ExecaError } from "execa";

const isExecaError = (error: unknown): error is ExecaError =>
  "stderr" in (error as ExecaError);

const ERROR_PREFIX = "Error: ";

class LokseExtensionError extends Error {
  constructor(
    message: string,
    public type: "warn" | "err" | undefined = "err"
  ) {
    super(message);
  }
}

const handleError = (error: unknown) => {
  console.log({ error });

  if (isExecaError(error)) {
    const errMessage = error.stderr
      .substring(error.stderr.indexOf(ERROR_PREFIX) + ERROR_PREFIX.length)
      .trim();

    return vscode.window.showWarningMessage(errMessage);
  }

  if (error instanceof LokseExtensionError) {
    if (error.type === "warn") {
      return vscode.window.showWarningMessage(error.message);
    } else {
      return vscode.window.showErrorMessage(error.message);
    }
  }

  if (error instanceof Error) {
    return vscode.window.showErrorMessage(error.message);
  }

  throw error;
};

const selectWorkspaceFolder = async () => {
  const workspaceFolders = vscode.workspace.workspaceFolders ?? [];

  if (workspaceFolders.length > 1) {
    const folders = workspaceFolders.map(({ name }) => name);
    const options = {
      canPickMany: false,
      title: "Select folder with lokse config",
    };

    const selectedFolderName = await vscode.window.showQuickPick(
      folders,
      options
    );

    const selectedFolder = workspaceFolders.find(
      ({ name }) => name === selectedFolderName
    );

    if (!selectedFolder) {
      throw new LokseExtensionError("No workspace folder selected", "warn");
    }

    return selectedFolder;
  }

  const [workspaceFolder] = workspaceFolders;

  if (!workspaceFolder) {
    throw new LokseExtensionError(
      "There is no folder in VsCode workspace",
      "warn"
    );
  }

  return workspaceFolder;
};

export function activate(context: vscode.ExtensionContext) {
  console.log("Lokse extension is now active!");

  const disposableOpen = vscode.commands.registerCommand(
    "lokse.open",
    async () => {
      try {
        const workspaceFolder = await selectWorkspaceFolder();
        const folder = workspaceFolder.uri.path;

        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Window,
            title: `Translation sheet of ${workspaceFolder.name} is about to open`,
          },
          async () => {
            await execa("lokse", ["open"], {
              preferLocal: true,
              localDir: folder,
              cwd: folder,
            });
          }
        );
      } catch (error: unknown) {
        handleError(error);
      }
    }
  );

  const disposableUpdate = vscode.commands.registerCommand(
    "lokse.update",
    async () => {
      try {
        const workspaceFolder = await selectWorkspaceFolder();
        const folder = workspaceFolder.uri.path;

        const { stderr } = await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: `Updating ${workspaceFolder.name} translations`,
            cancellable: false,
          },
          async () => {
            return await execa("lokse", ["update"], {
              preferLocal: true,
              localDir: folder,
              cwd: folder,
            });
          }
        );

        if (stderr) {
          console.log(stderr);
        }
      } catch (error: unknown) {
        handleError(error);
      }
    }
  );

  context.subscriptions.push(disposableOpen, disposableUpdate);
}

export function deactivate() {}
