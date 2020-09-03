import Line from "../line";
import * as GoogleSpreadsheet from "google-spreadsheet";
import * as Promise from "bluebird";
import { flatten } from "lodash";

import logger from "../../logger";
import WorksheetReader, {
  Cell,
  CellValue,
  RawWorksheet,
} from "./worksheet-reader";

class FetchSpreadsheetError extends Error {
  constructor(err: Error) {
    super(`Error while fetching the Spreadsheet (${err})
    WARNING! Check that your spreadsheet is "Published" in "File > Publish to the web..."`);
  }
}

declare type SpreadsheetData = {
  worksheets: any;
};

declare type Row = CellValue[];

export class SpreadsheetReader {
  private googleSpreadsheet: GoogleSpreadsheet;

  public sheetsReader: WorksheetReader;

  public fetchingPromise: Promise<Cell[][]> | null;

  constructor(spreadsheetKey: string, sheetsFilter?: string | null) {
    this.googleSpreadsheet = new GoogleSpreadsheet(spreadsheetKey);
    this.sheetsReader = new WorksheetReader(sheetsFilter);

    this.fetchingPromise = null;
  }

  getSpreadsheetInfo(): Promise<SpreadsheetData> {
    return new Promise((resolve, reject) => {
      this.googleSpreadsheet.getInfo((err: Error, data: SpreadsheetData) => {
        if (err) {
          reject(new FetchSpreadsheetError(err));
        } else {
          resolve(data);
        }
      });
    });
  }

  readWorksheets(data: SpreadsheetData): Promise<RawWorksheet[]> {
    return this.sheetsReader.read(data.worksheets);
  }

  fetchAllCells() {
    if (!this.fetchingPromise) {
      this.fetchingPromise = this.getSpreadsheetInfo().then(data => this.readWorksheets(data));
    }

    return this.fetchingPromise;
  }

  read(keyColumn: string, valueColumn: string): Promise<Line[]> {
    return this.fetchAllCells()
      .then((worksheets: RawWorksheet[]) => {
        const extractedLines = this.extractFromRawData(
          worksheets,
          keyColumn,
          valueColumn
        );

        return extractedLines;
      })
      .catch(function (error) {
        logger.error("Error at fetching cells data", error);
        return [];
      });
  }

  extractFromRawData(
    rawWorksheets: RawWorksheet[],
    keyCol: string,
    valCol: string
  ): Line[] {
    const extractedLines: Line[][] = rawWorksheets.map((worksheet) => {
      const worksheetLines = this.extractFromWorksheet(
        worksheet,
        keyCol,
        valCol
      );

      return worksheetLines;
    });

    return flatten(extractedLines);
  }

  extractFromWorksheet(
    rawWorksheet: RawWorksheet,
    keyCol: string,
    valCol: string
  ) {
    const rows = this.flattenWorksheet(rawWorksheet);

    const [headerRow] = rows.splice(0, 1);

    if (headerRow) {
      let keyIndex = -1;
      let valIndex = -1;

      for (let i = 0; i < headerRow.length; i++) {
        const value = headerRow[i];

        if (value === keyCol) {
          keyIndex = i;
        }
        if (value === valCol) {
          valIndex = i;
        }
      }

      return rows.map((row) => {
        const keyValue = row[keyIndex];
        const valValue = row[valIndex];

        return new Line(keyValue, valValue);
      });
    }

    return [];
  }

  flattenWorksheet(rawWorksheet: RawWorksheet): Row[] {
    const rows: Row[] = [];
    let lastRowIndex = 1;

    for (const cell of rawWorksheet) {
      // detect empty lines
      const rowIndex = cell.row;
      const skippedRowsCount = rowIndex - lastRowIndex;

      if (skippedRowsCount > 1) {
        for (let j = 0; j < skippedRowsCount - 1; j++) {
          const emptyRow = [""];
          rows[lastRowIndex + j] = emptyRow;
        }
      }
      lastRowIndex = rowIndex;

      // row not exists - make one
      if (!rows[cell.row - 1]) {
        rows[cell.row - 1] = [];
      }

      // put cell value to the row
      const row = rows[cell.row - 1];
      row[cell.col - 1] = cell.value;
    }

    return rows;
  }
}

export default SpreadsheetReader;
