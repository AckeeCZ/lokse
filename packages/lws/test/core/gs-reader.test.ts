import * as assert from "assert";
import { GSReader } from "../../src/core/line-reader";

describe("GSReader.shouldUseWorksheet", () => {
  it("should use worksheet when empty or null or start", () => {
    assert.equal(true, GSReader.shouldUseWorksheet("", "LeTitre", 1));
    assert.equal(true, GSReader.shouldUseWorksheet(null, "LeTitre", 1));
    assert.equal(true, GSReader.shouldUseWorksheet("*", "LeTitre", 1));
    assert.equal(false, GSReader.shouldUseWorksheet("a", "LeTitre", 1));
  });

  it("should not use worksheet when title not specified", () => {
    assert.equal(false, GSReader.shouldUseWorksheet(["a", "b"], "LeTitre", 1));
    assert.equal(false, GSReader.shouldUseWorksheet(["a", 2], "LeTitre", 1));
  });

  it("should use worksheet when title or index specified", () => {
    assert.equal(
      true,
      GSReader.shouldUseWorksheet(["a", "LeTitre"], "LeTitre", 1)
    );
    assert.equal(true, GSReader.shouldUseWorksheet(["a", 1], "LeTitre", 1));
  });
});

describe("GSReader.extractFromWorksheet", () => {
  it("should extra lines", () => {
    const reader = new GSReader("api_key", "*");

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

    const result = reader.extractFromWorksheet(rawWorksheet, "Key", "Value_fr");

    assert.equal(6, result.length);
    assert.equal("MaClé1", result[0].getKey());
    assert.equal("La valeur 1", result[0].getValue());

    assert.equal(true, result[2].isComment());
    assert.equal(true, result[4].isEmpty());
  });

  it("should still work when val column doesnt exist ", () => {
    const reader = new GSReader("api_key", "*");

    const rawWorksheet = [
      { value: "Key", row: 1, col: 1 },
      { value: "Value_fr", row: 1, col: 2 },
      { value: "Value_nl", row: 1, col: 3 },
      { value: "MaClé1", row: 2, col: 1 },
      { value: "La valeur 1", row: 2, col: 2 },
      { value: "De valuue 1", row: 2, col: 3 },
    ];

    const result = reader.extractFromWorksheet(rawWorksheet, "Key", "NotExist");

    assert.equal(1, result.length);
    assert.equal("MaClé1", result[0].getKey());
    assert.equal("", result[0].getValue());

    assert.equal(false, result[0].isComment());
  });

  it("should keep empty lines", () => {
    const reader = new GSReader("api_key", "*");

    const rawWorksheet = [
      { value: "Key", row: 1, col: 1 },
      { value: "Value_fr", row: 1, col: 2 },
      { value: "Value_nl", row: 1, col: 3 },
      { value: "MaClé1", row: 3, col: 1 },
      { value: "La valeur 1", row: 3, col: 2 },
      { value: "De valuue 1", row: 3, col: 3 },
    ];

    const result = reader.extractFromWorksheet(rawWorksheet, "Key", "Value_fr");

    assert.equal(2, result.length);
    assert.equal(true, result[0].isEmpty());
    assert.equal(false, result[1].isEmpty());
  });
});
