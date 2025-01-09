// eslint-disable-next-line node/no-missing-import
import { Flags, type Interfaces } from '@oclif/core';
import { getConfig } from '@lokse/core';
import { MissingFlagValue } from './errors';
import type { Action } from './errors';

export const flag = Flags.string({
    char: 'i',
    description: 'spreadsheet id',

    default: (async ({ flags }) => {
        const conf = await getConfig();
        const id = process.env.SPREADSHEET_ID ?? flags.id ?? conf?.sheetId;

        return id;
    }) satisfies Interfaces.OptionFlag<string | undefined>['default'],
});

export function invariant(id: string | undefined, action: Action): asserts id is string {
    if (!id) {
        throw new MissingFlagValue('Sheet id', action);
    }
}
