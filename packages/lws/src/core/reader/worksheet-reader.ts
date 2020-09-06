import * as Promise from "bluebird";
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
  GoogleSpreadsheetRow,
} from "google-spreadsheet";
import { forceArray } from "../../utils";

declare type SheetIndexOrTitle = number | string;

declare type SheetsFilter = string | SheetIndexOrTitle[];

export declare type Worksheet = {
  header: string[];
  rows: GoogleSpreadsheetRow[];
};

class WorksheetReader {
  static ALL_SHEETS_FILTER = "*";

  public filter: SheetsFilter;

  constructor(filter?: SheetsFilter | null) {
    this.filter = filter || WorksheetReader.ALL_SHEETS_FILTER;
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
      if (typeof sheetFilter === "string" && worksheet.title === sheetFilter) {
        return true;
      }
      return false;
    });
  }

  async loadSheet(worksheet: GoogleSpreadsheetWorksheet) {
    const rows = await worksheet.getRows();

    return { header: worksheet.headerValues, rows };
  }

  async read(spreadsheet: GoogleSpreadsheet) {
    const worksheets = spreadsheet.sheetsByIndex.filter((worksheet) =>
      this.shouldUseWorksheet(worksheet)
    );

    const sheets = await Promise.all(worksheets.map(this.loadSheet));

    return sheets;
  }
}

export default WorksheetReader;
