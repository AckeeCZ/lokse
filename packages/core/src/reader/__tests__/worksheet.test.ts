import { GoogleSpreadsheetRow } from "google-spreadsheet";
import { KeyColumnNotFound, LangColumnNotFound } from "../../errors";
import { PluginsRunner } from "../../plugins";
import Worksheet from "../worksheet";

describe("Worksheet", () => {
  const logger = { warn: jest.fn(), log: jest.fn() };
  const noPlugins = new PluginsRunner([], { logger });

  const createRow = (rowIndex: number, values: { [key: string]: any }) =>
    ({
      rowIndex,
      ...values,
      save: () => null,
      delete: () => null,
    } as unknown as GoogleSpreadsheetRow);

  it("should extract lines", async () => {
    const worksheet = new Worksheet(
      "Worksheet1",
      ["Key", "Value_fr", "Value_nl"],
      [
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
      ]
    );

    const lines = await worksheet.extractLines("Key", "Value_fr", noPlugins);

    expect(lines.length).toEqual(6);
    expect(lines[0].key).toEqual("MaClé1");
    expect(lines[0].value).toEqual("La valeur 1");

    expect(lines[2].isComment()).toEqual(true);
    expect(lines[4].isEmpty()).toEqual(true);
  });

  it("should throw when key column doesnt exist ", async () => {
    const worksheet = new Worksheet(
      "Worksheet2",
      ["Key", "Value_fr", "Value_nl"],
      [
        createRow(1, {
          Key: "MaClé1",
          Value_fr: "La valeur 1",
          Value_nl: "De valuue 1",
        }),
      ]
    );

    await expect(() =>
      worksheet.extractLines("Wrong_Key", "Value_fr", noPlugins)
    ).rejects.toThrow(new KeyColumnNotFound("Wrong_Key", "Worksheet2").message);
  });

  it("should throw when lang column doesnt exist ", async () => {
    const worksheet = new Worksheet(
      "Worksheet2",
      ["Key", "Value_fr", "Value_nl"],
      [
        createRow(1, {
          Key: "MaClé1",
          Value_fr: "La valeur 1",
          Value_nl: "De valuue 1",
        }),
      ]
    );

    await expect(() =>
      worksheet.extractLines("Key", "NotExist", noPlugins)
    ).rejects.toThrow(new LangColumnNotFound("NotExist", "Worksheet2").message);
  });

  it("should keep empty lines", async () => {
    const worksheet = new Worksheet(
      "Worksheet3",
      ["Key", "Value_fr", "Value_nl"],
      [
        createRow(1, {}),
        createRow(2, {
          Key: "MaClé1",
          Value_fr: "La valeur 1",
          Value_nl: "De valuue 1",
        }),
      ]
    );

    const result = await worksheet.extractLines("Key", "Value_fr", noPlugins);

    expect(result.length).toEqual(2);
    expect(result[0].isEmpty()).toEqual(true);
    expect(result[1].isEmpty()).toEqual(false);
  });

  it("should match column names case insensitively", async () => {
    let worksheet = new Worksheet(
      "Worksheet4",
      ["Key", "Value_FR"],
      [createRow(1, { Key: "MaClé1", Value_FR: "La valeur 1" })]
    );

    let result = await worksheet.extractLines("key", "value_fr", noPlugins);

    expect(result.length).toEqual(1);
    expect(result[0].key).toEqual("MaClé1");
    expect(result[0].value).toEqual("La valeur 1");

    worksheet = new Worksheet(
      "Worksheet5",
      ["key", "value_fr"],
      [createRow(1, { key: "MaClé2", value_fr: "La valeur 2" })]
    );

    result = await worksheet.extractLines("Key", "VALUE_FR", noPlugins);

    expect(result.length).toEqual(1);
    expect(result[0].key).toEqual("MaClé2");
    expect(result[0].value).toEqual("La valeur 2");
  });
});
