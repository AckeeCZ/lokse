import { createPlugin } from "@lokse/core";
import type {
  GeneralPluginOptions,
  GeneralPluginMeta,
  LoksePlugin,
} from "@lokse/core";

export interface PluginOptions extends GeneralPluginOptions {
  defaultLanguage: string;
}

export default function (
  { defaultLanguage, logger }: PluginOptions,
  { languages }: GeneralPluginMeta
): LoksePlugin {
  if (!defaultLanguage) {
    throw new Error("Fallback language requires default language to be passed");
  }

  if (!languages.includes(defaultLanguage)) {
    throw new Error(
      `Supplied default language ${defaultLanguage} is not available in list of languages ${languages.join(
        ","
      )}`
    );
  }

  return createPlugin({
    async readTranslation(line, meta) {
      if (!line.value) {
        const fallbackLanguageValue = meta.row[defaultLanguage] ?? "";

        // TODO - make this option driven
        if (!fallbackLanguageValue) {
          logger.warn(`Fallback translation of ${meta.key} not found`);
        }

        line.setValue(fallbackLanguageValue);
      }

      return line;
    },
  });
}
