import { createPlugin } from "@lokse/core";
import type { GeneralPluginOptions, LoksePlugin } from "@lokse/core";

import { lowerCaseKeys, regexifyValues } from "./utils";

export interface Patterns {
  [key: string]: RegExp | string;
}
export interface CustomPatterns {
  [key: string]: string;
}

const defaultPatterns: Patterns = {
  cs: /(\s|^)(a|i|k|o|s|u|v|z)(\s+)/gim,
  "cs-cz": /(\s|^)(a|i|k|o|s|u|v|z)(\s+)/gim,
};

export interface PluginOptions extends GeneralPluginOptions {
  useNbsp?: boolean;
  customPatterns?: CustomPatterns;
}

// We have to do this in order to process the custom patterns from JSON plugin settings
const normalizeCustomPatterns = (patterns: CustomPatterns) => {
  const lowerCasedCustomPatterns = lowerCaseKeys(patterns);
  const regexifiedValues = regexifyValues(lowerCasedCustomPatterns);

  return regexifiedValues;
};

export default function (options: PluginOptions): LoksePlugin {
  const patterns: Patterns = {
    ...defaultPatterns,
    ...(options.customPatterns
      ? normalizeCustomPatterns(options.customPatterns)
      : {}),
  };

  return createPlugin({
    transformLine: (line, meta) => {
      const { language } = meta;

      if (Object.keys(patterns).includes(language.toLowerCase())) {
        const pattern = patterns[language.toLowerCase()];
        const replacement = options.useNbsp ? "$1$2&nbsp;" : "$1$2\u00A0";

        line.setValue((value) => value.replace(pattern, replacement));
      } else {
        options.logger.warn(
          `Pattern for current language ${language} was not found`
        );
      }

      return line;
    },
  });
}
