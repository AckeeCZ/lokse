import { EOL } from "os";
import * as Promise from "bluebird";
import * as path from "path";

import Transformer from "./transformer";
import Line from "./Line";

const fs = Promise.promisifyAll(require("fs"));
type MkpathAsync = (dirname: string) => Promise<void>;
const mkpathAsync: MkpathAsync = Promise.promisify(require("mkpath"));

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
    await mkpathAsync(dirname);
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
      .map(([key, plural]) => transformer.transformPluralsValues(key, plural))
      .join(EOL);

    return valueToInsert;
  }
}

export default FileWriter;
