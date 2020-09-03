import Line from "../line";
import * as GoogleSpreadsheet from "google-spreadsheet";
import * as Q from "q";
import logger from "../../logger";

const forceArray = function (val) {
  if (Array.isArray(val)) return val;
  if (!val) return [];
  return [val];
};

interface LineReader {
  select: (sheets, keyCol, valCol, cb) => Promise<any> | void;
}

class WorksheetReader {
  public _filterSheets;

  public _worksheets;

  public _index: number;

  public _data;

  constructor(filterSheets, worksheets) {
    this._filterSheets = filterSheets;
    this._worksheets = worksheets;
    this._index = 0;

    this._data = [];
  }

  read(cb) {
    this.next(cb);
  }

  next(cb) {
    if (this._index < this._worksheets.length) {
      const index = this._index++;
      const currentWorksheet = this._worksheets[index];
      if (
        // TODO - solve the dependency cycle GSReader -> WorksheetReader -> GSReader
        // and remove the eslint disable comment
        // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define
        GSReader.shouldUseWorksheet(
          this._filterSheets,
          currentWorksheet.title,
          index
        )
      ) {
        currentWorksheet.getCells(currentWorksheet.id, (err, cells) => {
          if (!err) {
            this._data.push(cells);
          }
          this.next(cb);
        });
      } else {
        this.next(cb);
      }
    } else {
      cb(this._data);
    }
  }
}

export class GSReader implements LineReader {
  public _sheet;

  public _sheetsFilter;

  public _fetchDeferred;

  public _isFetching;

  public _fetchedWorksheets;

  constructor(spreadsheetKey, sheetsFilter) {
    this._sheet = new GoogleSpreadsheet(spreadsheetKey);
    this._sheetsFilter = sheetsFilter;

    this._fetchDeferred = Q.defer();
    this._isFetching = false;
    this._fetchedWorksheets = null;
  }

  fetchAllCells() {
    if (this._fetchedWorksheets === null) {
      if (!this._isFetching) {
        this._isFetching = true;

        this._sheet.getInfo((err, data) => {
          if (err) {
            logger.error("Error while fetching the Spreadsheet (" + err + ")");
            logger.warn(
              'WARNING! Check that your spreadsheet is "Published" in "File > Publish to the web..."'
            );
            this._fetchDeferred.reject(err);
          } else {
            const worksheetReader = new WorksheetReader(
              this._sheetsFilter,
              data.worksheets
            );
            worksheetReader.read((fetchedWorksheets) => {
              this._fetchedWorksheets = fetchedWorksheets;
              this._fetchDeferred.resolve(this._fetchedWorksheets);
            });
          }
        });
      }

      return this._fetchDeferred.promise;
    }
    return this._fetchedWorksheets;
  }

  select(keyCol, valCol) {
    const deferred = Q.defer();

    Q.when(this.fetchAllCells(), (worksheets) => {
      const extractedLines = this.extractFromRawData(
        worksheets,
        keyCol,
        valCol
      );
      deferred.resolve(extractedLines);
    }).fail(function (error) {
      logger.error("Cannot fetch data", error);
    });

    return deferred.promise;
  }

  extractFromRawData(rawWorksheets, keyCol: string, valCol: string): Line[] {
    const extractedLines = [];
    for (let i = 0; i < rawWorksheets.length; i++) {
      const extracted = this.extractFromWorksheet(
        rawWorksheets[i],
        keyCol,
        valCol
      );
      extractedLines.push(...extracted);
    }

    return extractedLines;
  }

  extractFromWorksheet(rawWorksheet, keyCol, valCol) {
    const results = [];

    const rows = this.flatenWorksheet(rawWorksheet);

    const headers = rows[0];
    if (headers) {
      let keyIndex = -1;
      let valIndex = -1;
      for (let i = 0; i < headers.length; i++) {
        const value = headers[i];
        if (value === keyCol) {
          keyIndex = i;
        }
        if (value === valCol) {
          valIndex = i;
        }
      }
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row) {
          const keyValue = row[keyIndex];
          const valValue = row[valIndex];

          results.push(new Line(keyValue, valValue));
        }
      }
    }

    return results;
  }

  flatenWorksheet(rawWorksheet) {
    const rows = [];
    let lastRowIndex = 1;
    for (let i = 0; i < rawWorksheet.length; i++) {
      const cell = rawWorksheet[i];

      // detect empty line
      const rowIndex = cell.row;
      const diffWithLastRow = rowIndex - lastRowIndex;
      if (diffWithLastRow > 1) {
        for (let j = 0; j < diffWithLastRow - 1; j++) {
          rows[lastRowIndex + j] = [];
          const newRow = rows[lastRowIndex + j];
          newRow[cell.col - 1] = "";
        }
      }
      lastRowIndex = rowIndex;

      let row = rows[cell.row - 1];
      if (!row) {
        rows[cell.row - 1] = [];
        row = rows[cell.row - 1];
      }
      row[cell.col - 1] = cell.value;
    }
    return rows;
  }

  static isAllSheets(sheet) {
    if (!sheet || sheet === "*") {
      return true;
    }
    return false;
  }

  static shouldUseWorksheet(selectedSheets, title, index) {
    if (GSReader.isAllSheets(selectedSheets)) {
      return true;
    }
    const selectedArray = forceArray(selectedSheets);
    for (let i = 0; i < selectedArray.length; i++) {
      const a = selectedArray[i];

      if (typeof a === "number" && index === a) {
        return true;
      }
      if (typeof a === "string" && title === a) {
        return true;
      }
    }
    return false;
  }
}
