// eslint-disable-next-line node/no-missing-import
import { Errors } from '@oclif/core';

export class IncorrectFlagValue extends Errors.CLIError {}

export type Action = 'update' | 'open';

export class MissingFlagValue extends Errors.CLIError {
    constructor(flagName: string, action: Action) {
        super(`💥 ${flagName} is required for ${action} of translations`);
    }
}
