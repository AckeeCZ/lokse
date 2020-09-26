import { flags } from "@oclif/command";
import * as open from "open";

import { NAME } from "../constants";
import Base from "../base";
import * as cliFlags from "../flags";

class Open extends Base {
  static description = "open localization spreadsheet in default browser";

  static examples = [
    `$ ${NAME} open -i 1HKjvejcuHIY73WvEkipD7_dmF9dFeNLji3nS2RXcIzk`,
  ];

  static flags = {
    help: flags.help({ char: "h" }),
    id: cliFlags.id.flag(),
  };

  async run() {
    const { flags } = this.parse(Open);

    const sheetId = flags.id;

    cliFlags.id.invariant(sheetId);

    await open(`https://docs.google.com/spreadsheets/d/${sheetId}`);
  }
}

export = Open;
