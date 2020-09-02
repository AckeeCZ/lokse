import * as path from "path";
import { flags } from "@oclif/command";

import Base from "../base";
import Localize from "../localize";
import { OutputFormat } from "../constants";
import Transformer from "../core/transformer";

class IncorrectFlagValue extends Error {}

class MissingFlagValue extends Error {}

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
    const column = flags.col?.split(",") ?? this.conf?.column;
    const format = flags.format ?? this.conf?.format ?? defaultFormat;

    // TODO: polish error messages
    if (!sheetId) {
      throw new MissingFlagValue("Sheet id is required to update translations");
    }

    if (!dir) {
      throw new MissingFlagValue("Output directory is required");
    }

    if (!column) {
      throw new MissingFlagValue(`Keys column has to be defined!`);
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

    const outputTransformer = Transformer[format];
    const transformer = Localize.fromGoogleSpreadsheet(sheetId, "*");

    // Key for web
    transformer.setKeyCol(column);

    languages.forEach((language) => {
      const filePath = path.join(
        process.cwd(),
        dir,
        outputTransformer.getFileName(language)
      );
      transformer.save(filePath, {
        valueCol: language.toUpperCase(),
        format,
      });
    });
  }
}
