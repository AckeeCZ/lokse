import * as path from "path";
import { flags } from "@oclif/command";
import * as ora from "ora";

import { NAME } from "../constants";
import Base from "../base";
import { OutputFormat } from "../constants";
import Reader, { WorksheetReader } from "../core/reader";
import { transformersByFormat } from "../core/transformer";
import { FileWriter } from "../core/writer";
import * as cliFlags from "../flags";
import { MissingFlagValue, IncorrectFlagValue } from "../flags/errors";

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
    id: cliFlags.id.flag(),
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

  async run() {
    const { flags } = this.parse(Update);

    const sheetId = flags.id ?? "";
    const dir = flags.dir ?? this.conf?.dir;
    const languages = flags.languages?.split(",") ?? this.conf?.languages;
    const column = flags.col ?? this.conf?.column;
    const format = flags.format ?? this.conf?.format ?? defaultFormat;
    const sheets = flags.sheets?.split(",") ?? this.conf?.sheets;
    const splitTranslations = false;

    cliFlags.id.invariant(sheetId);

    if (!dir) {
      throw new MissingFlagValue("Output directory");
    }

    if (!column) {
      throw new MissingFlagValue(`Keys column`);
    }

    if (!Array.isArray(languages)) {
      throw new IncorrectFlagValue(
        `🤷‍♂️ Translation columns have to be list of languages, but ${languages} given`
      );
    }

    if (sheets !== undefined && !WorksheetReader.isValidFilter(sheets)) {
      throw new IncorrectFlagValue(
        `🤷‍♂️ Sheets filter have to be string name or array of names, but ${sheets} given`
      );
    }

    const outputTransformer = transformersByFormat[format];

    const reader = new Reader(sheetId, sheets);
    const writer = new FileWriter();

    for (const language of languages) {
      const spinner = ora({ spinner: "dots" });

      const outputFileName = outputTransformer.getFileName(language);
      const outputPath = path.resolve(process.cwd(), dir, outputFileName);
      const relativeOutputPath = path.relative(process.cwd(), outputPath);
      const langName = `${language}`;

      spinner.start(
        `Saving ${langName} translations into ${relativeOutputPath}`
      );

      try {
        // Reason: Process languages sequentially
        // eslint-disable-next-line no-await-in-loop
        const linesByWorkshet = await reader.read(column, language);
        const worksheetsLinesEntries = Object.entries(linesByWorkshet);

        if (worksheetsLinesEntries.length === 0) {
          spinner.warn(`Received empty lines set for language ${langName}`);
          continue;
        }

        if (splitTranslations && outputTransformer.supportsSplit) {
          continue;
        } else {
          const allLines = worksheetsLinesEntries
            .map(([_, lines]) => lines)
            .flat();

          writer.write(outputPath, allLines, outputTransformer);
          spinner.succeed(
            `${langName} translations saved into ${relativeOutputPath}`
          );
        }
      } catch (error) {
        spinner.fail(`Generating ${langName} translations failed.`);

        this.error(error, {
          exit: error?.oclif?.exit,
        });
      }
    }
  }
}

export = Update;
