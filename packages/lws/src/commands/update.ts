import * as path from "path";
import { flags } from "@oclif/command";
import Base from "../base";
import { get } from "lodash";
import Localize from "../localize";

export default class Update extends Base {
  static description = "updates localization files";

  static examples = [
    "$ lws update -i 1HKjvejcuHIY73WvEkipD7_dmF9dFeNLji3nS2RXcIzk -d locales/ -c cz,en,fr",
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
    type: flags.string({
      char: "t",
      name: "type",
      description: "Type (key_web, key_android, key_ios)",
    }),
    // flag with no value (-f, --force)
    // force: flags.boolean({char: 'f'}),
  };

  static args = [{ name: "file" }];

  async run() {
    const { flags } = this.parse(Update);

    const sheetID =
      flags.id ?? get(this.config, "localization.sheet_id", false);
    const dir = flags.dir ?? get(this.config, "localization.dir", false);
    const cols = flags.cols ?? get(this.config, "localization.cols", false);
    const type = flags.type ?? get(this.config, "localization.type", false);

    const transformer = Localize.fromGoogleSpreadsheet(sheetID, "*");

    // Key for web
    transformer.setKeyCol(type);

    // Web
    if (type === "key_web") {
      const translations = cols.split(",");
      translations.map((item) => {
        const filePath = path.join(
          process.cwd(),
          dir,
          item.toLowerCase() + ".json"
        );
        transformer.save(filePath, {
          valueCol: item.toUpperCase(),
          format: "web",
        });
      });
    }

    // ANDROID
    if (type === "key_android") {
      const translations = cols.split(",");
      translations.map((item) => {
        const filePath = path.join(
          process.cwd(),
          dir,
          "values-" + item.toLowerCase(),
          "strings.xml"
        );
        // Android - support <plurals> tag
        transformer.save(filePath, {
          valueCol: item.toUpperCase(),
          format: "android",
        });
      });
    }

    // iOS
    if (type === "key_ios") {
      const translations = cols.split(",");
      translations.map((item) => {
        const filePath = path.join(
          process.cwd(),
          dir,
          item.toLowerCase() + ".lproj",
          "Localizable.strings"
        );
        transformer.save(filePath, {
          valueCol: item.toUpperCase(),
          format: "ios",
        });
      });
    }
  }
}
