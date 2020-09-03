import * as Promise from "bluebird";
import logger from "../../logger";
import { forceArray } from "../../utils";

declare type SheetIndexOrTitle = number | string;

declare type SheetsFilter = string | SheetIndexOrTitle[];

export declare type CellValue = string;

export interface Cell {
  col: number;
  row: number;
  value: CellValue;
}

export declare type RawWorksheet = Cell[];

declare type Worksheet = {
  id: string;
  title: string;
  getCells: (id: string, cb: (err: Error, cells: Cell[]) => void) => any;
};

class WorksheetReader {
  static ALL_SHEETS_FILTER = "*";

  public filter: SheetsFilter;

  constructor(filter?: SheetsFilter | null) {
    this.filter = filter || WorksheetReader.ALL_SHEETS_FILTER;
  }

  shouldUseWorksheet(worksheet: Worksheet, index: number) {
    if (this.filter === WorksheetReader.ALL_SHEETS_FILTER) {
      return true;
    }

    const filtersList = forceArray<string | number>(this.filter);

    return filtersList.some((sheetFilter: string | number) => {
      if (typeof sheetFilter === "number" && index === sheetFilter) {
        return true;
      }
      if (typeof sheetFilter === "string" && worksheet.title === sheetFilter) {
        return true;
      }
      return false;
    });
  }

  getRawWorksheet(worksheet: Worksheet): Promise<RawWorksheet> {
    return new Promise((resolve) => {
      worksheet.getCells(worksheet.id, (err, cells) => {
        if (err) {
          logger.warn(`Error when fetching data from sheet ${worksheet.title}`);
          resolve([]);
        } else {
          resolve(cells);
        }
      });
    });
  }

  read(worksheets: Worksheet[]): Promise<RawWorksheet[]> {
    return Promise.filter(worksheets, (worksheet, index) =>
      this.shouldUseWorksheet(worksheet, index)
    ).map((worksheet: Worksheet) => {
      return this.getRawWorksheet(worksheet);
    });
  }
}

export default WorksheetReader;
