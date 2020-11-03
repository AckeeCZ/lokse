import { cosmiconfigSync } from "cosmiconfig";
import { NAME, OutputFormat } from "./constants";
import { SheetsFilter } from "./core/reader/worksheet-reader";
// TODO: use async API once custom oclif flags will be asynchronous
const explorerSync = cosmiconfigSync(NAME);

export type ConfigType = {
  sheetId?: string;
  dir?: string;
  languages?: string[];
  column?: string;
  format?: typeof OutputFormat;
  sheets?: SheetsFilter;
};

export function get(): undefined | null | ConfigType {
  const result = explorerSync.search();
  return result?.config;
}
