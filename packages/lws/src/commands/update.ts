import * as path from "path";
import { flags } from "@oclif/command";
import Base from "../base";
import Localize from "../localize";

class IncorrectFlagValue extends Error {}

class MissingFlagValue extends Error {}

const types = ["key_web", "key_android", "key_ios"];

export default class Update extends Base {
  static description = "updates localization files";

  static examples = [
    "$ lws update -i 1HKjvejcuHIY73WvEkipD7_dmF9dFeNLji3nS2RXcIzk -d locales -c cz,en,fr -t key_web",
  ];

  static flags = {
    help: flags.help({ char: "h" }),
    id: flags.string({ char: "i", name: "id", description: "Spreadsheet ID" }),
    dir: flags.string({ char: "d", name: "dir", description: "Output folder" }),
    cols: flags.string({
      char: "c",
      name: "cols",
      description: "Translation columns",
    }),
    type: flags.enum({
      char: "t",
      name: "type",
      options: types,
      description: `Type (${types.join(", ")})`,
    }),
  };

  async run() {
    const { flags } = this.parse(Update);

    const sheetId = flags.id ?? this.conf?.sheet_id;
    const dir = flags.dir ?? this.conf?.dir;
    const cols = flags.cols?.split(",") ?? this.conf?.cols;
    const type = flags.type ?? this.conf?.type;

    // TODO: polish error messages
    if (!sheetId) {
      throw new MissingFlagValue("Sheet id is required to update translations");
    }

    if (!dir) {
      throw new MissingFlagValue("Output directory is required");
    }

    if (!Array.isArray(cols)) {
      throw new IncorrectFlagValue(
        `Translation columns have to be list of languages, but ${cols} given`
      );
    }

    if (!types.includes(type)) {
      throw new IncorrectFlagValue(
        `Type has to be one of ${types.join(", ")}, but ${type} given`
      );
    }

    const transformer = Localize.fromGoogleSpreadsheet(sheetId, "*");

    // Key for web
    transformer.setKeyCol(type);

    let fileName: (item: string) => string;
    let format: string;

    switch (type) {
      // Web
      case "key_web": {
        format = "web";
        fileName = (item) => item.toLowerCase() + ".json";
        break;
      }
      // ANDROID
      case "key_android": {
        format = "android";
        fileName = (item) => `values-${item.toLowerCase()}strings.xml`;
        break;
      }
      case "key_ios": {
        format = "ios";
        fileName = (item) => `${item.toLowerCase()}.lproj/Localizable.strings`;
        break;
      }
      default:
        break;
    }

    cols.forEach((item) => {
      const filePath = path.join(process.cwd(), dir, fileName(item));
      transformer.save(filePath, {
        valueCol: item.toUpperCase(),
        format,
      });
    });
  }
}
