import { EOL } from "os";
import { Transformer } from "./transformer";

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
  insert(_, newValues) {
    newValues = newValues.substring(0, newValues.length - 1);

    const output = `${EOL}{${EOL}${newValues}${EOL}}`;

    return output;
  },
  getFileName: (item) => item.toLowerCase() + ".json",
};

export default jsonTransformer;
