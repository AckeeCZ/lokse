import { test as oclifTest } from "@oclif/test";
import { cosmiconfig } from "cosmiconfig";
import * as dedent from "dedent";
import { prompt } from "inquirer";
import logger from "../../logger";

jest.mock("cosmiconfig");
const explorerMock = {
  search: jest.fn(),
};
(cosmiconfig as jest.Mock).mockReturnValue(explorerMock);

const writeFileAsyncMock = jest.fn();

jest.mock("bluebird", () => ({
  promisifyAll: jest.fn((fsObject) => ({
    ...jest.requireActual("bluebird").promisifyAll(fsObject),
    writeFileAsync: writeFileAsyncMock,
  })),
}));

jest.mock("inquirer");
const promptMock = prompt as unknown as jest.Mock;

jest.mock("../../logger");
const logMock = logger.log as unknown as jest.Mock;

describe("init command", () => {
  const test = oclifTest.register("setupMocks", () => ({
    run() {
      explorerMock.search.mockReset();
      writeFileAsyncMock.mockReset();
      logMock.mockReset();
    },
  }));

  test
    .stdout()
    .setupMocks()
    .do(() => {
      explorerMock.search.mockResolvedValue({
        config: { splitTranslations: true },
      });
    })
    .command(["init"])
    .it("print message and do nothing when config already exists", () => {
      expect(logMock).toHaveBeenCalledTimes(1);
      expect(logMock).toHaveBeenCalledWith(
        expect.stringMatching(/already exists/)
      );
      expect(promptMock).not.toHaveBeenCalled();
      expect(writeFileAsyncMock).not.toHaveBeenCalled();
    });

  test
    .setupMocks()
    .do(() => {
      explorerMock.search.mockResolvedValue(null);
      promptMock
        .mockReturnValueOnce({ type: "typescript" })
        .mockReturnValueOnce({
          sheetId: "",
          outDir: "",
          languagesString: null,
          column: "",
        });
    })
    .stub(process, "cwd", jest.fn().mockReturnValue("/ROOT_PKG_PATH"))
    .command(["init"])
    .it(
      "creates typescript config when selected typescript config type",
      () => {
        expect(writeFileAsyncMock).toHaveBeenCalledWith(
          `/ROOT_PKG_PATH/lokse.config.ts`,
          dedent`import type { LokseConfig } from "lokse";
        
        const config: LokseConfig = {
            sheetId: "",
            dir: "",
            languages: [],
            column: "",
        };

        export default config;`
        );
        expect(logMock).toHaveBeenCalledTimes(1);
        expect(logMock).toHaveBeenCalledWith(
          expect.stringMatching(/generated config/i)
        );
      }
    );

  test
    .setupMocks()
    .do(() => {
      explorerMock.search.mockResolvedValue(null);
      promptMock
        .mockReturnValueOnce({ type: "javascript" })
        .mockReturnValueOnce({
          sheetId: "",
          outDir: "",
          languagesString: null,
          column: "",
        });
    })
    .stub(process, "cwd", jest.fn().mockReturnValue("/ROOT_PKG_PATH"))
    .command(["init"])
    .it(
      "creates javascript config when selected javascript config type",
      () => {
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

        module.exports = config;`
        );
        expect(logMock).toHaveBeenCalledTimes(1);
        expect(logMock).toHaveBeenCalledWith(
          expect.stringMatching(/generated config/i)
        );
      }
    );

  test
    .setupMocks()
    .do(() => {
      explorerMock.search.mockResolvedValue(null);
      promptMock.mockReturnValueOnce({ type: "rc file" }).mockReturnValueOnce({
        sheetId: "",
        outDir: "",
        languagesString: null,
        column: "",
      });
    })
    .stub(process, "cwd", jest.fn().mockReturnValue("/ROOT_PKG_PATH"))
    .command(["init"])
    .it("creates rc config when selected rc file config type", () => {
      expect(writeFileAsyncMock).toHaveBeenCalledWith(
        `/ROOT_PKG_PATH/.lokserc`,
        dedent`{
            "sheetId": "",
            "dir": "",
            "languages": [],
            "column": ""
        }`
      );
      expect(logMock).toHaveBeenCalledTimes(1);
      expect(logMock).toHaveBeenCalledWith(
        expect.stringMatching(/generated config/i)
      );
    });

  test
    .setupMocks()
    .do(() => {
      explorerMock.search.mockResolvedValue(null);
      promptMock
        .mockReturnValueOnce({ type: "typescript" })
        .mockReturnValueOnce({
          sheetId: "fake-sheet-id",
          outDir: "localesDir",
          languagesString: "cs,en",
          column: "web",
        });
    })
    .stub(process, "cwd", jest.fn().mockReturnValue("/ROOT_PKG_PATH"))
    .command(["init"])
    .it("use all inputed values to create config", () => {
      expect(promptMock).toHaveBeenCalledWith([
        expect.objectContaining({
          choices: [
            { name: "typescript (lokse.config.ts)", value: "typescript" },
            { name: "javascript (lokse.config.js)", value: "javascript" },
            { name: "rc file (.lokserc)", value: "rc file" },
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

        export default config;`
      );
      expect(logMock).toHaveBeenCalledTimes(1);
      expect(logMock).toHaveBeenCalledWith(
        expect.stringMatching(/generated config/i)
      );
    });
});
