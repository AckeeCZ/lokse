import { createPlugin, PluginError, isEqualCaseInsensitive } from "@lokse/core";
import type {
  GeneralPluginOptions,
  GeneralPluginMeta,
  LoksePlugin,
} from "@lokse/core";

export interface PluginOptions extends GeneralPluginOptions {
  defaultLanguage: string;
  logMissingFallback?: boolean;
}

const NOT_FOUND_KEY = "NOT_FOUND_KEY";

export default function (
  options: PluginOptions,
  { languages }: GeneralPluginMeta
): LoksePlugin {
  const { defaultLanguage } = options;

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

  const logMissingFallback = options.logMissingFallback ?? true;

  const isDefaultLang = (key: string) =>
    isEqualCaseInsensitive(key, defaultLanguage);

  return createPlugin({
    async readTranslation(line, meta) {
      if (line.key && !line.value) {
        const defaultLanguageKey =
          Object.keys(meta.row).find(isDefaultLang) ?? NOT_FOUND_KEY;

        const fallbackLanguageValue = meta.row[defaultLanguageKey] ?? "";

        if (logMissingFallback && !fallbackLanguageValue) {
          options.logger.warn(
            `Fallback translation of key "${meta.key}" not found`
          );
        }

        line.setValue(fallbackLanguageValue);
      }

      return line;
    },
  });
}
