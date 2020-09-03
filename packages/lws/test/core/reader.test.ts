import * as assert from "assert";
import SpreadsheetReader from "../../src/core/reader";

describe("SpreadsheetReader.extractFromWorksheet", () => {
  it("should extra lines", () => {
    const reader = new SpreadsheetReader("api_key", "*");

    const rawWorksheet = [
      { value: "Key", row: 1, col: 1 },
      { value: "Value_fr", row: 1, col: 2 },
      { value: "Value_nl", row: 1, col: 3 },
      { value: "MaClé1", row: 2, col: 1 },
      { value: "La valeur 1", row: 2, col: 2 },
      { value: "De valuue 1", row: 2, col: 3 },
      { value: "MaClé2", row: 3, col: 1 },
      { value: "La vale de la clé 2", row: 3, col: 2 },
      { value: "De valuee van key 2", row: 3, col: 3 },
      { value: "// un commentaire", row: 4, col: 1 },
      { value: "une clée", row: 5, col: 1 },
      { value: "# un autre commentaire", row: 7, col: 1 },
    ];

    const lines = reader.extractFromWorksheet(rawWorksheet, "Key", "Value_fr");

    assert.strictEqual(6, lines.length);
    assert.strictEqual("MaClé1", lines[0].key);
    assert.strictEqual("La valeur 1", lines[0].value);

    assert.strictEqual(true, lines[2].isComment());
    assert.strictEqual(true, lines[4].isEmpty());
  });

  it("should still work when val column doesnt exist ", () => {
    const reader = new SpreadsheetReader("api_key", "*");

    const rawWorksheet = [
      { value: "Key", row: 1, col: 1 },
      { value: "Value_fr", row: 1, col: 2 },
      { value: "Value_nl", row: 1, col: 3 },
      { value: "MaClé1", row: 2, col: 1 },
      { value: "La valeur 1", row: 2, col: 2 },
      { value: "De valuue 1", row: 2, col: 3 },
    ];

    const result = reader.extractFromWorksheet(rawWorksheet, "Key", "NotExist");

    assert.strictEqual(1, result.length);
    assert.strictEqual("MaClé1", result[0].key);
    assert.strictEqual("", result[0].value);

    assert.strictEqual(false, result[0].isComment());
  });

  it("should keep empty lines", () => {
    const reader = new SpreadsheetReader("api_key", "*");

    const rawWorksheet = [
      { value: "Key", row: 1, col: 1 },
      { value: "Value_fr", row: 1, col: 2 },
      { value: "Value_nl", row: 1, col: 3 },
      { value: "MaClé1", row: 3, col: 1 },
      { value: "La valeur 1", row: 3, col: 2 },
      { value: "De valuue 1", row: 3, col: 3 },
    ];

    const result = reader.extractFromWorksheet(rawWorksheet, "Key", "Value_fr");

    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].isEmpty(), true);
    assert.strictEqual(result[1].isEmpty(), false);
  });
});
