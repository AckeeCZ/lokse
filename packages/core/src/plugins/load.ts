import type {
  NamedLoksePlugin,
  PluginFactory,
  GeneralPluginOptions,
  GeneralPluginMeta,
} from "./create";
import { PluginsRunner } from "./runner";

export class PluginError extends Error {}

function interopRequire(path: string) {
  const obj = require(path);
  return obj && obj.__esModule ? obj.default : obj;
}

function loadPlugin(
  plugin: PluginName | PluginDefinition,
  options: GeneralPluginOptions,
  meta: GeneralPluginMeta
): NamedLoksePlugin | null {
  const pluginName = typeof plugin === "string" ? plugin : plugin.name;
  const pluginOptions =
    typeof plugin === "string" ? options : { ...options, ...plugin.options };

  try {
    const pluginFactory: PluginFactory = interopRequire(pluginName);
    const loadedPlugin = pluginFactory(pluginOptions, meta);

    return {
      ...loadedPlugin,
      pluginName,
    };
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND") {
      options.logger.warn(
        `🔍 Unable to load plugin ${pluginName}. Is it installed?`
      );
    } else if (error instanceof PluginError) {
      options.logger.warn(
        `🙅 Plugin ${pluginName} cannot been loaded: ${error.message}`
      );
    } else {
      options.logger.warn(
        `💥 Unexpected error occurred when loading plugin ${pluginName}:\n${error.message}`
      );
    }

    return null;
  }
}

export type PluginName = string;
export interface PluginDefinition {
  name: PluginName;
  options: object;
}

export function loadPlugins(
  plugins: (PluginName | PluginDefinition)[] | unknown = [],
  options: GeneralPluginOptions,
  meta: GeneralPluginMeta
) {
  let loadedPlugins: NamedLoksePlugin[];

  if (Array.isArray(plugins)) {
    loadedPlugins = plugins
      .map((plugin) => loadPlugin(plugin, options, meta))
      .filter((plugin: unknown): plugin is NamedLoksePlugin => Boolean(plugin));
  } else {
    options.logger.warn(`Plugins list must be an array, got ${typeof plugins}`);
    loadedPlugins = [];
  }

  return new PluginsRunner(loadedPlugins, options);
}
