import { createPlugin } from "@lokse/core";
import type { GeneralPluginOptions, LoksePlugin } from "@lokse/core";

interface PluginOptions {
  defaultLanguage: string;
}

export default function (
  options: GeneralPluginOptions & PluginOptions
): LoksePlugin {
  if (!options.defaultLanguage) {
    throw new Error("Fallback language requires default language to be passed");
  }

  // TODO - check default language is from the list of available languages

  return createPlugin({
    async readTranslation(line, meta) {
      if (!line.value) {
        const fallbackLanguageValue = meta.row[options.defaultLanguage] ?? "";

        // TODO - make this option driven
        if (!fallbackLanguageValue) {
          options.logger.warn(`Fallback translation of ${meta.key} not found`);
        }

        line.setValue(fallbackLanguageValue);
      }

      return line;
    },
  });
}
