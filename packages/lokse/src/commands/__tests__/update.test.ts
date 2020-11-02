import { test as oclifTest } from "@oclif/test";

import Reader from "../../core/reader";
import { FileWriter } from "../../core/writer";
import { OutputFormat } from "../../constants";
import { noExitCliInvariant } from "../../utils";

const mockOraInstance = {
  start: jest.fn(),
  warn: jest.fn(),
  succeed: jest.fn(),
  fail: jest.fn(),
};
jest.mock("ora", () => jest.fn().mockReturnValue(mockOraInstance));

// File writer mock
jest.mock("../../core/writer");
const mockWrite = jest.fn();
const FileWriterMock = FileWriter as jest.Mock;
FileWriterMock.mockReturnValue({
  write: mockWrite,
});

// Spreadsheet reader mock
jest.mock("../../core/reader");
const mockRead = jest.fn();
const ReaderMock = Reader as jest.Mock;
ReaderMock.mockReturnValue({
  read: mockRead,
});

const outputFormats = Object.values(OutputFormat).join(", ");

describe("update command", () => {
  let consoleErrorBackup: typeof console.error;
  const fakeSpreadsheetId = "fake-spreadsheet-id";
  const keyColumn = "web";
  const translationsDir = "src/translations";
  const languages = ["cs", "en-us", "en-gb"];
  const params = {
    id: `--id=${fakeSpreadsheetId}`,
    dir: `--dir=${translationsDir}`,
    col: `--col=${keyColumn}`,
    langs: `--languages=${languages.join(",")}`,
    format: `--format=json`,
  };

  const mockSheetLines = ["line1", "line2"];

  const test = oclifTest.register("setupMocks", () => ({
    /* eslint-disable no-console */
    run() {
      ReaderMock.mockClear();
      mockRead.mockClear();
      FileWriterMock.mockClear();
      mockWrite.mockClear();

      mockOraInstance.start.mockClear();
      mockOraInstance.warn.mockClear();
      mockOraInstance.succeed.mockClear();
      mockOraInstance.fail.mockClear();

      /**
       * Mocking error output with https://www.npmjs.com/package/fancy-test#stdoutstderr-mocking
       * doesn't work as Jest somehow wraps error output by itself. Therefore we need to mock
       * console.error and check what was send into it
       */
      consoleErrorBackup = console.error;
      console.error = jest.fn();
    },
    finally() {
      console.error = consoleErrorBackup;
    },
    /* eslint-enable no-console */
  }));

  test
    .command(["update"])
    .catch((error) => {
      expect(error.message).toEqual(
        `💥 Sheet id is required for updating translations`
      );
    })
    .it("throws when id not provided");

  test
    .command(["update", params.id])
    .catch((error) => {
      expect(error.message).toEqual(
        `💥 Output directory is required for updating translations`
      );
    })
    .it("throws when output directory not provided");

  test
    .command(["update", params.id, params.dir])
    .catch((error) => {
      expect(error.message).toEqual(
        `💥 Keys column is required for updating translations`
      );
    })
    .it("throws when keys column not provided");

  test
    .command(["update", params.id, params.dir, params.col])
    .catch((error) => {
      expect(error.message).toEqual(
        `🤷‍♂️ Translation columns have to be list of languages, but undefined given`
      );
    })
    .it("throws when languages list not provided");

  test
    .skip() // TODO: we're able to provide non array value only through config
    .command(["update", params.id, params.dir, params.col, "--languages="])
    .catch((error) => {
      expect(error.message).toEqual(
        `🤷‍♂️ Translation columns have to be list of languages, but cs,en given`
      );
    })
    .it("throws when languages list is not an array");

  test
    .command(["update", "--format=unknown_format"])
    .catch((error) => {
      expect(error.message).toContain(
        `Expected --format=unknown_format to be one of: ${outputFormats}`
      );
    })
    .it("throws when unknown format provided");

  test
    .setupMocks()
    .stdout()
    .do(() => mockRead.mockReturnValue(mockSheetLines))
    .command([
      "update",
      params.id,
      params.dir,
      params.col,
      params.langs,
      params.format,
    ])
    .it("reads data for each language", () => {
      expect(ReaderMock.mock.instances).toHaveLength(1);
      expect(ReaderMock.mock.calls[0]).toEqual([fakeSpreadsheetId, "*"]);

      expect(mockRead).toHaveBeenCalledTimes(3);
      expect(mockRead).toHaveBeenNthCalledWith(1, keyColumn, languages[0]);
      expect(mockRead).toHaveBeenNthCalledWith(2, keyColumn, languages[1]);
      expect(mockRead).toHaveBeenNthCalledWith(3, keyColumn, languages[2]);
    });

  test
    .setupMocks()
    .stdout()
    .do(() => mockRead.mockReturnValue([]))
    .command([
      "update",
      params.id,
      params.dir,
      params.col,
      params.langs,
      params.format,
    ])
    // TODO - find out if we can get empty se of lines
    .it("doesnt write language data when lines set is empty", () => {
      expect(mockWrite).not.toHaveBeenCalled();

      expect(mockOraInstance.warn).toHaveBeenCalledTimes(3);
      expect(mockOraInstance.warn).toHaveBeenNthCalledWith(
        1,
        `Received empty lines set for language ${languages[0]}`
      );
      expect(mockOraInstance.warn).toHaveBeenNthCalledWith(
        2,
        `Received empty lines set for language ${languages[1]}`
      );
      expect(mockOraInstance.warn).toHaveBeenNthCalledWith(
        3,
        `Received empty lines set for language ${languages[2]}`
      );
    });

  test
    .setupMocks()
    .stdout()
    .stub(process, "cwd", jest.fn().mockReturnValue("/ROOT_PKG_PATH"))
    .do(() => mockRead.mockReturnValue(mockSheetLines))
    .command([
      "update",
      params.id,
      params.dir,
      params.col,
      params.langs,
      params.format,
    ])
    .it("writes language data in desired format into the output dir", () => {
      let relPath = "";

      expect(mockWrite).toHaveBeenCalledTimes(3);
      expect(mockOraInstance.succeed).toHaveBeenCalledTimes(3);

      relPath = `${translationsDir}/${languages[0]}.json`;
      expect(mockWrite.mock.calls[0][0]).toEqual(`/ROOT_PKG_PATH/${relPath}`);
      expect(mockOraInstance.succeed).toHaveBeenNthCalledWith(
        1,
        `${languages[0]} translations saved into ${relPath}`
      );

      relPath = `${translationsDir}/${languages[1]}.json`;
      expect(mockWrite.mock.calls[1][0]).toEqual(`/ROOT_PKG_PATH/${relPath}`);
      expect(mockOraInstance.succeed).toHaveBeenNthCalledWith(
        2,
        `${languages[1]} translations saved into ${relPath}`
      );

      relPath = `${translationsDir}/${languages[2]}.json`;
      expect(mockWrite.mock.calls[2][0]).toEqual(`/ROOT_PKG_PATH/${relPath}`);
      expect(mockOraInstance.succeed).toHaveBeenNthCalledWith(
        3,
        `${languages[2]} translations saved into ${relPath}`
      );
    });

  test
    .setupMocks()
    .stderr()
    .do(() => {
      mockRead
        .mockImplementationOnce(() => mockSheetLines)
        .mockImplementationOnce(() => {
          throw new Error("Read spreadsheet error");
        });
    })
    .command([
      "update",
      params.id,
      params.dir,
      params.col,
      params.langs,
      params.format,
    ])
    .catch((error) => {
      expect(mockRead).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledTimes(1);

      expect(mockOraInstance.fail).toHaveBeenCalledTimes(1);
      expect(mockOraInstance.fail).toHaveBeenCalledWith(
        `Generating ${languages[1]} translations failed.`
      );

      expect(mockOraInstance.succeed).toHaveBeenCalledTimes(1);
      expect(mockOraInstance.succeed).toHaveBeenCalledWith(
        `${languages[0]} translations saved into ${translationsDir}/${languages[0]}.json`
      );
      expect(error.message).toEqual("Read spreadsheet error");
    })
    .it("print error when process of reading or writing fails");

  test
    .setupMocks()
    .do(() => {
      mockRead
        .mockImplementationOnce((_, lang) => {
          noExitCliInvariant(false, `No exit read ${lang} error`);
        })
        .mockImplementation(() => mockSheetLines);
      mockWrite.mockImplementationOnce(() => {
        noExitCliInvariant(false, "No exit write translations error");
      });
    })
    .command([
      "update",
      params.id,
      params.dir,
      params.col,
      params.langs,
      params.format,
    ])
    .it(
      "goes through other langs when non critical error occur during read or write",
      () => {
        expect(mockRead).toHaveBeenCalledTimes(3);
        expect(mockWrite).toHaveBeenCalledTimes(2);

        expect(mockOraInstance.fail).toHaveBeenCalledTimes(2);
        expect(mockOraInstance.fail).toHaveBeenNthCalledWith(
          1,
          `Generating ${languages[0]} translations failed.`
        );
        expect(mockOraInstance.fail).toHaveBeenNthCalledWith(
          2,
          `Generating ${languages[1]} translations failed.`
        );

        expect(mockOraInstance.succeed).toHaveBeenCalledTimes(1);
        expect(mockOraInstance.succeed).toHaveBeenCalledWith(
          `${languages[2]} translations saved into ${translationsDir}/${languages[2]}.json`
        );

        /* eslint-disable no-console */
        expect(console.error).toHaveBeenCalledTimes(2);
        expect((console.error as jest.Mock).mock.calls[0][0]).toContain(
          "No exit read cs error"
        );
        expect((console.error as jest.Mock).mock.calls[1][0]).toContain(
          "No exit write translations error"
        );
        /* eslint-enable no-console */
      }
    );
});
