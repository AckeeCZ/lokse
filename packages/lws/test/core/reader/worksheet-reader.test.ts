import * as assert from "assert";
import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import WorksheetReader from "../../../src/core/reader/worksheet-reader";

const createWorksheet = (title, index = 1) => ({
  title,
  index,
});

describe("WorksheetReader.shouldUseWorksheet", () => {
  it("should use worksheet when empty or null or start", () => {
    const worksheet = createWorksheet("LeTitre") as GoogleSpreadsheetWorksheet;

    const reader1 = new WorksheetReader("");
    assert.strictEqual(true, reader1.shouldUseWorksheet(worksheet));
    const reader2 = new WorksheetReader(null);
    assert.strictEqual(true, reader2.shouldUseWorksheet(worksheet));
    const reader3 = new WorksheetReader("*");
    assert.strictEqual(true, reader3.shouldUseWorksheet(worksheet));
  });

  it("should not use worksheet when title not specified", () => {
    const worksheet = createWorksheet("LeTitre") as GoogleSpreadsheetWorksheet;

    const reader1 = new WorksheetReader(["a", "b"]);
    assert.strictEqual(false, reader1.shouldUseWorksheet(worksheet));
    const reader2 = new WorksheetReader(["a", 2]);
    assert.strictEqual(false, reader2.shouldUseWorksheet(worksheet));
  });

  it("should use worksheet when title or index specified", () => {
    const worksheet = createWorksheet("LeTitre") as GoogleSpreadsheetWorksheet;

    const reader1 = new WorksheetReader(["a", "LeTitre"]);
    assert.strictEqual(true, reader1.shouldUseWorksheet(worksheet));
    const reader2 = new WorksheetReader(["a", 1]);
    assert.strictEqual(true, reader2.shouldUseWorksheet(worksheet));
  });

  it("should not use worksheet when filter doesnt pass", () => {
    const worksheet = createWorksheet("LeTitre") as GoogleSpreadsheetWorksheet;

    const reader1 = new WorksheetReader("a");
    assert.strictEqual(false, reader1.shouldUseWorksheet(worksheet));
  });
});
