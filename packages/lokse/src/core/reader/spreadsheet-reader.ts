import { GoogleSpreadsheet } from "google-spreadsheet";
import { CLIError, warn } from "@oclif/errors";

import Line from "../line";
import { MissingAuthError } from "../errors";
import WorksheetReader, { SheetsFilter } from "./worksheet-reader";
import Worksheet from "./worksheet";

export declare type WorksheetLinesByTitle = {
  [worksheetTitle: string]: Line[];
};

export class SpreadsheetReader {
  private spreadsheet: GoogleSpreadsheet;

  private sheetsReader: WorksheetReader;

  private worksheets: Worksheet[] | null;

  constructor(spreadsheetId: string, sheetsFilter?: SheetsFilter | null) {
    this.spreadsheet = new GoogleSpreadsheet(spreadsheetId);
    this.sheetsReader = new WorksheetReader(sheetsFilter);

    this.worksheets = null;
  }

  async authenticate() {
    const {
      LOKSE_API_KEY,
      LOKSE_SERVICE_ACCOUNT_EMAIL,
      LOKSE_PRIVATE_KEY,
    } = process.env;

    if (LOKSE_SERVICE_ACCOUNT_EMAIL && LOKSE_PRIVATE_KEY) {
      await this.spreadsheet.useServiceAccountAuth({
        client_email: LOKSE_SERVICE_ACCOUNT_EMAIL,
        // Treat new lines properly - https://stackoverflow.com/a/36439803/7051731
        private_key: LOKSE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      });
    } else if (LOKSE_API_KEY) {
      this.spreadsheet.useApiKey(LOKSE_API_KEY);
    } else {
      throw new MissingAuthError();
    }
  }

  async fetchSheets() {
    if (!this.worksheets) {
      await this.authenticate();

      try {
        await this.spreadsheet.loadInfo();
      } catch (error) {
        throw new CLIError(error.message);
      }

      this.worksheets = await this.sheetsReader.read(this.spreadsheet);
    }

    return this.worksheets;
  }

  async read(keyColumn: string, valueColumn: string) {
    const worksheets = await this.fetchSheets();

    return worksheets.reduce(
      (worksheetLines: WorksheetLinesByTitle, worksheet) => {
        const { title } = worksheet;

        try {
          const lines = worksheet.extractLines(keyColumn, valueColumn);

          if (worksheetLines[title]) {
            warn(
              `🔀 Found two sheets with same title ${title}. We're gonna concat the data.`
            );

            worksheetLines[title] = worksheetLines[title].concat(lines);
          } else {
            worksheetLines[title] = lines;
          }
        } catch (error) {
          warn(error.message);
        }

        return worksheetLines;
      },
      {}
    );
  }
}

export default SpreadsheetReader;
