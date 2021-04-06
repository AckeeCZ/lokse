import { cosmiconfigSync } from "cosmiconfig";
import { OutputFormat } from "@lokse/core";
import type { SheetsFilter } from "@lokse/core";

import { NAME } from "./constants";

// TODO: use async API once custom oclif flags will be asynchronous
const explorerSync = cosmiconfigSync(NAME);

export type ConfigType = {
  sheetId?: string;
  dir?: string;
  languages?: string[];
  column?: string;
  format?: typeof OutputFormat;
  sheets?: SheetsFilter;
  splitTranslations?: boolean | string[];
};

export function get(): undefined | null | ConfigType {
  const result = explorerSync.search();
  return result?.config;
}
