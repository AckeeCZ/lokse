import { EOL } from "os";
import { promisifyAll } from "bluebird";
import * as path from "path";
import * as mkdirp from "mkdirp";

import Transformer from "./transformer";
import Line from "./Line";

const fs = promisifyAll(require("fs"));

export class FileWriter {
  async write(
    filePath: string,
    lines: Line[],
    transformer: Transformer,
    encoding = "utf8"
  ) {
    let fileContent = "";

    try {
      await fs.accessAsync(filePath, fs.F_OK);
      fileContent = await fs.readFileAsync(filePath, encoding);

      fileContent = fileContent.toString();
    } catch {
      // file doesnt exist
    }

    const valueToInsert = this.getTransformedLines(lines, transformer);
    const output = transformer.insert(fileContent, valueToInsert);

    const dirname = path.dirname(filePath);
    await mkdirp(dirname);
    await fs.writeFileAsync(filePath, output, encoding);
  }

  getTransformedLines(lines: Line[], transformer: Transformer) {
    let valueToInsert = "";

    const plurals: { [pluralKey: string]: Line[] } = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isLastLine = i === lines.length - 1;

      if (!line.isEmpty()) {
        if (line.isComment()) {
          valueToInsert += transformer.transformComment(line.getComment());
        } else if (line.isPlural()) {
          if (!plurals[line.key]) {
            plurals[line.key] = [];
          }
          plurals[line.key].push(line);
        } else {
          valueToInsert += transformer.transformKeyValue(line.key, line.value);
        }
      }

      if (
        line.key !== "" &&
        !line.isPlural() &&
        (!isLastLine || Object.keys(plurals).length > 0)
      ) {
        valueToInsert += EOL;
      }
    }

    valueToInsert += Object.entries(plurals)
      .map(([key, plural]) => {
        if (typeof transformer.transformPluralsValues === "function") {
          return transformer.transformPluralsValues(key, plural);
        }
        return "";
      })
      .join(EOL);

    return valueToInsert;
  }
}

export default FileWriter;
