import { runCommand } from './utils.js';
// @ts-expect-error esInterop
import { default as dedent } from 'dedent';
import { describe, vi, expect, it, beforeEach, MockInstance } from 'vitest';

import { getConfig } from '@lokse/core';
import { writeFile } from 'fs/promises';
import { prompt } from 'inquirer';

vi.mock('@lokse/core', { spy: true });
const getConfigMock = vi.mocked(getConfig);

vi.mock('fs/promises', { spy: true });
const writeFileMock = vi.mocked(writeFile);

const logger = vi.spyOn(console, 'log');

const promptMock = vi.mocked(prompt);
vi.mock('inquirer', () => {
    const prompt = vi.fn();
    return {
        prompt,
        default: {
            prompt,
        },
    };
});
let cwdMock: MockInstance | null = null;

describe('init command', () => {
    beforeEach(() => {
        writeFileMock.mockReset();
        getConfigMock.mockReset();
        promptMock.mockReset();
        logger.mockReset();

        cwdMock?.mockReset();
        cwdMock = null;
    });

    it('print message and do nothing when config already exists', async () => {
        getConfigMock.mockResolvedValue({ splitTranslations: true });
        // prevents the test from being stuck waiting for stdin when set up incorrectly
        promptMock.mockRejectedValueOnce(new Error('This should not be called'));

        await runCommand(['init']);

        expect(promptMock).not.toHaveBeenCalled();
        expect(writeFileMock).not.toHaveBeenCalled();
        expect(logger).toHaveBeenCalledTimes(1);
        expect(logger).toHaveBeenCalledWith(expect.stringMatching(/already exists/));
    });

    it('creates typescript config when selected typescript config type', async () => {
        getConfigMock.mockResolvedValue(null);
        promptMock.mockResolvedValueOnce({ type: 'typescript' }).mockResolvedValueOnce({
            sheetId: '',
            outDir: '',
            languagesString: null,
            column: '',
        });
        cwdMock = vi.spyOn(process, 'cwd').mockReturnValue('/ROOT_PKG_PATH');

        await runCommand(['init']);

        expect(writeFileMock).toHaveBeenCalledWith(
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
        expect(logger).toHaveBeenCalledTimes(1);
        expect(logger).toHaveBeenCalledWith(expect.stringMatching(/generated config/i));
    });

    it('creates javascript config when selected javascript config type', async () => {
        getConfigMock.mockResolvedValue(null);
        promptMock.mockResolvedValueOnce({ type: 'javascript' }).mockResolvedValueOnce({
            sheetId: '',
            outDir: '',
            languagesString: null,
            column: '',
        });

        vi.spyOn(process, 'cwd').mockReturnValue('/ROOT_PKG_PATH');
        await runCommand(['init']);

        expect(writeFileMock).toHaveBeenCalledWith(
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
        expect(logger).toHaveBeenCalledTimes(1);
        expect(logger).toHaveBeenCalledWith(expect.stringMatching(/generated config/i));
    });

    it('creates rc config when selected rc file config type', async () => {
        getConfigMock.mockResolvedValue(null);
        promptMock.mockResolvedValueOnce({ type: 'rc file' }).mockResolvedValueOnce({
            sheetId: '',
            outDir: '',
            languagesString: null,
            column: '',
        });

        vi.spyOn(process, 'cwd').mockReturnValue('/ROOT_PKG_PATH');

        await runCommand(['init']);

        expect(writeFileMock).toHaveBeenCalledWith(
            `/ROOT_PKG_PATH/.lokserc`,
            dedent`{
            "sheetId": "",
            "dir": "",
            "languages": [],
            "column": ""
        }`,
        );
        expect(logger).toHaveBeenCalledTimes(1);
        expect(logger).toHaveBeenCalledWith(expect.stringMatching(/generated config/i));
    });

    it('use all inputed values to create config', async () => {
        getConfigMock.mockResolvedValue(null);
        promptMock.mockResolvedValueOnce({ type: 'typescript' }).mockResolvedValueOnce({
            sheetId: 'fake-sheet-id',
            outDir: 'localesDir',
            languagesString: 'cs,en',
            column: 'web',
        });

        vi.spyOn(process, 'cwd').mockReturnValueOnce('/ROOT_PKG_PATH');

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
        expect(writeFileMock).toHaveBeenCalledWith(
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
        expect(logger).toHaveBeenCalledTimes(1);
        expect(logger).toHaveBeenCalledWith(expect.stringMatching(/generated config/i));
    });
});
