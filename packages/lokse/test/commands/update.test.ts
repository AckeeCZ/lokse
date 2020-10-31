import { test } from "@oclif/test";
import { OutputFormat } from "../../src/constants";

const outputFormats = Object.values(OutputFormat).join(", ");

describe("update command", () => {
  const fakeSpreadsheetId = "fake-spreadsheet-id";
  const params = {
    id: `--id=${fakeSpreadsheetId}`,
    dir: "--dir=src/translations",
    col: `--col=web`,
    langs: `--languages=cs,en-us,en-gb`,
    format: `--format=json`,
  };

  test
    .command(["update"])
    .catch((error) => {
      expect(error.message).toEqual(
        `💥 Sheet id is required for updating translations`
      );
    })
    .it("throws when id not provided");

  test
    .command(["update", params.id])
    .catch((error) => {
      expect(error.message).toEqual(
        `💥 Output directory is required for updating translations`
      );
    })
    .it("throws when output directory not provided");

  test
    .command(["update", params.id, params.dir])
    .catch((error) => {
      expect(error.message).toEqual(
        `💥 Keys column is required for updating translations`
      );
    })
    .it("throws when keys column not provided");

  test
    .command(["update", params.id, params.dir, params.col])
    .catch((error) => {
      expect(error.message).toEqual(
        `🤷‍♂️ Translation columns have to be list of languages, but undefined given`
      );
    })
    .it("throws when languages list not provided");

  test
    .skip() // TODO: we're able to provide non array value only through config
    .command(["update", params.id, params.dir, params.col, "--languages="])
    .catch((error) => {
      expect(error.message).toEqual(
        `🤷‍♂️ Translation columns have to be list of languages, but cs,en given`
      );
    })
    .it("throws when languages list is not an array");

  test
    .command([
      "update",
      params.id,
      params.dir,
      params.col,
      "--format=unknown_format",
    ])
    .catch((error) => {
      expect(error.message).toContain(
        `Expected --format=unknown_format to be one of: ${outputFormats}`
      );
    })
    .it("throws when unknown format provided");
});
