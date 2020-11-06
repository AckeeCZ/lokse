import { flags } from "@oclif/command";
import { MissingFlagValue } from "./errors";
import * as config from "../config";

export const flag = flags.build({
  char: "i",
  description: "spreadsheet id",

  default: ({ flags }) => {
    const conf = config.get();
    const id = process.env.SPREADSHEET_ID ?? flags.id ?? conf?.sheetId;

    return id;
  },
});

export const invariant = (id?: string) => {
  if (!id) {
    throw new MissingFlagValue("Sheet id");
  }
};
