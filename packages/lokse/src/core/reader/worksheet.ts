import { GoogleSpreadsheetRow } from "google-spreadsheet";
import { warn } from "@oclif/errors";

import Line from "../line";
import {
    isEqualCaseInsensitive,
    noExitCliInvariant,
  } from "../../utils";
  
export default class Worksheet {
  public title: string;

  public header: string[];

  public rows: GoogleSpreadsheetRow[];

  constructor(title: string, header: string[], rows: GoogleSpreadsheetRow[]) {
    this.title = title;
    this.header = header;
    this.rows = rows;
  }

  extractLines(keyColumn: string, valueColumn: string) {
    let keyColumnId = "";
    let valueColumnId = "";

    for (const headerKey of this.header) {
      if (isEqualCaseInsensitive(headerKey, keyColumn)) {
        keyColumnId = headerKey;
      }
      if (isEqualCaseInsensitive(headerKey, valueColumn)) {
        valueColumnId = headerKey;
      }
    }

    if (!keyColumnId) {
      warn(`Key column "${keyColumn}" not found in sheet ${this.title}.`);
    }

    noExitCliInvariant(
      valueColumnId,
      `Language column "${valueColumn}" not found in sheet ${this.title}!`
    );

    return this.rows.map(
      (row) => new Line(row[keyColumnId], row[valueColumnId])
    );
  }
}
