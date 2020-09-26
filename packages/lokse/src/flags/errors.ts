import { CLIError } from "@oclif/errors";

export class IncorrectFlagValue extends CLIError {}

export class MissingFlagValue extends CLIError {
  constructor(flagName: string) {
    super(`${flagName} is required for updating translations`);
  }
}
