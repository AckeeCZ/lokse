import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import WorksheetReader from "../worksheet-reader";

const createWorksheet = (title: string, index = 1) => ({
  title,
  index,
});

describe("WorksheetReader.shouldUseWorksheet", () => {
  it("should use worksheet when empty or null or asterisk", () => {
    const worksheet = createWorksheet("LeTitre") as GoogleSpreadsheetWorksheet;

    const reader1 = new WorksheetReader("");
    expect(reader1.shouldUseWorksheet(worksheet)).toEqual(true);
    const reader2 = new WorksheetReader(null);
    expect(reader2.shouldUseWorksheet(worksheet)).toEqual(true);
    const reader3 = new WorksheetReader("*");
    expect(reader3.shouldUseWorksheet(worksheet)).toEqual(true);
  });

  it("should not use worksheet when title does not match the filter", () => {
    const worksheet = createWorksheet("LeTitre") as GoogleSpreadsheetWorksheet;

    const reader1 = new WorksheetReader(["a", "b"]);
    expect(reader1.shouldUseWorksheet(worksheet)).toEqual(false);
    const reader2 = new WorksheetReader(["a", 2]);
    expect(reader2.shouldUseWorksheet(worksheet)).toEqual(false);
    const reader3 = new WorksheetReader("a");
    expect(reader3.shouldUseWorksheet(worksheet)).toEqual(false);
  });

  it("should use worksheet when title match the filter exactly", () => {
    const worksheet = createWorksheet("LeTitre") as GoogleSpreadsheetWorksheet;

    const reader1 = new WorksheetReader(["a", "LeTitre"]);
    expect(reader1.shouldUseWorksheet(worksheet)).toEqual(true);
    const reader2 = new WorksheetReader(["a", 1]);
    expect(reader2.shouldUseWorksheet(worksheet)).toEqual(true);
    const reader3 = new WorksheetReader("LeTitre");
    expect(reader3.shouldUseWorksheet(worksheet)).toEqual(true);
  });

  it("should use worksheet when title match the filter case insensitive", () => {
    const worksheet = createWorksheet("LeTitre") as GoogleSpreadsheetWorksheet;

    const reader1 = new WorksheetReader(["a", "letitre"]);
    expect(reader1.shouldUseWorksheet(worksheet)).toEqual(true);
  });
});
