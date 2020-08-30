import { GSReader } from "./core/line-reader";
import { FileWriter } from "./core/writer";
import Transformer from "./core/transformer";
import * as ora from "ora";

class Gs2File {
  public _reader: any;

  public _writer: any;

  constructor(reader, writer) {
    this._reader = reader;
    this._writer = writer;
  }

  static fromGoogleSpreadsheet(spreadsheetKey, sheets) {
    const gs2file = new Gs2File(
      new GSReader(spreadsheetKey, sheets),
      new FileWriter()
    );

    return gs2file;
  }

  setValueCol(valueCol) {
    this._defaultValueCol = valueCol;
  }

  setKeyCol(keyCol) {
    this._defaultKeyCol = keyCol;
  }

  setFormat(format) {
    this._defaultFormat = format;
  }

  setEncoding(encoding) {
    this._defaultEncoding = encoding;
  }

  save(outputPath, opts, cb) {
    const spinner = ora({
      text: `Saving ${outputPath}`,
      spinner: "dots",
    }).start();

    opts = opts || {};

    let keyCol = opts.keyCol;
    let valueCol = opts.valueCol;
    let format = opts.format;
    let encoding = opts.encoding;

    if (!keyCol) {
      keyCol = this._defaultKeyCol;
    }

    if (!valueCol) {
      valueCol = this._defaultValueCol;
    }

    if (!format) {
      format = this._defaultFormat;
    }

    if (!encoding) {
      encoding = this._defaultEncoding;
      if (!encoding) {
        encoding = "utf8";
      }
    }

    this._reader.select(keyCol, valueCol).then((lines) => {
      if (lines) {
        const transformer = Transformer[format || "android"];
        this._writer.write(outputPath, encoding, lines, transformer, opts);
      }
      if (typeof cb === "function") {
        cb();
      }
      spinner.succeed();
    });
  }
}

export default Gs2File;
