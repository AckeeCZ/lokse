import { GoogleSpreadsheet } from "google-spreadsheet";
import { flatten } from "lodash";
import { CLIError } from "@oclif/errors";

import Line from "../line";
import WorksheetReader, { Worksheet } from "./worksheet-reader";
import { isEqualCaseInsensitive } from "../../utils";

class MissingApiKeyError extends CLIError {
  constructor() {
    super(
      `Could not get API key. Use LOKSE_API_KEY env variable to provide it 🔑`
    );
    this.name = "MissingApiKeyError";
  }
}

class LoadDataError extends CLIError {
  constructor(reason: string) {
    super(reason);
    this.name = "LoadDataError";
  }
}

class ColumnDataError extends CLIError {
  constructor(reason: string) {
    super(reason, {
      exit: false,
    });
    this.name = "ColumnDataError";
  }
}

export class SpreadsheetReader {
  private spreadsheet: GoogleSpreadsheet;

  private sheetsReader: WorksheetReader;

  private worksheets: Worksheet[] | null;

  constructor(spreadsheetId: string, sheetsFilter?: string | null) {
    this.spreadsheet = new GoogleSpreadsheet(spreadsheetId);
    this.sheetsReader = new WorksheetReader(sheetsFilter);

    this.worksheets = null;
  }

  async fetchSheets() {
    if (!process.env.LOKSE_API_KEY) {
      throw new MissingApiKeyError();
    }

    if (!this.worksheets) {
      this.spreadsheet.useApiKey(process.env.LOKSE_API_KEY);

      try {
        await this.spreadsheet.loadInfo();
      } catch (error) {
        throw new LoadDataError(error.message);
      }

      this.worksheets = await this.sheetsReader.read(this.spreadsheet);
    }

    return this.worksheets;
  }

  extractFromWorksheet(
    worksheet: Worksheet,
    keyColumn: string,
    valueColumn: string
  ) {
    let keyColumnId = "";
    let valueColumnId = "";

    for (const headerKey of worksheet.header) {
      if (isEqualCaseInsensitive(headerKey, keyColumn)) {
        keyColumnId = headerKey;
      }
      if (isEqualCaseInsensitive(headerKey, valueColumn)) {
        valueColumnId = headerKey;
      }
    }

    if (!keyColumnId) {
      throw new LoadDataError(`Key column "${keyColumn}" not found!`);
    }

    if (!valueColumnId) {
      throw new ColumnDataError(`Language column "${valueColumn}" not found!`);
    }

    return worksheet.rows.map(
      (row) => new Line(row[keyColumnId], row[valueColumnId])
    );
  }

  async read(keyColumn: string, valueColumn: string) {
    const worksheets = await this.fetchSheets();

    const extractedLines: Line[][] = worksheets.map((worksheet) => {
      const worksheetLines = this.extractFromWorksheet(
        worksheet,
        keyColumn,
        valueColumn
      );

      return worksheetLines;
    });

    return flatten(extractedLines);
  }
}

export default SpreadsheetReader;
