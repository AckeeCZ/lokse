import { identity } from "lodash";

import Line from "../line";
import type { Logger } from "../logger";

export interface LoksePlugin {
  transformLine: (line: Line) => Line | Promise<Line>;
  transformFullOutput: (output: string) => string | Promise<string>;
}

export interface NamedLoksePlugin extends LoksePlugin {
  pluginName: string;
}

export interface GeneralPluginOptions {
  logger: Logger;
}

export type PluginFactory = (options: GeneralPluginOptions) => LoksePlugin;

const pluginDefaults: LoksePlugin = {
  transformLine: identity,
  transformFullOutput: identity,
};

export function createPlugin(plugin: Partial<LoksePlugin>) {
  return {
    ...pluginDefaults,
    ...plugin,
  };
}
