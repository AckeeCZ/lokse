import { all } from "bluebird";
import { warn } from "@oclif/errors";
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";
import { forceArray, isEqualCaseInsensitive } from "../../utils";
import Worksheet from "./worksheet";

declare type SheetIndexOrTitle = number | string;

export declare type SheetsFilter = string | SheetIndexOrTitle[];

class WorksheetReader {
  static ALL_SHEETS_FILTER = "*";

  public filter: SheetsFilter;

  constructor(filter?: SheetsFilter | null) {
    this.filter = filter || WorksheetReader.ALL_SHEETS_FILTER;
  }

  static isValidFilter(filter: any): filter is SheetsFilter {
    return forceArray(filter).every(
      (f) => typeof f === "string" || typeof f === "number"
    );
  }

  shouldUseWorksheet(worksheet: GoogleSpreadsheetWorksheet) {
    if (this.filter === WorksheetReader.ALL_SHEETS_FILTER) {
      return true;
    }

    const filtersList = forceArray<string | number>(this.filter);

    return filtersList.some((sheetFilter: string | number) => {
      if (typeof sheetFilter === "number" && worksheet.index === sheetFilter) {
        return true;
      }
      if (
        typeof sheetFilter === "string" &&
        isEqualCaseInsensitive(worksheet.title, sheetFilter)
      ) {
        return true;
      }
      return false;
    });
  }

  async loadSheet(worksheet: GoogleSpreadsheetWorksheet) {
    const rows = await worksheet.getRows();

    return new Worksheet(worksheet.title, worksheet.headerValues, rows);
  }

  async read(spreadsheet: GoogleSpreadsheet) {
    const worksheets = spreadsheet.sheetsByIndex.filter((worksheet) =>
      this.shouldUseWorksheet(worksheet)
    );

    if (worksheets.length === 0) {
      let message = `Could find any sheets`;

      if (this.filter !== WorksheetReader.ALL_SHEETS_FILTER) {
        const existingSheets = Object.keys(spreadsheet.sheetsByTitle);

        message += ` that match the filter ${this.filter.toString()}. Existing sheets are ${existingSheets}`;
      }

      warn(`${message}. `);
    }

    const sheets = await all(worksheets.map(this.loadSheet));

    return sheets;
  }
}

export default WorksheetReader;
