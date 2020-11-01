import { GoogleSpreadsheet } from "google-spreadsheet";
import { flatten } from "lodash";
import { CLIError, warn } from "@oclif/errors";

import Line from "../line";
import { MissingAuthError } from "../errors";
import WorksheetReader from "./worksheet-reader";
import Worksheet from "./worksheet";

export class SpreadsheetReader {
  private spreadsheet: GoogleSpreadsheet;

  private sheetsReader: WorksheetReader;

  private worksheets: Worksheet[] | null;

  constructor(spreadsheetId: string, sheetsFilter?: string | null) {
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

    const extractedLines: Line[][] = worksheets.map((worksheet) => {
      try {
        return worksheet.extractLines(keyColumn, valueColumn);
      } catch (error) {
        warn(error.message);
        return [];
      }
    });

    return flatten(extractedLines);
  }
}

export default SpreadsheetReader;
