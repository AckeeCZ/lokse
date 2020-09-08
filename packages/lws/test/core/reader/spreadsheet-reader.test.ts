import * as assert from "assert";
import SpreadsheetReader from "../../../src/core/reader";
import { Worksheet } from "../../../src/core/reader/worksheet-reader";

describe("SpreadsheetReader.extractFromWorksheet", () => {
  const createRow = (rowIndex, values) => ({
    rowIndex,
    ...values,
    save: () => null,
    delete: () => null,
  });

  it("should extract lines", () => {
    const reader = new SpreadsheetReader("api_key", "*");

    const worksheet: Worksheet = {
      header: ["Key", "Value_fr", "Value_nl"],
      rows: [
        createRow(1, {
          Key: "MaClé1",
          Value_fr: "La valeur 1",
          Value_nl: "De valuue 1",
        }),
        createRow(2, {
          Key: "MaClé2",
          Value_fr: "La vale de la clé 2",
          Value_nl: "De valuee van key 2",
        }),
        createRow(3, { Key: "// un commentaire" }),
        createRow(4, { Key: "une clée" }),
        createRow(5, {}),
        createRow(6, { Key: "# un autre commentaire" }),
      ],
    };

    const lines = reader.extractFromWorksheet(worksheet, "Key", "Value_fr");

    assert.strictEqual(lines.length, 6);
    assert.strictEqual(lines[0].key, "MaClé1");
    assert.strictEqual(lines[0].value, "La valeur 1");

    assert.strictEqual(lines[2].isComment(), true);
    assert.strictEqual(lines[4].isEmpty(), true);
  });

  it("should still work when val column doesnt exist ", () => {
    const reader = new SpreadsheetReader("api_key", "*");

    const worksheet: Worksheet = {
      header: ["Key", "Value_fr", "Value_nl"],
      rows: [
        createRow(1, {
          Key: "MaClé1",
          Value_fr: "La valeur 1",
          Value_nl: "De valuue 1",
        }),
      ],
    };

    const result = reader.extractFromWorksheet(worksheet, "Key", "NotExist");

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].key, "MaClé1");
    assert.strictEqual(result[0].value, "");

    assert.strictEqual(result[0].isComment(), false);
  });

  it("should keep empty lines", () => {
    const reader = new SpreadsheetReader("api_key", "*");

    const worksheet: Worksheet = {
      header: ["Key", "Value_fr", "Value_nl"],
      rows: [
        createRow(1, {}),
        createRow(2, {
          Key: "MaClé1",
          Value_fr: "La valeur 1",
          Value_nl: "De valuue 1",
        }),
      ],
    };

    const result = reader.extractFromWorksheet(worksheet, "Key", "Value_fr");

    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].isEmpty(), true);
    assert.strictEqual(result[1].isEmpty(), false);
  });

  it("should match column names case insensitively", () => {
    const reader = new SpreadsheetReader("api_key", "*");

    let worksheet: Worksheet = {
      header: ["Key", "Value_FR"],
      rows: [createRow(1, { Key: "MaClé1", Value_FR: "La valeur 1" })],
    };

    let result = reader.extractFromWorksheet(worksheet, "key", "value_fr");

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].key, "MaClé1");
    assert.strictEqual(result[0].value, "La valeur 1");

    worksheet = {
      header: ["key", "value_fr"],
      rows: [createRow(1, { key: "MaClé2", value_fr: "La valeur 2" })],
    };

    result = reader.extractFromWorksheet(worksheet, "Key", "VALUE_FR");

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].key, "MaClé2");
    assert.strictEqual(result[0].value, "La valeur 2");
  });
});
