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

    expect(lines.length).toEqual(6);
    expect(lines[0].key).toEqual("MaClé1");
    expect(lines[0].value).toEqual("La valeur 1");

    expect(lines[2].isComment()).toEqual(true);
    expect(lines[4].isEmpty()).toEqual(true);
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

    expect(result.length).toEqual(1);
    expect(result[0].key).toEqual("MaClé1");
    expect(result[0].value).toEqual("");

    expect(result[0].isComment()).toEqual(false);
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

    expect(result.length).toEqual(2);
    expect(result[0].isEmpty()).toEqual(true);
    expect(result[1].isEmpty()).toEqual(false);
  });

  it("should match column names case insensitively", () => {
    const reader = new SpreadsheetReader("api_key", "*");

    let worksheet: Worksheet = {
      header: ["Key", "Value_FR"],
      rows: [createRow(1, { Key: "MaClé1", Value_FR: "La valeur 1" })],
    };

    let result = reader.extractFromWorksheet(worksheet, "key", "value_fr");

    expect(result.length).toEqual(1);
    expect(result[0].key).toEqual("MaClé1");
    expect(result[0].value).toEqual("La valeur 1");

    worksheet = {
      header: ["key", "value_fr"],
      rows: [createRow(1, { key: "MaClé2", value_fr: "La valeur 2" })],
    };

    result = reader.extractFromWorksheet(worksheet, "Key", "VALUE_FR");

    expect(result.length).toEqual(1);
    expect(result[0].key).toEqual("MaClé2");
    expect(result[0].value).toEqual("La valeur 2");
  });
});
