import Line from "./line";
import * as GoogleSpreadsheet from "google-spreadsheet";
import * as Q from "q";

interface LineReader {
  select: (sheets, keyCol, valCol, cb) => Promise<any> | void;
}

const forceArray = function (val) {
  if (Array.isArray(val)) return val;
  if (!val) return [];
  return [val];
};

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
    const self = this;

    if (self._fetchedWorksheets == null) {
      if (!self._isFetching) {
        self._isFetching = true;

        self._sheet.getInfo(function (err, data) {
          if (err) {
            console.error("Error while fetching the Spreadsheet (" + err + ")");
            console.warn(
              'WARNING! Check that your spreadsheet is "Published" in "File > Publish to the web..."'
            );
            self._fetchDeferred.reject(err);
          } else {
            const worksheetReader = new WorksheetReader(
              self._sheetsFilter,
              data.worksheets
            );
            worksheetReader.read(function (fetchedWorksheets) {
              self._fetchedWorksheets = fetchedWorksheets;
              self._fetchDeferred.resolve(self._fetchedWorksheets);
            });
          }
        });
      }

      return this._fetchDeferred.promise;
    }
    return self._fetchedWorksheets;
  }

  select(keyCol, valCol) {
    const deferred = Q.defer();
    const self = this;

    Q.when(self.fetchAllCells(), function (worksheets) {
      const extractedLines = self.extractFromRawData(
        worksheets,
        keyCol,
        valCol
      );
      deferred.resolve(extractedLines);
    }).fail(function (error) {
      // console.error('Cannot fetch data');
    });

    return deferred.promise;
  }

  extractFromRawData(rawWorksheets, keyCol, valCol) {
    const extractedLines = [];
    for (let i = 0; i < rawWorksheets.length; i++) {
      const extracted = this.extractFromWorksheet(
        rawWorksheets[i],
        keyCol,
        valCol
      );
      extractedLines.push.apply(extractedLines, extracted);
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
      for (var i = 0; i < headers.length; i++) {
        const value = headers[i];
        if (value == keyCol) {
          keyIndex = i;
        }
        if (value == valCol) {
          valIndex = i;
        }
      }
      for (var i = 1; i < rows.length; i++) {
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
          const newRow = (rows[lastRowIndex + j] = []);
          newRow[cell.col - 1] = "";
        }
      }
      lastRowIndex = rowIndex;

      let row = rows[cell.row - 1];
      if (!row) {
        row = rows[cell.row - 1] = [];
      }
      row[cell.col - 1] = cell.value;
    }
    return rows;
  }

  static isAllSheets(sheet) {
    if (!sheet || sheet == "*") {
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

      if (typeof a === "number" && index == a) {
        return true;
      }
      if (typeof a === "string" && title == a) {
        return true;
      }
    }
    return false;
  }
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
    const self = this;
    if (this._index < this._worksheets.length) {
      const index = this._index++;
      const currentWorksheet = this._worksheets[index];
      if (
        GSReader.shouldUseWorksheet(
          this._filterSheets,
          currentWorksheet.title,
          index
        )
      ) {
        currentWorksheet.getCells(currentWorksheet.id, function (err, cells) {
          if (!err) {
            self._data.push(cells);
          }
          self.next(cb);
        });
      } else {
        this.next(cb);
      }
    } else {
      cb(this._data);
    }
  }
}

export class FakeReader implements LineReader {
  public _array;

  public _index: number;

  constructor(array) {
    this._array = array;
    this._index = 0;
  }

  select(sheets, keyCol, keyVal, cb) {
    const self = this;
    const target = [];

    this._array.forEach(function (key) {
      const v = self._array[key];

      target.push(new Line(v[keyCol], v[keyVal]));
    });

    cb(target);
  }
}
