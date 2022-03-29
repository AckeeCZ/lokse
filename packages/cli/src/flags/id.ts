import { flags } from "@oclif/command";
import { getConfig } from "@lokse/core";
import { MissingFlagValue } from "./errors";
import type { Action } from "./errors";

export const flag = flags.build({
  char: "i",
  description: "spreadsheet id",

  default: ({ flags }) => {
    const conf = getConfig();
    const id = process.env.SPREADSHEET_ID ?? flags.id ?? conf?.sheetId;

    return id;
  },
});

export function invariant(
  id: string | undefined,
  action: Action
): asserts id is string {
  if (!id) {
    throw new MissingFlagValue("Sheet id", action);
  }
}
