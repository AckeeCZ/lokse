import { runCommand as runOclifCommand } from '@oclif/test';

type CaptureResult = Awaited<ReturnType<typeof runOclifCommand>>;

class CommandError extends Error {
    constructor(readonly result: CaptureResult) {
        super(result.error!.message, {
            cause: result.error,
        });
    }
}

export const runCommand = async <T>(...args: Parameters<typeof runOclifCommand>) => {
    const result = await runOclifCommand<T>(...args);
    if (result.error) {
        throw new CommandError(result);
    }

    return result;
};
