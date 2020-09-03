import * as fs from "fs";
import { EOL } from "os";

import Transformer from "./transformer";

// https://gist.github.com/jrajav/4140206
const writeFileAndCreateDirectoriesSync = function (
  filepath: string,
  content: string,
  encoding: string
) {
  const mkpath = require("mkpath");
  const path = require("path");

  const dirname = path.dirname(filepath);
  mkpath.sync(dirname);

  fs.writeFileSync(filepath, content, encoding);
};

export class FileWriter {
  write(filePath: string, lines, transformer: Transformer, encoding = "utf8") {
    let fileContent = "";
    if (fs.existsSync(filePath)) {
      fileContent = fs.readFileSync(filePath, encoding).toString();
    }

    const valueToInsert = this.getTransformedLines(lines, transformer);

    const output = transformer.insert(fileContent, valueToInsert);

    writeFileAndCreateDirectoriesSync(filePath, output, "utf8");
  }

  getTransformedLines(lines, transformer: Transformer) {
    let valueToInsert = "";
    const plurals = {};
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.isEmpty()) {
        if (line.isComment()) {
          valueToInsert += transformer.transformComment(line.getComment());
        } else if (line.isPlural()) {
          if (!plurals[line.getKey()]) {
            plurals[line.getKey()] = [];
          }
          plurals[line.getKey()].push(line);
        } else {
          valueToInsert += transformer.transformKeyValue(
            line.getKey(),
            line.getValue()
          );
        }
      }
      if (
        line.getKey() !== "" &&
        !line.isPlural() &&
        (i !== lines.length - 1 || Object.keys(plurals).length > 0)
      ) {
        valueToInsert += EOL;
      }
    }

    let j = 0;
    for (const [key, plural] of Object.entries(plurals)) {
      valueToInsert += transformer.transformPluralsValues(key, plural);
      if (j !== Object.keys(plurals).length - 1) {
        valueToInsert += EOL;
      }
      j++;
    }

    return valueToInsert;
  }
}

export default FileWriter;
