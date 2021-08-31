import { GoogleSpreadsheetRow } from "google-spreadsheet";
import { Line } from "@lokse/core";

import fallbackPluginFactory from "..";
import type { PluginOptions } from "..";

describe("Fallback plugin", () => {
  const logger = { warn: jest.fn(), log: jest.fn() };
  const meta = { languages: ["cs", "mng"] };

  beforeEach(() => {
    logger.warn.mockReset();
  });

  it("should throw when default language not passed", () => {
    const options = { logger } as unknown as PluginOptions;

    expect(() => fallbackPluginFactory(options, meta)).toThrow(
      /default language must be supplied/i
    );
  });

  it("should throw when passed default language is not from list of languages", () => {
    const options = { logger, defaultLanguage: "sk" };

    expect(() => fallbackPluginFactory(options, meta)).toThrow(
      /not available/i
    );
  });

  describe("readTranslation hook", () => {
    const plugin = fallbackPluginFactory(
      { logger, defaultLanguage: "cs" },
      meta
    );

    it("should keep translation as it is when filled", async () => {
      const line = new Line("test.key", "Ukama bugama");
      const row = {
        key: "test.key",
        mng: "Ukama bugama",
        cs: "Nejakej nesmysl",
      } as unknown as GoogleSpreadsheetRow;
      const meta = { row, key: line.key, language: "mng" };

      await expect(plugin.readTranslation(line, meta)).resolves.toHaveProperty(
        "value",
        "Ukama bugama"
      );
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it("should log warning when fallback translation not available", async () => {
      const line = new Line("test.key", "");
      const row = {
        key: "test.key",
        mng: "",
        cs: "",
      } as unknown as GoogleSpreadsheetRow;
      const meta = { row, key: line.key, language: "mng" };

      await expect(plugin.readTranslation(line, meta)).resolves.toHaveProperty(
        "value",
        ""
      );
      expect(logger.warn).toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringMatching(
          'Fallback translation of key "test.key" not found'
        )
      );
    });

    it("should fallback to default language translation when translation is empty", async () => {
      const line = new Line("test.key", "");
      const row = {
        key: "test.key",
        mng: "",
        cs: "Nejakej nesmysl",
      } as unknown as GoogleSpreadsheetRow;
      const meta = { row, key: line.key, language: "mng" };

      await expect(plugin.readTranslation(line, meta)).resolves.toHaveProperty(
        "value",
        "Nejakej nesmysl"
      );
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it("should fallback to default language case insensivly", async () => {
      const line = new Line("test.key", "");
      const row = {
        key: "test.key",
        MNG: "",
        CS: "Nejakej nesmysl",
      } as unknown as GoogleSpreadsheetRow;
      const meta = { row, key: line.key, language: "mng" };

      await expect(plugin.readTranslation(line, meta)).resolves.toHaveProperty(
        "value",
        "Nejakej nesmysl"
      );
      expect(logger.warn).not.toHaveBeenCalled();
    });
  });
});
