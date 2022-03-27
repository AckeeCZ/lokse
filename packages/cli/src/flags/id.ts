import { flags } from "@oclif/command";
import { getConfig } from "@lokse/core";
import { MissingFlagValue } from "./errors";

export const flag = flags.build({
  char: "i",
  description: "spreadsheet id",

  default: ({ flags }) => {
    const conf = getConfig();
    const id = process.env.SPREADSHEET_ID ?? flags.id ?? conf?.sheetId;

    return id;
  },
});

export const invariant = (id?: string): void => {
  if (!id) {
    throw new MissingFlagValue("Sheet id");
  }
};
