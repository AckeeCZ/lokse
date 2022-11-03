import { test as oclifTest } from "@oclif/test";
import { cosmiconfigSync } from "cosmiconfig";
import { when } from "jest-when";

import {
  Reader,
  WorksheetReader,
  InvalidFilterError,
  FileWriter,
  OutputFormat,
  transformersByFormat,
  Sorter,
  OTHER_TRANSLATIONS_NAMESPACE,
} from "@lokse/core";
import { noExitCliInvariant } from "../../invariants";

const jsonTransformer = transformersByFormat[OutputFormat.JSON];

jest.mock("cosmiconfig", () => {
  const mockExplorer = {
    search: jest.fn(),
  };

  return {
    cosmiconfigSync: jest.fn().mockReturnValue(mockExplorer),
  };
});

jest.mock("cosmiconfig-ts-loader");

const mockOraInstance = {
  start: jest.fn(),
  warn: jest.fn(),
  succeed: jest.fn(),
  fail: jest.fn(),
};
jest.mock("ora", () => jest.fn().mockReturnValue(mockOraInstance));

jest.mock("@lokse/core", () => ({
  ...(jest.requireActual("@lokse/core") as typeof import("@lokse/core")),
  FileWriter: jest.fn(),
  Reader: jest.fn(),
  WorksheetReader: jest.fn(),
  Sorter: jest.fn(),
}));

// File writer mock
const mockWrite = jest.fn();
const FileWriterMock = FileWriter as jest.Mock;
FileWriterMock.mockReturnValue({
  write: mockWrite,
});

// Spreadsheet reader mock
const mockRead = jest.fn();
const ReaderMock = Reader as jest.Mock;
ReaderMock.mockReturnValue({
  read: mockRead,
});

// Worksheet reader mock
const mockWorksheetRead = jest.fn();
const WorksheetReaderMock = WorksheetReader as any as jest.Mock;
WorksheetReaderMock.mockReturnValue({
  read: mockWorksheetRead,
});

// Sorter mock
const mockSort = jest.fn();
const SorterMock = Sorter as any as jest.Mock;
SorterMock.mockReturnValue({
  sort: mockSort,
});

const outputFormats = Object.values(OutputFormat).join(", ");

