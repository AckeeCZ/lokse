import * as dedent from "dedent";
import defaultLogger from "./logger";
import type { Logger } from "./logger";

export function warnUnrecognizedError(
  error: unknown,
  logger: Logger = defaultLogger
): void {
  logger.warn(
    `Unrecgnized error ${typeof error}: ${(error as any)?.toString()}`
  );
}

interface ErrorWithCode {
  code: string;
}

export const isErrorWithCode = (
  error: unknown,
  code: string
): error is ErrorWithCode => (error as ErrorWithCode)?.code === code;

export class FatalError extends Error {}

export class MissingAuthError extends FatalError {
  public name: string;

  constructor() {
    super(
      dedent`
          Cannot authenticate to fetch Spreadsheet data. 
            Provide either Service account credentials or API key 🔑 See detail info at https://github.com/AckeeCZ/lokse/tree/master/packages/core/doc/authentication.md
          `
    );
    this.name = "MissingAuthError";
  }
}

export class KeyColumnNotFound extends Error {
  public key: string;

  constructor(key: string, sheetTitle: string) {
    super(`Key column "${key}" not found in sheet ${sheetTitle}.`);

    this.name = "KeyColumnNotFound";
    this.key = key;
  }
}

export class LangColumnNotFound extends Error {
  public lang: string;

  constructor(lang: string, sheetTitle: string) {
    super(`Language column "${lang}" not found in sheet ${sheetTitle}!`);

    this.name = "LangColumnNotFound";
    this.lang = lang;
  }
}
