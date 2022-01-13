import { CLIError } from "@oclif/errors";

export const cliInvariant = (
  expression: unknown,
  message: string,
  options: Record<string, any> = {}
): void => {
  if (!expression) {
    throw new CLIError(message, options);
  }
};

export const noExitCliInvariant = (
  expression: unknown,
  message: string
): void => cliInvariant(expression, message, { exit: false });
