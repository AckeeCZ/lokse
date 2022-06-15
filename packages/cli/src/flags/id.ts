import { Flags } from "@oclif/core";
import { getConfig } from "@lokse/core";
import { MissingFlagValue } from "./errors";
import type { Action } from "./errors";

export const flag = Flags.build({
  char: "i",
  description: "spreadsheet id",

  default: async ({ flags }) => {
    const conf = await getConfig();
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