describe("update command", () => {
  const searchMock = cosmiconfigSync("foo").search as jest.Mock;

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

  const mockSheetLines = [{ key: "sheet1.line" }, { key: "sheet1.line" }];
  const mockSheetLines2 = [{ key: "sheet2.line_1" }, { key: "sheet2.line_2" }];
  const mockSheetLines3 = [{ key: "sheet3.line_1" }, { key: "sheet3.line_2" }];

  const test = oclifTest.register("setupMocks", () => ({
    run() {
      ReaderMock.mockClear();
      WorksheetReaderMock.mockClear();
      mockRead.mockClear().mockReturnValue(mockSheetLines);
      FileWriterMock.mockClear();
      mockWrite
        .mockClear()
        .mockImplementation(({ language, namespace }) =>
          [
            namespace === OTHER_TRANSLATIONS_NAMESPACE ? undefined : namespace,
            language,
          ]
            .filter(Boolean)
            .join(".")
        );
      mockSort.mockClear().mockImplementation((linesBySheet) => [
        {
          ns: OTHER_TRANSLATIONS_NAMESPACE,
          lines: Object.values(linesBySheet).flat(),
        },
      ]);

      mockOraInstance.start.mockClear();
      mockOraInstance.warn.mockClear();
      mockOraInstance.succeed.mockClear();
      mockOraInstance.fail.mockClear();

      searchMock.mockReset();
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
  }));

  test
    .command(["update"])
    .catch((error) => {
      expect(error.message).toEqual(
        `💥 Sheet id is required for update of translations`
      );
    })
    .it("throws when id not provided");

  test
    .command(["update", params.id])
    .catch((error) => {
      expect(error.message).toEqual(
        `💥 Output directory is required for update of translations`
      );
    })
    .it("throws when output directory not provided");

  test
    .command(["update", params.id, params.dir])
    .catch((error) => {
      expect(error.message).toEqual(
        `💥 Keys column is required for update of translations`
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
    .do(() =>
      searchMock.mockReturnValue({
        config: { languages: "cs,en" },
      })
    )
    .command(["update", params.id, params.dir, params.col])
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
    .command(["update", ...Object.values(params)])
    .it("set empty filter when no one supplied", () => {
      expect(true).toBe(true);
      expect(ReaderMock.mock.instances).toHaveLength(1);
      expect(ReaderMock.mock.instances[0][1]).toBeUndefined();
    });

  describe("Sheets filter", () => {
    test
      .setupMocks()
      .command([
        "update",
        ...Object.values(params),
        "--sheets=Main translations",
      ])
      .it("uses filter when only one name supplied", () => {
        expect(WorksheetReaderMock.mock.instances).toHaveLength(1);
        expect(WorksheetReaderMock.mock.calls[0][0]).toEqual([
          "Main translations",
        ]);
        expect(ReaderMock).toHaveBeenCalled();
      });

    test
      .setupMocks()
      .command([
        "update",
        ...Object.values(params),
        "--sheets=Main translations,Secondary translations",
      ])
      .it("parses and uses filter when list of names supplied", () => {
        expect(WorksheetReaderMock.mock.instances).toHaveLength(1);
        expect(WorksheetReaderMock.mock.calls[0][0]).toEqual([
          "Main translations",
          "Secondary translations",
        ]);
        expect(ReaderMock).toHaveBeenCalled();
      });

    test
      .setupMocks()
      .do(() => {
        searchMock.mockReturnValue({ config: { sheets: true } });

        WorksheetReaderMock.mockImplementationOnce(() => {
          throw new InvalidFilterError(true);
        });
      })
      .command(["update", ...Object.values(params)])
      .catch((error) => {
        expect(error).not.toBeFalsy();
        expect(WorksheetReaderMock).toHaveBeenCalled();
        expect(WorksheetReaderMock.mock.calls[0][0]).toEqual(true);
        expect(ReaderMock).not.toHaveBeenCalled();
      })
      .it("throws when filter has invalid format");

    test
      .setupMocks()
      .do(() =>
        searchMock.mockReturnValue({
          config: { sheets: "Secondary translations" },
        })
      )
      .command(["update", ...Object.values(params)])
      .it("uses string filter supplied through config", () => {
        expect(WorksheetReaderMock.mock.instances).toHaveLength(1);
        expect(WorksheetReaderMock.mock.calls[0][0]).toEqual(
          "Secondary translations"
        );
        expect(ReaderMock).toHaveBeenCalled();
      });

    test
      .setupMocks()
      .do(() =>
        searchMock.mockReturnValue({
          config: { sheets: ["Main translations", "Secondary translations"] },
        })
      )
      .command(["update", ...Object.values(params)])
      .it("uses names list filter supplied through config", () => {
        expect(WorksheetReaderMock.mock.instances).toHaveLength(1);
        expect(WorksheetReaderMock.mock.calls[0][0]).toEqual([
          "Main translations",
          "Secondary translations",
        ]);
        expect(ReaderMock).toHaveBeenCalled();
      });

    test
      .setupMocks()
      .do(() =>
        searchMock.mockReturnValue({
          config: {
            sheets: {
              include: ["Main translations", "Other translations"],
            },
          },
        })
      )
      .command(["update", ...Object.values(params)])
      .it("uses include only filter supplied through config", () => {
        expect(WorksheetReaderMock.mock.instances).toHaveLength(1);
        expect(WorksheetReaderMock.mock.calls[0][0]).toEqual({
          include: ["Main translations", "Other translations"],
        });
        expect(ReaderMock).toHaveBeenCalled();
      });

    test
      .setupMocks()
      .do(() =>
        searchMock.mockReturnValue({
          config: {
            sheets: {
              exclude: ["Main translations", "Other translations"],
            },
          },
        })
      )
      .command(["update", ...Object.values(params)])
      .it("uses exclude only filter supplied through config", () => {
        expect(WorksheetReaderMock.mock.instances).toHaveLength(1);
        expect(WorksheetReaderMock.mock.calls[0][0]).toEqual({
          exclude: ["Main translations", "Other translations"],
        });
      });

    test
      .setupMocks()
      .do(() =>
        searchMock.mockReturnValue({
          config: {
            sheets: {
              include: "Main translations",
              exclude: ["Other translations", "Non web translations"],
            },
          },
        })
      )
      .command(["update", ...Object.values(params)])
      .it(
        "uses mixed include and exclude filter supplied through config",
        () => {
          expect(WorksheetReaderMock.mock.instances).toHaveLength(1);
          expect(WorksheetReaderMock.mock.calls[0][0]).toEqual({
            include: "Main translations",
            exclude: ["Other translations", "Non web translations"],
          });
        }
      );
  });

  test
    .setupMocks()
    .command(["update", ...Object.values(params)])
    .it("reads data for each language", () => {
      expect(ReaderMock.mock.instances).toHaveLength(1);
      expect(ReaderMock.mock.calls[0][0]).toEqual(fakeSpreadsheetId);

      expect(mockRead).toHaveBeenCalledTimes(3);
      expect(mockRead).toHaveBeenNthCalledWith(1, keyColumn, languages[0]);
      expect(mockRead).toHaveBeenNthCalledWith(2, keyColumn, languages[1]);
      expect(mockRead).toHaveBeenNthCalledWith(3, keyColumn, languages[2]);
    });

  test
    .setupMocks()
    .do(() => mockRead.mockReturnValue({}))
    .command(["update", ...Object.values(params)])
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
    .do(() => mockRead.mockReturnValue({ sheet1: mockSheetLines }))
    .stub(process, "cwd", jest.fn().mockReturnValue("/ROOT_PKG_PATH"))
    .command(["update", ...Object.values(params)])
    .it("writes language data in desired format into the output dir", () => {
      expect(mockWrite).toHaveBeenCalledTimes(3);
      expect(mockOraInstance.succeed).toHaveBeenCalledTimes(3);

      expect(mockWrite.mock.calls[0][0]).toEqual({
        language: languages[0],
        namespace: OTHER_TRANSLATIONS_NAMESPACE,
        outputDir: `/ROOT_PKG_PATH/${translationsDir}`,
      });
      expect(mockWrite.mock.calls[0][1]).toEqual(mockSheetLines);
      expect(mockOraInstance.succeed).toHaveBeenNthCalledWith(
        1,
        `All ${languages[0]} translations saved into ${translationsDir} as ${languages[0]}`
      );

      expect(mockWrite.mock.calls[1][0]).toEqual({
        language: languages[1],
        namespace: OTHER_TRANSLATIONS_NAMESPACE,
        outputDir: `/ROOT_PKG_PATH/${translationsDir}`,
      });
      expect(mockWrite.mock.calls[1][1]).toEqual(mockSheetLines);
      expect(mockOraInstance.succeed).toHaveBeenNthCalledWith(
        2,
        `All ${languages[1]} translations saved into ${translationsDir} as ${languages[1]}`
      );

      expect(mockWrite.mock.calls[2][0]).toEqual({
        language: languages[2],
        namespace: OTHER_TRANSLATIONS_NAMESPACE,
        outputDir: `/ROOT_PKG_PATH/${translationsDir}`,
      });
      expect(mockOraInstance.succeed).toHaveBeenNthCalledWith(
        3,
        `All ${languages[2]} translations saved into ${translationsDir} as ${languages[2]}`
      );
    });

  test
    .setupMocks()
    .stderr()
    .do(() => {
      mockRead
        .mockImplementationOnce(() => ({ sheet1: mockSheetLines }))
        .mockImplementationOnce(() => {
          throw new Error("Read spreadsheet error");
        });
    })
    .command(["update", ...Object.values(params)])
    .catch((error) => {
      expect(mockRead).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenCalledTimes(1);

      expect(mockOraInstance.fail).toHaveBeenCalledTimes(1);
      expect(mockOraInstance.fail).toHaveBeenCalledWith(
        `Generating ${languages[1]} translations failed.`
      );

      expect(mockOraInstance.succeed).toHaveBeenCalledTimes(1);
      expect(mockOraInstance.succeed).toHaveBeenCalledWith(
        `All ${languages[0]} translations saved into ${translationsDir} as ${languages[0]}`
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
    .command(["update", ...Object.values(params)])
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
          `All ${languages[2]} translations saved into ${translationsDir} as ${languages[2]}`
        );

        expect(console.error).toHaveBeenCalledTimes(2);
        expect((console.error as jest.Mock).mock.calls[0][0]).toContain(
          "No exit read cs error"
        );
        expect((console.error as jest.Mock).mock.calls[1][0]).toContain(
          "No exit write translations error"
        );
      }
    );

  const langsParam = `--languages=${languages[0]},${languages[1]}`;
  const threeSheets = {
    "sheet1 Title": mockSheetLines,
    "sheet2 Title": mockSheetLines2,
    "sheet3 Title": mockSheetLines3,
  };

  test
    .setupMocks()
    .stub(process, "cwd", jest.fn().mockReturnValue("/ROOT_PKG_PATH"))
    .do(() => {
      mockRead.mockReturnValue(threeSheets);
      mockSort.mockReturnValue([
        { ns: "sheet1-title", lines: mockSheetLines },
        { ns: "sheet2-title", lines: mockSheetLines2 },
        { ns: OTHER_TRANSLATIONS_NAMESPACE, lines: mockSheetLines3 },
      ]);
    })
    .command(["update", ...Object.values(params), langsParam])
    .it("writes all translations namespaces", () => {
      expect(mockWrite).toHaveBeenCalledTimes(6);
      expect(mockOraInstance.succeed).toHaveBeenCalledTimes(2);

      const writeCalls = mockWrite.mock.calls;

      expect(writeCalls[0][0]).toEqual({
        language: languages[0],
        namespace: "sheet1-title",
        outputDir: `/ROOT_PKG_PATH/${translationsDir}`,
      });
      expect(writeCalls[0][1]).toEqual(mockSheetLines);
      expect(writeCalls[1][0]).toEqual({
        language: languages[0],
        namespace: "sheet2-title",
        outputDir: `/ROOT_PKG_PATH/${translationsDir}`,
      });
      expect(writeCalls[1][1]).toEqual(mockSheetLines2);
      expect(writeCalls[2][0]).toEqual({
        language: languages[0],
        namespace: OTHER_TRANSLATIONS_NAMESPACE,
        outputDir: `/ROOT_PKG_PATH/${translationsDir}`,
      });
      expect(writeCalls[2][1]).toEqual(mockSheetLines3);

      expect(mockOraInstance.succeed).toHaveBeenNthCalledWith(
        1,
        `All ${languages[0]} translations saved into ${translationsDir} as sheet1-title.${languages[0]}, sheet2-title.${languages[0]}, ${languages[0]}`
      );

      expect(writeCalls[3][0]).toEqual({
        language: languages[1],
        namespace: "sheet1-title",
        outputDir: `/ROOT_PKG_PATH/${translationsDir}`,
      });
      expect(writeCalls[3][1]).toEqual(mockSheetLines);
      expect(writeCalls[4][0]).toEqual({
        language: languages[1],
        namespace: "sheet2-title",
        outputDir: `/ROOT_PKG_PATH/${translationsDir}`,
      });
      expect(writeCalls[4][1]).toEqual(mockSheetLines2);
      expect(writeCalls[5][0]).toEqual({
        language: languages[1],
        namespace: OTHER_TRANSLATIONS_NAMESPACE,
        outputDir: `/ROOT_PKG_PATH/${translationsDir}`,
      });
      expect(writeCalls[5][1]).toEqual(mockSheetLines3);

      expect(mockOraInstance.succeed).toHaveBeenNthCalledWith(
        2,
        `All ${languages[1]} translations saved into ${translationsDir} as sheet1-title.${languages[1]}, sheet2-title.${languages[1]}, ${languages[1]}`
      );
    });

  test
    .setupMocks()
    .stub(process, "cwd", jest.fn().mockReturnValue("/ROOT_PKG_PATH"))
    .do(() => {
      mockRead.mockReturnValue(threeSheets);
      mockSort.mockReturnValue([
        { ns: "sheet1-title", lines: mockSheetLines },
        { ns: "sheet2-title", lines: mockSheetLines2 },
        { ns: "sheet3-title", lines: mockSheetLines3 },
      ]);
      when(mockWrite)
        .calledWith(
          {
            language: languages[0],
            namespace: "sheet2-title",
            outputDir: `/ROOT_PKG_PATH/${translationsDir}`,
          },
          mockSheetLines2,
          jsonTransformer
        )
        .mockRejectedValueOnce(new Error(`Write error`));
    })
    .command(["update", ...Object.values(params), langsParam])
    .it(
      "write other languages translations if writing of one namespace translations fail",
      () => {
        expect(mockWrite).toHaveBeenCalledTimes(6);
        expect(mockOraInstance.fail).toHaveBeenCalledTimes(1);

        expect(mockWrite).toHaveBeenCalledWith(
          {
            outputDir: `/ROOT_PKG_PATH/${translationsDir}`,
            language: languages[0],
            namespace: "sheet1-title",
          },
          mockSheetLines,
          expect.anything()
        );
        expect(mockWrite).toHaveBeenCalledWith(
          {
            outputDir: `/ROOT_PKG_PATH/${translationsDir}`,
            language: languages[0],
            namespace: "sheet2-title",
          },
          mockSheetLines2,
          expect.anything()
        );
        expect(mockWrite).toHaveBeenCalledWith(
          {
            outputDir: `/ROOT_PKG_PATH/${translationsDir}`,
            language: languages[0],
            namespace: "sheet3-title",
          },
          mockSheetLines3,
          expect.anything()
        );

        expect(mockOraInstance.fail).toHaveBeenNthCalledWith(
          1,
          `Generating ${languages[0]} translations failed.`
        );

        expect(mockWrite).toHaveBeenCalledWith(
          {
            outputDir: `/ROOT_PKG_PATH/${translationsDir}`,
            language: languages[1],
            namespace: "sheet1-title",
          },
          mockSheetLines,
          expect.anything()
        );
        expect(mockWrite).toHaveBeenCalledWith(
          {
            outputDir: `/ROOT_PKG_PATH/${translationsDir}`,
            language: languages[1],
            namespace: "sheet2-title",
          },
          mockSheetLines2,
          expect.anything()
        );
        expect(mockWrite).toHaveBeenCalledWith(
          {
            outputDir: `/ROOT_PKG_PATH/${translationsDir}`,
            language: languages[1],
            namespace: "sheet3-title",
          },
          mockSheetLines3,
          expect.anything()
        );

        expect(mockOraInstance.succeed).toHaveBeenNthCalledWith(
          1,
          `All ${languages[1]} translations saved into ${translationsDir} as sheet1-title.en-us, sheet2-title.en-us, sheet3-title.en-us`
        );
      }
    );

  test
    .setupMocks()
    .do(() => {
      mockRead.mockReturnValue({
        sheet0: [],
        sheet1: mockSheetLines,
        sheet2: mockSheetLines2,
      });
      mockSort.mockReturnValue([
        { ns: "sheet0", lines: [] },
        { ns: "sheet1", lines: mockSheetLines },
        { ns: "sheet2", lines: mockSheetLines2 },
      ]);
    })
    .stub(process, "cwd", jest.fn().mockReturnValue("/ROOT_PKG_PATH"))
    .command(["update", ...Object.values(params), langsParam])
    .it("should skip creating of file for empty namespace translations", () => {
      expect(mockWrite).toHaveBeenCalledTimes(4);
      expect(mockOraInstance.succeed).toHaveBeenCalledTimes(2);

      expect(mockWrite).toHaveBeenCalledWith(
        {
          outputDir: `/ROOT_PKG_PATH/${translationsDir}`,
          language: languages[0],
          namespace: "sheet1",
        },
        mockSheetLines,
        expect.anything()
      );
      expect(mockWrite).toHaveBeenCalledWith(
        {
          outputDir: `/ROOT_PKG_PATH/${translationsDir}`,
          language: languages[0],
          namespace: "sheet2",
        },
        mockSheetLines2,
        expect.anything()
      );

      expect(mockOraInstance.succeed).toHaveBeenNthCalledWith(
        1,
        `All ${languages[0]} translations saved into ${translationsDir} as sheet1.cs, sheet2.cs`
      );

      expect(mockWrite).toHaveBeenCalledWith(
        {
          outputDir: `/ROOT_PKG_PATH/${translationsDir}`,
          language: languages[1],
          namespace: "sheet1",
        },
        mockSheetLines,
        expect.anything()
      );
      expect(mockWrite).toHaveBeenCalledWith(
        {
          outputDir: `/ROOT_PKG_PATH/${translationsDir}`,
          language: languages[1],
          namespace: "sheet2",
        },
        mockSheetLines2,
        expect.anything()
      );

      expect(mockOraInstance.succeed).toHaveBeenNthCalledWith(
        2,
        `All ${languages[1]} translations saved into ${translationsDir} as sheet1.en-us, sheet2.en-us`
      );
    });

  // TODO - warn if there is sheets filter turned
  // on and so not all sheets are included in processing
});
