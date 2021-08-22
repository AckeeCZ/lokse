import { cosmiconfigSync } from "cosmiconfig";
import typeScriptLoader from "cosmiconfig-ts-loader";
import { OutputFormat } from "@lokse/core";
import type { PluginName, PluginDefinition, SheetsFilter } from "@lokse/core";

import { NAME } from "./constants";

// TODO: use async API once custom oclif flags will be asynchronous
const explorerSync = cosmiconfigSync(NAME, {
  searchPlaces: [
    "package.json",
    `.${NAME}rc`,
    `.${NAME}rc.json`,
    `.${NAME}rc.yaml`,
    `.${NAME}rc.yml`,
    `.${NAME}rc.ts`,
    `.${NAME}rc.js`,
    `.${NAME}rc.cjs`,
    `${NAME}.config.ts`,
    `${NAME}.config.js`,
    `${NAME}.config.cjs`,
  ],
  loaders: {
    ".ts": typeScriptLoader({
      compilerOptions: {
        target: "ES5",
        module: "Commonjs",
      },
    }),
  },
});

export type ConfigType = {
  sheetId?: string;
  dir?: string;
  languages?: string[];
  column?: string;
  format?: typeof OutputFormat;
  sheets?: SheetsFilter;
  splitTranslations?: boolean | string[];
  plugins?: (PluginName | PluginDefinition)[];
};

export function get(): undefined | null | ConfigType {
  const result = explorerSync.search();
  return result?.config;
}
