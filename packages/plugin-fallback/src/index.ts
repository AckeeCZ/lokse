import { createPlugin, PluginError, isEqualCaseInsensitive } from "@lokse/core";
import type {
  GeneralPluginOptions,
  GeneralPluginMeta,
  LoksePlugin,
} from "@lokse/core";

export interface PluginOptions extends GeneralPluginOptions {
  defaultLanguage: string;
}

const NOT_FOUND_KEY = "NOT_FOUND_KEY";

export default function (
  { defaultLanguage, logger }: PluginOptions,
  { languages }: GeneralPluginMeta
): LoksePlugin {
  if (!defaultLanguage) {
    throw new PluginError("Default language must be supplied");
  }

  if (!languages.includes(defaultLanguage)) {
    throw new PluginError(
      `Supplied default language ${defaultLanguage} is not available in list of languages ${languages.join(
        ","
      )}`
    );
  }

  const isDefaultLang = (key: string) =>
    isEqualCaseInsensitive(key, defaultLanguage);

  return createPlugin({
    async readTranslation(line, meta) {
      if (line.key && !line.value) {
        const defaultLanguageKey =
          Object.keys(meta.row).find(isDefaultLang) ?? NOT_FOUND_KEY;

        const fallbackLanguageValue = meta.row[defaultLanguageKey] ?? "";

        // TODO - make this option driven
        if (!fallbackLanguageValue) {
          logger.warn(`Fallback translation of key "${meta.key}" not found`);
        }

        line.setValue(fallbackLanguageValue);
      }

      return line;
    },
  });
}
