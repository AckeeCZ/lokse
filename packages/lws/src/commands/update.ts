import * as path from "path";
import { flags } from "@oclif/command";
import * as ora from "ora";

import Base from "../base";
import { OutputFormat } from "../constants";
import Reader from "../core/reader";
import { transformersByFormat } from "../core/transformer";
import { FileWriter } from "../core/writer";

class IncorrectFlagValue extends Error {}

class MissingFlagValue extends Error {
  constructor(flagName: string) {
    super(`${flagName} is required for updating translations`);
  }
}

const outputFormats = Object.values(OutputFormat);
const defaultFormat = OutputFormat.JSON;

export default class Update extends Base {
  static description = "updates localization files";

  static examples = [
    "$ lws update -i 1HKjvejcuHIY73WvEkipD7_dmF9dFeNLji3nS2RXcIzk -d locales -l cz,en,fr -t key_web",
  ];

  static flags = {
    help: flags.help({ char: "h" }),
    id: flags.string({ char: "i", name: "id", description: "Spreadsheet ID" }),
    dir: flags.string({ char: "d", name: "dir", description: "Output folder" }),
    languages: flags.string({
      char: "l",
      name: "languages",
      description:
        "Translation columns languages. Multiple values are comma separated. For example cs,en,fr",
    }),
    col: flags.string({
      char: "c",
      name: "col",
      description: "Column containing translations keys. For example key_web.",
    }),
    format: flags.enum({
      char: "f",
      name: "format",
      options: outputFormats,
      description: `Output format. One of ${outputFormats.join(
        ", "
      )}. Default is ${defaultFormat}.`,
    }),
  };

  async run() {
    const { flags } = this.parse(Update);

    const sheetId = flags.id ?? this.conf?.sheet_id;
    const dir = flags.dir ?? this.conf?.dir;
    const languages = flags.languages?.split(",") ?? this.conf?.languages;
    const column = flags.col ?? this.conf?.column;
    const format = flags.format ?? this.conf?.format ?? defaultFormat;

    // TODO: polish error messages
    if (!sheetId) {
      throw new MissingFlagValue("Sheet id");
    }

    if (!dir) {
      throw new MissingFlagValue("Output directory");
    }

    if (!column) {
      throw new MissingFlagValue(`Keys column`);
    }

    if (!Array.isArray(languages)) {
      throw new IncorrectFlagValue(
        `Translation columns have to be list of languages, but ${languages} given`
      );
    }

    if (!outputFormats.includes(format)) {
      throw new IncorrectFlagValue(
        `Format has to be one of ${outputFormats.join(
          ", "
        )}, but ${format} given`
      );
    }

    const outputTransformer = transformersByFormat[format];

    const reader = new Reader(sheetId, "*");
    const writer = new FileWriter();

    languages.forEach(async (language) => {
      const spinner = ora({ spinner: "dots" });
      const outputPath = path.join(
        process.cwd(),
        dir,
        outputTransformer.getFileName(language)
      );

      spinner.start(`Saving ${outputPath}`);

      const lines = await reader.read(column, language.toUpperCase());

      if (lines.length === 0) {
        spinner.warn(`Received empty lines set for language ${language}`);
      } else {
        writer.write(outputPath, lines, outputTransformer);
        spinner.succeed();
      }
    });
  }
}
