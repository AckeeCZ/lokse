import { cosmiconfigSync } from "cosmiconfig";
import typeScriptLoader from "cosmiconfig-ts-loader";

import { OutputFormat, NAME } from "./constants";
import type { PluginDefinition, PluginName } from "./plugins";
import type { SheetsFilter } from "./reader";

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

export type LokseConfig = {
  sheetId?: string;
  dir?: string;
  languages?: string[];
  column?: string;
  format?: typeof OutputFormat;
  sheets?: SheetsFilter;
  splitTranslations?: boolean | string[];
  plugins?: (PluginName | PluginDefinition)[];
};

export function get(
  searchFrom: string | undefined = process.env.LOKSE_CONFIG_PATH
): undefined | null | LokseConfig {
  const result = explorerSync.search(searchFrom);
  return result?.config;
}
