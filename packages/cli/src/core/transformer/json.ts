import { EOL } from "os";
import { Transformer } from "./transformer";
import * as prettier from "prettier";

import logger from "../../logger";

async function format(output: string) {
  const prettierConfig = await prettier.resolveConfigFile();

  if (!prettierConfig) {
    return output;
  }

  const options = await prettier.resolveConfig(prettierConfig, {
    editorconfig: true,
  });

  if (options === null) {
    return output;
  }

  try {
    return prettier.format(output, { parser: "json", ...options });
  } catch (error) {
    logger.log("Error when formatting the output", error);
    return output;
  }
}

const jsonTransformer: Transformer = {
  transformComment() {
    return "";
  },
  transformKeyValue(key, value) {
    const normalizedValue = value
      .replace(/(\r\n|\n|\r)/gm, "") // Remove new lines inside string, https://www.textfixer.com/tutorials/javascript-line-breaks.php
      .replace(/%newline%/gi, "\\n")
      .replace(/"/gi, '\\"') // Escape double quotes
      .replace(/%([@df])/gi, "%$1")
      .replace(/%s/gi, "%@");

    return `  "${key}" : "${normalizedValue}",`;
  },
  async insert(_, newValues) {
    newValues = newValues.substring(0, newValues.length - 1);

    const output = `${EOL}{${EOL}${newValues}${EOL}}`;
    const formatted = await format(output);

    return formatted;
  },

  getFileName(lang, domain) {
    return [domain, lang, "json"]
      .filter(Boolean)
      .map((s) => s!.toLowerCase())
      .join(".");
  },

  supportsSplit: true,
};

export default jsonTransformer;
