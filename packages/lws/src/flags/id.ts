import { flags } from "@oclif/command";
import { MissingFlagValue } from "./errors";
import * as config from "../config";

const spreadsheetId = flags.build({
  char: "i",
  name: "id",
  description: "Spreadsheet ID",

  default: ({ flags }) => {
    const conf = config.get();
    const id = process.env.SPREADSHEET_ID ?? flags.id ?? conf?.sheet_id;

    if (!id) {
      throw new MissingFlagValue("Sheet id");
    }

    return id;
  },
});

export default spreadsheetId;
