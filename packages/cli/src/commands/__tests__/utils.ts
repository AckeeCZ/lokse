import { runCommand as runOclifCommand } from '@oclif/test';

import Open from '../../../lib/commands/open.js';
import Update from '../../../lib/commands/update.js';
import Init from '../../../lib/commands/init.js';

function getCommandClass(name: string) {
    if (name === 'open') {
        return Open;
    }

    if (name === 'update') {
        return Update;
    }

    if (name === 'init') {
        return Init;
    }

    throw new Error('Unknown command name');
}

function processInstructions(cmd: Parameters<typeof runOclifCommand>[0]): [string, string[]] {
    if (typeof cmd === 'string') {
        return [cmd, []];
    }

    const [cmdName, ...args] = cmd;

    return [cmdName, args];
}

export const runCommand = async (cmd: Parameters<typeof runOclifCommand>[0]) => {
    const [cmdName, args] = processInstructions(cmd);
    const Command = getCommandClass(cmdName);
    await Command.run(args);
};
