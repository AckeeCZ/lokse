import { GoogleSpreadsheet } from "google-spreadsheet";

import Line from "../line";
import { MissingAuthError, FatalError } from "../errors";
import WorksheetReader from "./worksheet-reader";
import Worksheet from "./worksheet";
import defaultLogger from "../logger";
import type { Logger } from "../logger";
import type { PluginsRunner } from "../plugins";

export declare type WorksheetLinesByTitle = {
  [worksheetTitle: string]: Line[];
};

interface SpreadsheetReaderOptions {
  logger?: Logger;
}
export class SpreadsheetReader {
  private spreadsheet: GoogleSpreadsheet;

  private worksheets: Worksheet[] | null;

  public logger: Logger;

  constructor(
    spreadsheetId: string,
    private sheetsReader: WorksheetReader,
    private plugins: PluginsRunner,
    options: SpreadsheetReaderOptions = {}
  ) {
    this.logger = options.logger || defaultLogger;

    this.spreadsheet = new GoogleSpreadsheet(spreadsheetId);

    this.worksheets = null;
  }

  async authenticate(): Promise<void> {
    const { LOKSE_API_KEY, LOKSE_SERVICE_ACCOUNT_EMAIL, LOKSE_PRIVATE_KEY } =
      process.env;

    if (LOKSE_SERVICE_ACCOUNT_EMAIL && LOKSE_PRIVATE_KEY) {
      await this.spreadsheet.useServiceAccountAuth({
        // eslint-disable-next-line camelcase
        client_email: LOKSE_SERVICE_ACCOUNT_EMAIL,
        // Treat new lines properly - https://stackoverflow.com/a/36439803/7051731
        // eslint-disable-next-line camelcase
        private_key: LOKSE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      });
    } else if (LOKSE_API_KEY) {
      this.spreadsheet.useApiKey(LOKSE_API_KEY);
    } else {
      throw new MissingAuthError();
    }
  }

  async fetchSheets(): Promise<Worksheet[]> {
    if (!this.worksheets) {
      await this.authenticate();

      try {
        await this.spreadsheet.loadInfo();
      } catch (error) {
        throw new FatalError(error.message);
      }

      this.worksheets = await this.sheetsReader.read(this.spreadsheet);
    }

    return this.worksheets;
  }

  async read(
    keyColumn: string,
    valueColumn: string
  ): Promise<WorksheetLinesByTitle> {
    const worksheets = await this.fetchSheets();
    const plugins = this.plugins;

    const worksheetsLines: WorksheetLinesByTitle = {};
    const processWorksheetsPromises = worksheets.map(async (worksheet) => {
      const { title } = worksheet;

      try {
        const lines = await worksheet.extractLines(
          keyColumn,
          valueColumn,
          plugins
        );

        if (worksheetsLines[title]) {
          this.logger.warn(
            `🔀 Found two sheets with same title ${title}. We're gonna merge the data.`
          );

          worksheetsLines[title] = [...worksheetsLines[title], ...lines];
        } else {
          worksheetsLines[title] = lines;
        }
      } catch (error) {
        this.logger.warn(error.message);
      }
    });

    await Promise.all(processWorksheetsPromises);

    return worksheetsLines;
  }
}

export default SpreadsheetReader;
