import * as dedent from "dedent";

export class FatalError extends Error {}

export class MissingAuthError extends FatalError {
  public name: string;

  constructor() {
    super(
      dedent`
          Cannot authenticate to fetch Spreadsheet data. 
            Provide either Service account credentials or API key 🔑 See detail info at https://github.com/AckeeCZ/lokse/tree/master/packages/core/doc/authentication.md
          `
    );
    this.name = "MissingAuthError";
  }
}

export class KeyColumnNotFound extends Error {
  public key: string;

  constructor(key: string, sheetTitle: string) {
    super(`Key column "${key}" not found in sheet ${sheetTitle}.`);

    this.name = "KeyColumnNotFound";
    this.key = key;
  }
}

export class LangColumnNotFound extends Error {
  public lang: string;

  constructor(lang: string, sheetTitle: string) {
    super(`Language column "${lang}" not found in sheet ${sheetTitle}!`);

    this.name = "LangColumnNotFound";
    this.lang = lang;
  }
}
