import { runCommand } from './utils.js';
import dedent from 'dedent';
import { beforeEach } from 'node:test';
import { describe, vi, expect, it } from 'vitest';

const explorerMock = {
    search: vi.fn(),
};
vi.mock('cosmiconfig', async importOriginal => ({
    ...(await importOriginal<typeof import('cosmiconfig')>()),
    cosmiconfig: vi.fn().mockReturnValue(explorerMock),
}));

const writeFileAsyncMock = vi.fn();

vi.mock('bluebird', () => ({
    promisifyAll: vi.fn(async fsObject => ({
        ...((await vi.importActual('bluebird')) as any).promisifyAll(fsObject),
        writeFileAsync: writeFileAsyncMock,
    })),
}));

const promptMock = vi.fn();
vi.mock('inquirer', () => ({
    prompt: promptMock,
}));

const logMock = vi.fn();
vi.mock('../../base', async importActual => ({
    ...importActual(),
    logger: { log: logMock },
}));

describe('init command', () => {
    beforeEach(() => {
        explorerMock.search.mockReset();
        writeFileAsyncMock.mockReset();
        logMock.mockReset();
    });

    it('print message and do nothing when config already exists', async () => {
        explorerMock.search.mockReturnValue({
            config: { splitTranslations: true },
        });

        await runCommand(['init']);

        expect(promptMock).not.toHaveBeenCalled();
        expect(writeFileAsyncMock).not.toHaveBeenCalled();
        expect(logMock).toHaveBeenCalledTimes(1);
        expect(logMock).toHaveBeenCalledWith(expect.stringMatching(/already exists/));
    });

    it('creates typescript config when selected typescript config type', async () => {
        explorerMock.search.mockReturnValue(null);
        promptMock.mockReturnValueOnce({ type: 'typescript' }).mockReturnValueOnce({
            sheetId: '',
            outDir: '',
            languagesString: null,
            column: '',
        });

        // TODO .stub(process, 'cwd', vi.fn().mockReturnValue('/ROOT_PKG_PATH'))
        await runCommand(['init']);

        expect(writeFileAsyncMock).toHaveBeenCalledWith(
            `/ROOT_PKG_PATH/lokse.config.ts`,
            dedent`import type { LokseConfig } from "lokse";
        
        const config: LokseConfig = {
            sheetId: "",
            dir: "",
            languages: [],
            column: "",
        };

        export default config;`,
        );
        expect(logMock).toHaveBeenCalledTimes(1);
        expect(logMock).toHaveBeenCalledWith(expect.stringMatching(/generated config/i));
    });

    it('creates javascript config when selected javascript config type', async () => {
        explorerMock.search.mockReturnValue(null);
        promptMock.mockReturnValueOnce({ type: 'javascript' }).mockReturnValueOnce({
            sheetId: '',
            outDir: '',
            languagesString: null,
            column: '',
        });

        // .stub(process, 'cwd', vi.fn().mockReturnValue('/ROOT_PKG_PATH'))
        await runCommand(['init']);

        expect(writeFileAsyncMock).toHaveBeenCalledWith(
            `/ROOT_PKG_PATH/lokse.config.js`,
            dedent`/**
         * @type {import('lokse').LokseConfig}
         */
        const config = {
            sheetId: "",
            dir: "",
            languages: [],
            column: "",
        };

        module.exports = config;`,
        );
        expect(logMock).toHaveBeenCalledTimes(1);
        expect(logMock).toHaveBeenCalledWith(expect.stringMatching(/generated config/i));
    });

    it('creates rc config when selected rc file config type', async () => {
        explorerMock.search.mockReturnValue(null);
        promptMock.mockReturnValueOnce({ type: 'rc file' }).mockReturnValueOnce({
            sheetId: '',
            outDir: '',
            languagesString: null,
            column: '',
        });

        // TODO .stub(process, 'cwd', vi.fn().mockReturnValue('/ROOT_PKG_PATH'))
        await runCommand(['init']);

        expect(writeFileAsyncMock).toHaveBeenCalledWith(
            `/ROOT_PKG_PATH/.lokserc`,
            dedent`{
            "sheetId": "",
            "dir": "",
            "languages": [],
            "column": ""
        }`,
        );
        expect(logMock).toHaveBeenCalledTimes(1);
        expect(logMock).toHaveBeenCalledWith(expect.stringMatching(/generated config/i));
    });

    it('use all inputed values to create config', async () => {
        explorerMock.search.mockReturnValue(null);
        promptMock.mockReturnValueOnce({ type: 'typescript' }).mockReturnValueOnce({
            sheetId: 'fake-sheet-id',
            outDir: 'localesDir',
            languagesString: 'cs,en',
            column: 'web',
        });

        // TODO .stub(process, 'cwd', vi.fn().mockReturnValue('/ROOT_PKG_PATH'))
        await runCommand(['init']);

        expect(promptMock).toHaveBeenCalledWith([
            expect.objectContaining({
                choices: [
                    { name: 'typescript (lokse.config.ts)', value: 'typescript' },
                    { name: 'javascript (lokse.config.js)', value: 'javascript' },
                    { name: 'rc file (.lokserc)', value: 'rc file' },
                ],
            }),
        ]);
        expect(writeFileAsyncMock).toHaveBeenCalledWith(
            `/ROOT_PKG_PATH/lokse.config.ts`,
            dedent`import type { LokseConfig } from "lokse";
        
        const config: LokseConfig = {
            sheetId: "fake-sheet-id",
            dir: "localesDir",
            languages: ["cs","en"],
            column: "web",
        };

        export default config;`,
        );
        expect(logMock).toHaveBeenCalledTimes(1);
        expect(logMock).toHaveBeenCalledWith(expect.stringMatching(/generated config/i));
    });
});
