import { createPlugin } from "@lokse/core";
import type { GeneralPluginOptions, LoksePlugin } from "@lokse/core";

interface Patterns {
  [key: string]: RegExp;
}

const czechPatterns: Patterns = {
  cs: /(\s|^)(a|i|k|o|s|u|v|z)(\s+)/gim,
  "cs-cz": /(\s|^)(a|i|k|o|s|u|v|z)(\s+)/gim,
};

export interface PluginOptions extends GeneralPluginOptions {
  useNbsp?: boolean;
  customPatterns?: Patterns;
}

export default function (options: PluginOptions): LoksePlugin {
  const patterns: Patterns = {
    ...czechPatterns,
    ...options.customPatterns,
  };

  return createPlugin({
    transformLine: (line, meta) => {
      const { language } = meta;

      if (Object.keys(patterns).includes(language.toLowerCase())) {
        const replaced = line.value.replace(
          patterns[meta.language.toLowerCase()],
          options.useNbsp ? "$1$2&nbsp;" : "$1$2\u00A0"
        );
        line.setValue(replaced);
      } else {
        options.logger.warn(
          `Pattern for current language ${language} was not found`
        );
      }

      return line;
    },
  });
}
