import { CLIError } from "@oclif/errors";

export const cliInvariant = (
    expression: any,
    message: string,
    options: object = {}
  ) => {
    if (!expression) {
      throw new CLIError(message, options);
    }
  };
  
  export const noExitCliInvariant = (expression: any, message: string) =>
    cliInvariant(expression, message, { exit: false });
  