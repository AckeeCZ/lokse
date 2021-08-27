import { GoogleSpreadsheetRow } from "google-spreadsheet";

import Line from "../line";
import { isEqualCaseInsensitive } from "../utils";
import { KeyColumnNotFound, LangColumnNotFound } from "../errors";
import type { PluginsRunner } from "../plugins";

export default class Worksheet {
  public title: string;

  public header: string[];

  public rows: GoogleSpreadsheetRow[];

  constructor(title: string, header: string[], rows: GoogleSpreadsheetRow[]) {
    this.title = title;
    this.header = header;
    this.rows = rows;
  }

  async extractLines(
    keyColumn: string,
    langColumn: string,
    plugins: PluginsRunner
  ) {
    let keyColumnId = "";
    let langColumnId = "";

    for (const headerKey of this.header) {
      if (isEqualCaseInsensitive(headerKey, keyColumn)) {
        keyColumnId = headerKey;
      }
      if (isEqualCaseInsensitive(headerKey, langColumn)) {
        langColumnId = headerKey;
      }
    }

    if (!keyColumnId) {
      throw new KeyColumnNotFound(keyColumn, this.title);
    }

    if (!langColumnId) {
      throw new LangColumnNotFound(langColumn, this.title);
    }

    const linesPromises = this.rows.map(async (row) => {
      const unprocessedLine = new Line(row[keyColumnId], row[langColumnId]);

      const line = await plugins.runHook("readTranslation", unprocessedLine, {
        key: keyColumn,
        language: langColumn,
        row,
      });
      return line;
    });
    const lines = await Promise.all(linesPromises);

    return lines;
  }
}
