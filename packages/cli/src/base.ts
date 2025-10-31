import { Command } from '@oclif/core';
import updateNotifier from 'update-notifier';

import { getConfig, type Logger, type LokseConfig } from '@lokse/core';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const pkg = require('../package.json');

export default abstract class Base extends Command {
    protected conf: undefined | null | LokseConfig;

    async init(): Promise<void> {
        const notifier = updateNotifier({
            pkg,
            updateCheckInterval: 1000,
            shouldNotifyInNpmScript: true,
        });
        notifier.notify();

        this.conf = await getConfig();
    }

    protected get logger(): Logger {
        return {
            ...console,
            warn: this.warn.bind(this),
        };
    }
}
