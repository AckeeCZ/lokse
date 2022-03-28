import { CLIError } from "@oclif/errors";

export class IncorrectFlagValue extends CLIError {}

export type Action = "update" | "open";

export class MissingFlagValue extends CLIError {
  constructor(flagName: string, action: Action) {
    super(`💥 ${flagName} is required for ${action} of translations`);
  }
}
