import { GoogleSpreadsheet } from "google-spreadsheet";
import { flatten } from "lodash";
import { CLIError } from "@oclif/errors";
import * as dedent from "dedent";

import Line from "../line";
import WorksheetReader from "./worksheet-reader";
import Worksheet from "./worksheet";
import { cliInvariant } from "../../utils";

class MissingAuthError extends CLIError {
  constructor() {
    super(
      dedent`
        Cannot authenticate to fetch Spreadsheet data. 
          Provide either Service account credentials or API key 🔑 See detail info at https://github.com/AckeeCZ/lokse/tree/master/packages/lokse#authentication
        `
    );
    this.name = "MissingAuthError";
  }
}

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
        cliInvariant(false, error.message);
      }

      this.worksheets = await this.sheetsReader.read(this.spreadsheet);
    }

    return this.worksheets;
  }

  async read(keyColumn: string, valueColumn: string) {
    const worksheets = await this.fetchSheets();

    const extractedLines: Line[][] = worksheets.map((worksheet) =>
      worksheet.extractLines(keyColumn, valueColumn)
    );

    return flatten(extractedLines);
  }
}

export default SpreadsheetReader;
