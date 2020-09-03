import { GSReader } from "./line-reader";
import Line from '../line';

class Gs2File {
  public reader: any;

  constructor(reader: GSReader) {
    this.reader = reader;
  }

  static fromGoogleSpreadsheet(spreadsheetKey: string, sheets: string) {
    return new Gs2File(new GSReader(spreadsheetKey, sheets));
  }

  read(keyColumn: string, valueColumn: string): Promise<Line[]> {
    return this.reader.select(keyColumn, valueColumn);
  }
}

export default Gs2File;
