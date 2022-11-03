import * as path from "path";
import { flags } from "@oclif/command";
import { CLIError } from "@oclif/errors";
import * as ora from "ora";
import * as flat from "array.prototype.flat";
import {
  Reader,
  OutputFormat,
  WorksheetReader,
  InvalidFilterError,
  transformersByFormat,
  FileWriter,
  FatalError,
  loadPlugins,
  NAME,
  Sorter,
} from "@lokse/core";

import logger from "../logger";
import Base from "../base";

import { id as idFlag } from "../flags";
import { MissingFlagValue, IncorrectFlagValue } from "../flags/errors";

flat.shim();

const outputFormats = Object.values(OutputFormat);
const defaultFormat = OutputFormat.JSON;

class Update extends Base {
  static description = "update translations from localization spreadsheet";

  static examples = [
    `$ ${NAME} update`,
    `$ ${NAME} update -i 1HKjvejcuHIY73WvEkipD7_dmF9dFeNLji3nS2RXcIzk -d locales -l cz,en,fr -t key_web`,
  ];

  static flags = {
    help: flags.help({ char: "h" }),
    id: idFlag.flag(),
    dir: flags.string({ char: "d", name: "dir", description: "output folder" }),
    languages: flags.string({
      char: "l",
      description:
        "translation columns languages. Multiple values are comma separated. For example cs,en,fr",
    }),
    col: flags.string({
      char: "c",
      description: "column containing translations keys. For example key_web.",
    }),
    format: flags.enum({
      char: "f",
      options: outputFormats,
      description: `output format. Default is ${defaultFormat}.`,
    }),
    sheets: flags.string({
      char: "s",
      description:
        "sheets to get translations from. Name or list of names, comma separated. For example Translations1,Translations2",
    }),
  };

  async run(): Promise<void> {
    const { flags } = this.parse(Update);

    const sheetId = flags.id ?? "";
    const dir = flags.dir ?? this.conf?.dir;
    const languages = flags.languages?.split(",") ?? this.conf?.languages;
    const column = flags.col ?? this.conf?.column;
    const format = flags.format ?? this.conf?.format ?? defaultFormat;
    const sheets = flags.sheets?.split(",") ?? this.conf?.sheets;

    idFlag.invariant(sheetId, "update");

    if (!dir) {
      throw new MissingFlagValue("Output directory", "update");
    }

    if (!column) {
      throw new MissingFlagValue(`Keys column`, "update");
    }

    if (!Array.isArray(languages)) {
      throw new IncorrectFlagValue(
        `🤷‍♂️ Translation columns have to be list of languages, but ${languages} given`
      );
    }

    let worksheetReader;

    try {
      worksheetReader = new WorksheetReader(sheets, { logger });
    } catch (error) {
      const normalizedError =
        error instanceof InvalidFilterError
          ? new IncorrectFlagValue(error.message)
          : error;

      throw normalizedError;
    }

    const plugins = loadPlugins(
      this.conf?.plugins ?? [],
      { logger },
      { languages }
    );
    const outputTransformer = transformersByFormat[format];
    const reader = new Reader(sheetId, worksheetReader, plugins, {
      logger,
    });
    const writer = new FileWriter(plugins);

    const outputDir = path.resolve(process.cwd(), dir);
    const relativeOutputPath = path.relative(process.cwd(), outputDir);

    const sorter = new Sorter(plugins);

    for (const language of languages) {
      const spinner = ora({ spinner: "dots" });

      spinner.start(
        `Saving ${language} translations into ${relativeOutputPath}`
      );

      // Reason: Process languages sequentially
      /* eslint-disable no-await-in-loop */
      try {
        const linesByWorkshet = await reader.read(column, language);
        const allWorksheetLines = Object.values(linesByWorkshet).flat();

        if (allWorksheetLines.length === 0) {
          spinner.warn(`Received empty lines set for language ${language}`);
          continue;
        }

        const linesWithDomain = await sorter.sort(linesByWorkshet, language);

        const writtenFiles = await Promise.all(
          linesWithDomain.map(({ lines, ns }) => {
            if (lines.length === 0) {
              return null;
            }

            const fileInfo = {
              language,
              namespace: ns,
              outputDir,
            };

            return writer.write(fileInfo, lines, outputTransformer);
          })
        ).catch((error) => {
          throw new CLIError(error, { exit: false });
        });

        const outFiles = writtenFiles.filter(Boolean).join(", ");
        spinner.succeed(
          `All ${language} translations saved into ${relativeOutputPath} as ${outFiles}`
        );
      } catch (error) {
        spinner.fail(`Generating ${language} translations failed.`);

        const normalizedError =
          error instanceof FatalError ? new CLIError(error) : error;

        this.error(normalizedError, {
          exit: normalizedError?.oclif?.exit,
        });
      }
    }
  }
}

export = Update;
