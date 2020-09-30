import { GoogleSpreadsheet } from "google-spreadsheet";
import { flatten } from "lodash";
import { CLIError } from "@oclif/errors";

import Line from "../line";
import logger from "../../logger";
import WorksheetReader, { Worksheet } from "./worksheet-reader";
import { isEqualCaseInsensitive } from "../../utils";

class MissingApiKeyError extends CLIError {
  constructor() {
    super(
      `Could not get api key. Use LOKSE_API_KEY env variable to provide it 🔑`
    );
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
      await this.spreadsheet.loadInfo();

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

    return worksheet.rows.map(
      (row) => new Line(row[keyColumnId], row[valueColumnId])
    );
  }

  async read(keyColumn: string, valueColumn: string) {
    try {
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
    } catch (error) {
      logger.error("Error at fetching cells data", error);
      return [];
    }
  }
}

export default SpreadsheetReader;
