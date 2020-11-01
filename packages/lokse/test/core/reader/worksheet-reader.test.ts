import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import WorksheetReader from "../../../src/core/reader/worksheet-reader";

const createWorksheet = (title: string, index = 1) => ({
  title,
  index,
});

describe("WorksheetReader.shouldUseWorksheet", () => {
  it("should use worksheet when empty or null or start", () => {
    const worksheet = createWorksheet("LeTitre") as GoogleSpreadsheetWorksheet;

    const reader1 = new WorksheetReader("");
    expect(reader1.shouldUseWorksheet(worksheet)).toEqual(true);
    const reader2 = new WorksheetReader(null);
    expect(reader2.shouldUseWorksheet(worksheet)).toEqual(true);
    const reader3 = new WorksheetReader("*");
    expect(reader3.shouldUseWorksheet(worksheet)).toEqual(true);
  });

  it("should not use worksheet when title not specified", () => {
    const worksheet = createWorksheet("LeTitre") as GoogleSpreadsheetWorksheet;

    const reader1 = new WorksheetReader(["a", "b"]);
    expect(reader1.shouldUseWorksheet(worksheet)).toEqual(false);
    const reader2 = new WorksheetReader(["a", 2]);
    expect(reader2.shouldUseWorksheet(worksheet)).toEqual(false);
  });

  it("should use worksheet when title or index specified", () => {
    const worksheet = createWorksheet("LeTitre") as GoogleSpreadsheetWorksheet;

    const reader1 = new WorksheetReader(["a", "LeTitre"]);
    expect(reader1.shouldUseWorksheet(worksheet)).toEqual(true);
    const reader2 = new WorksheetReader(["a", 1]);
    expect(reader2.shouldUseWorksheet(worksheet)).toEqual(true);
  });

  it("should not use worksheet when filter doesnt pass", () => {
    const worksheet = createWorksheet("LeTitre") as GoogleSpreadsheetWorksheet;

    const reader1 = new WorksheetReader("a");
    expect(reader1.shouldUseWorksheet(worksheet)).toEqual(false);
  });
});
