import { CLIError } from "@oclif/errors";
import * as dedent from "dedent";

export class MissingAuthError extends CLIError {
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
