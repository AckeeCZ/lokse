import { cosmiconfigSync } from "cosmiconfig";
import { NAME, OutputFormat } from "./constants";
// TODO: use async API once custom oclif flags will be asynchronous
const explorerSync = cosmiconfigSync(NAME);

export type ConfigType = {
  sheet_id?: string;
  dir?: string;
  languages?: string[];
  column?: string;
  format?: typeof OutputFormat;
};

export function get(): undefined | null | ConfigType {
  const result = explorerSync.search();
  return result?.config;
}
