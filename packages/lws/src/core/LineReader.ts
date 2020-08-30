import Line from "./Line";
import * as GoogleSpreadsheet from "google-spreadsheet";
import * as Q from "q";

const LineReader = {
  select: function (sheets, keyCol, valCol, cb) {},
};

const forceArray = function (val) {
    if (Array.isArray(val)) return val;
    if (!val) return [];
    return [val];
  };
  

export class GSReader {    
    constructor(spreadsheetKey, sheetsFilter) {
        this._sheet = new GoogleSpreadsheet(spreadsheetKey);
        this._sheetsFilter = sheetsFilter;

        this._fetchDeferred = Q.defer();
        this._isFetching = false;
        this._fetchedWorksheets = null;
    }

    fetchAllCells() {
        var self = this;

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
                var worksheetReader = new WorksheetReader(
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
        } else {
            return self._fetchedWorksheets;
        }
    }

    select(keyCol, valCol) {
        var deferred = Q.defer();
        var self = this;

        Q.when(self.fetchAllCells(), function (worksheets) {
            var extractedLines = self.extractFromRawData(worksheets, keyCol, valCol);
            deferred.resolve(extractedLines);
        }).fail(function (error) {
            //console.error('Cannot fetch data');
        });

        return deferred.promise;
    }

    extractFromRawData(rawWorksheets, keyCol, valCol) {
        var extractedLines = [];
        for (var i = 0; i < rawWorksheets.length; i++) {
            var extracted = this.extractFromWorksheet(rawWorksheets[i], keyCol, valCol);
            extractedLines.push.apply(extractedLines, extracted);
        }

        return extractedLines;
    }

    extractFromWorksheet(rawWorksheet, keyCol, valCol) {
        var results = [];

        var rows = this.flatenWorksheet(rawWorksheet);

        var headers = rows[0];
        if (headers) {
            var keyIndex = -1,
            valIndex = -1;
            for (var i = 0; i < headers.length; i++) {
            var value = headers[i];
            if (value == keyCol) {
                keyIndex = i;
            }
            if (value == valCol) {
                valIndex = i;
            }
            }
            for (var i = 1; i < rows.length; i++) {
            var row = rows[i];
            if (row) {
                var keyValue = row[keyIndex];
                var valValue = row[valIndex];

                results.push(new Line(keyValue, valValue));
            }
            }
        }

        return results;
    }

    flatenWorksheet(rawWorksheet) {
        var rows = [];
        var lastRowIndex = 1;
        for (var i = 0; i < rawWorksheet.length; i++) {
            var cell = rawWorksheet[i];

            //detect empty line
            var rowIndex = cell.row;
            var diffWithLastRow = rowIndex - lastRowIndex;
            if (diffWithLastRow > 1) {
            for (var j = 0; j < diffWithLastRow - 1; j++) {
                var newRow = (rows[lastRowIndex + j] = []);
                newRow[cell.col - 1] = "";
            }
            }
            lastRowIndex = rowIndex;

            var row = rows[cell.row - 1];
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
        } else {
            var selectedArray = forceArray(selectedSheets);
            for (var i = 0; i < selectedArray.length; i++) {
            var a = selectedArray[i];

            if (typeof a == "number" && index == a) {
                return true;
            } else if (typeof a == "string" && title == a) {
                return true;
            }
            }
            return false;
        }
    }
}

class WorksheetReader{ 
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
        var self = this;
        if (this._index < this._worksheets.length) {
            var index = this._index++;
            var currentWorksheet = this._worksheets[index];
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

export export class FakeReader{ 
    constructor(array) {
        this._array = array;
        this._index = 0;
    }

    select(sheets, keyCol, keyVal, cb) {
        var self = this;
        var target = [];

        this._array.forEach(function (key) {
            var v = self._array[key];

            target.push(new Line(v[keyCol], v[keyVal]));
        });

        cb(target);
    }
}
