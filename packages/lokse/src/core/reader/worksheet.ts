import { GoogleSpreadsheetRow } from "google-spreadsheet";

import Line from "../line";
import { isEqualCaseInsensitive } from "../../utils";
import { KeyColumnNotFound, LangColumnNotFound } from "../errors";

export default class Worksheet {
  public title: string;

  public header: string[];

  public rows: GoogleSpreadsheetRow[];

  constructor(title: string, header: string[], rows: GoogleSpreadsheetRow[]) {
    this.title = title;
    this.header = header;
    this.rows = rows;
  }

  extractLines(keyColumn: string, langColumn: string) {
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

    return this.rows.map(
      (row) => new Line(row[keyColumnId], row[langColumnId])
    );
  }
}
