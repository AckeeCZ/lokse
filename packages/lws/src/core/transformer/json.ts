import { EOL } from "os";
import { Transformer } from "./transformer";

const jsonTransformer: Transformer = {
  transformComment() {
    return "";
  },
  transformKeyValue(key, value) {
    let normalizedValue = value.replace(/%newline%/gi, "\\n");
    normalizedValue = normalizedValue.replace(/"/gi, '\\"');
    normalizedValue = normalizedValue.replace(/%([@df])/gi, "%$1");
    normalizedValue = normalizedValue.replace(/%s/gi, "%@");

    return '  "' + key + '" : "' + normalizedValue + '",';
  },
  insert(_, newValues) {
    newValues = newValues.substring(0, newValues.length - 1);

    const output = EOL + "{" + EOL + newValues + EOL + "}";

    return output;
  },
};

export default jsonTransformer;
