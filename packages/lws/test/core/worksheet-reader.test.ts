import * as assert from "assert";
import WorksheetReader from "../../src/core/reader/worksheet-reader";

describe("WorksheetReader.shouldUseWorksheet", () => {
  const worksheet = {
    id: "le",
    title: "LeTitre",
    getCells: null,
  };

  it("should use worksheet when empty or null or start", () => {
    const reader1 = new WorksheetReader("");
    assert.strictEqual(true, reader1.shouldUseWorksheet(worksheet, 1));
    const reader2 = new WorksheetReader(null);
    assert.strictEqual(true, reader2.shouldUseWorksheet(worksheet, 1));
    const reader3 = new WorksheetReader("*");
    assert.strictEqual(true, reader3.shouldUseWorksheet(worksheet, 1));
  });

  it("should not use worksheet when title not specified", () => {
    const worksheet = {
      id: "le",
      title: "LeTitre",
      getCells: null,
    };

    const reader1 = new WorksheetReader(["a", "b"]);
    assert.strictEqual(false, reader1.shouldUseWorksheet(worksheet, 1));
    const reader2 = new WorksheetReader(["a", 2]);
    assert.strictEqual(false, reader2.shouldUseWorksheet(worksheet, 1));
  });

  it("should use worksheet when title or index specified", () => {
    const worksheet = {
      id: "le",
      title: "LeTitre",
      getCells: null,
    };

    const reader1 = new WorksheetReader(["a", "LeTitre"]);
    assert.strictEqual(true, reader1.shouldUseWorksheet(worksheet, 1));
    const reader2 = new WorksheetReader(["a", 1]);
    assert.strictEqual(true, reader2.shouldUseWorksheet(worksheet, 1));
  });

  it("should not use worksheet when filter doesnt pass", () => {
    const reader1 = new WorksheetReader("a");
    assert.strictEqual(false, reader1.shouldUseWorksheet(worksheet, 1));
  });
});
