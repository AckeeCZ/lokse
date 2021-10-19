import { Line } from "@lokse/core";

import nonBreakingSpacesPlugin from "..";

describe("Fallback plugin", () => {
  const logger = { warn: jest.fn(), log: jest.fn() };

  beforeEach(() => {
    logger.warn.mockReset();
  });

  describe("transformLine hook", () => {
    it("should replace white spaces after single letter chars with non-breaking spaces", async () => {
      const plugin = nonBreakingSpacesPlugin({ logger });

      const initialValue =
        "A kdyby tady spadli marťani, tak je budeme schvalovat i třeba s marťany. Byly z divokých vajec. K večeři a obědu. O Vánocích. U tebe.";
      const targetValue =
        "A\u00A0kdyby tady spadli marťani, tak je budeme schvalovat i\u00A0třeba s\u00A0marťany. Byly z\u00A0divokých vajec. K\u00A0večeři a\u00A0obědu. O\u00A0Vánocích. U\u00A0tebe.";

      const line = new Line("test.key", initialValue);

      const meta = { key: line.key, language: "cs" };

      const transformedLine = await plugin.transformLine(line, meta);

      expect(transformedLine.value).toBe(targetValue);

      expect(logger.warn).not.toHaveBeenCalled();
    });

    it("should work with custom pattern provided", async () => {
      const plugin = nonBreakingSpacesPlugin({
        logger,
        customPatterns: { "ad-HD": /(\s|^)(a|i|k|o|s|u|v|z)(\s+)/gim },
      });

      const initialValue =
        "A kdyby tady spadli marťani, tak je budeme schvalovat i třeba s marťany. Byly z divokých vajec. K večeři a obědu. O Vánocích. U tebe.";
      const targetValue =
        "A\u00A0kdyby tady spadli marťani, tak je budeme schvalovat i\u00A0třeba s\u00A0marťany. Byly z\u00A0divokých vajec. K\u00A0večeři a\u00A0obědu. O\u00A0Vánocích. U\u00A0tebe.";

      const language = "ad-HD";

      const line = new Line("test.key", initialValue);

      const meta = { key: line.key, language };

      const transformedLine = await plugin.transformLine(line, meta);

      expect(transformedLine.value).toBe(targetValue);

      expect(logger.warn).not.toHaveBeenCalled();
    });

    it("should warn if language pattern is missing", async () => {
      const plugin = nonBreakingSpacesPlugin({ logger });

      const language = "ad-HD";

      const line = new Line("test.key", "Záhada alobalu");

      const meta = { key: line.key, language };

      await plugin.transformLine(line, meta);

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringMatching(
          `Pattern for current language ${language} was not found`
        )
      );
    });

    it("should replace white spaces after single letter chars with &nbsp;  HTML entity", async () => {
      const plugin = nonBreakingSpacesPlugin({ logger, useNbsp: true });

      const initialValue =
        "A kdyby tady spadli marťani, tak je budeme schvalovat i třeba s marťany. Byly z divokých vajec. K večeři a obědu. O Vánocích. U tebe.";
      const targetValue =
        "A&nbsp;kdyby tady spadli marťani, tak je budeme schvalovat i&nbsp;třeba s&nbsp;marťany. Byly z&nbsp;divokých vajec. K&nbsp;večeři a&nbsp;obědu. O&nbsp;Vánocích. U&nbsp;tebe.";

      const line = new Line("test.key", initialValue);

      const meta = { key: line.key, language: "cs" };

      const transformedLine = await plugin.transformLine(line, meta);

      expect(transformedLine.value).toBe(targetValue);

      expect(logger.warn).not.toHaveBeenCalled();
    });
  });
});
