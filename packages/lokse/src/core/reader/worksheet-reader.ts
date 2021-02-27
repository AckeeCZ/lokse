import { all } from "bluebird";
import { warn } from "@oclif/errors";
import { isPlainObject } from "lodash";
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";
import { forceArray, isEqualCaseInsensitive } from "../../utils";
import Worksheet from "./worksheet";

export class InvalidFilter extends Error {
  constructor(filter: any) {
    super(
      `💥 Invalid sheets filter provided: ${JSON.stringify(
        filter
      )}. Look at the supported filter format reference.`
    );
  }
}

type SheetTitle = string;

type SheetIndexOrTitle = number | SheetTitle;

interface SheetFilterComplex {
  include: SheetIndexOrTitle[];
  exclude: SheetIndexOrTitle[];
}

export type SheetsFilter =
  | SheetTitle
  | SheetIndexOrTitle[]
  | {
      include?: string | SheetIndexOrTitle[];
      exclude?: string | SheetIndexOrTitle[];
    };

class WorksheetReader {
  static ALL_SHEETS_FILTER = "*";

  public filter: SheetFilterComplex;

  constructor(filter?: SheetsFilter | null) {
    this.filter = WorksheetReader.normalizeFilter(filter);
  }

  static normalizeFilter(filter?: SheetsFilter | null): SheetFilterComplex {
    if (!filter || filter === WorksheetReader.ALL_SHEETS_FILTER) {
      return {
        include: [WorksheetReader.ALL_SHEETS_FILTER],
        exclude: [],
      };
    }

    if (typeof filter === "string" || Array.isArray(filter)) {
      return {
        include: forceArray(filter),
        exclude: [],
      };
    }

    if (isPlainObject(filter)) {
      return {
        include: forceArray(
          filter.include ?? WorksheetReader.ALL_SHEETS_FILTER
        ),
        exclude: forceArray(filter.exclude ?? []),
      };
    }

    throw new InvalidFilter(filter);
  }

  static isSheetInTheList(
    worksheet: GoogleSpreadsheetWorksheet,
    list: SheetIndexOrTitle[]
  ) {
    return list.some((sheetFilter: string | number) => {
      if (sheetFilter === WorksheetReader.ALL_SHEETS_FILTER) {
        return true;
      }

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

  shouldUseWorksheet(worksheet: GoogleSpreadsheetWorksheet): boolean {
    const { include, exclude } = this.filter;

    const isIncluded = WorksheetReader.isSheetInTheList(worksheet, include);
    const isExcluded = WorksheetReader.isSheetInTheList(worksheet, exclude);

    return isIncluded && !isExcluded;
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
      let message = `Couldn't find any sheets`;

      const existingSheets = Object.keys(spreadsheet.sheetsByTitle);
      const { include, exclude } = this.filter;

      const filterStringified = [
        include.length > 0 && `include: ${include.toString()}`,
        exclude.length > 0 && `exclude: ${exclude.toString()}`,
      ]
        .filter(Boolean)
        .join(", ");

      message += ` that match the filter ${filterStringified}. Existing sheets are ${existingSheets}`;

      warn(`${message}. `);
    }

    const sheets = await all(worksheets.map(this.loadSheet));

    return sheets;
  }
}

export default WorksheetReader;
