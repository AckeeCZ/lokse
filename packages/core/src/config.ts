import { cosmiconfig } from "cosmiconfig";
import typeScriptLoader from "cosmiconfig-ts-loader";

import { OutputFormat, NAME } from "./constants";
import type { PluginDefinition, PluginName } from "./plugins";
import type { SheetsFilter } from "./reader";

const explorer = cosmiconfig(NAME, {
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

export async function getConfig(
  searchFrom: string | undefined = process.env.LOKSE_CONFIG_PATH
): Promise<undefined | null | LokseConfig> {
  const result = await explorer.search(searchFrom);

  return result?.config;
}
