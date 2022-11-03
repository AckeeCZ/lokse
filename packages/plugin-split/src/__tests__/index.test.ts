import { Line } from "@lokse/core";
import type { LinesWithNamespace } from "@lokse/core";

import splitPlugin from "..";

describe("Split translations plugin", () => {
  const logger = { warn: jest.fn(), log: jest.fn() };

  beforeEach(() => {
    logger.warn.mockReset();
  });

  describe("sortLines hook", () => {
    it("splits by sheet title when split option is true", () => {
      const linesByWorksheet = {
        "Sheet 1": [
          new Line("general.yes", "Yes"),
          new Line("general.no", "No"),
        ],
        "Sheet 2": [
          new Line("general.foo", "Foo"),
          new Line("general.bar", "Bar"),
        ],
      };

      const plugin = splitPlugin({ namespaces: undefined, logger });
      const linesWithNamespace: LinesWithNamespace[] = [];

      const remainingLinesBySheet = plugin.sortLines(linesByWorksheet, {
        linesWithNamespace,
        language: "cs",
      });

      expect(remainingLinesBySheet).toEqual({});
      expect(linesWithNamespace).toEqual([
        { ns: "sheet-1", lines: linesByWorksheet["Sheet 1"] },
        { ns: "sheet-2", lines: linesByWorksheet["Sheet 2"] },
      ]);
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it("warns if there is only one sheet so splitting by sheet is useless", () => {
      const linesByWorksheet = {
        "Sheet 1": [
          new Line("general.yes", "Yes"),
          new Line("general.no", "No"),
        ],
      };

      const plugin = splitPlugin({ namespaces: undefined, logger });
      const linesWithNamespace: LinesWithNamespace[] = [];

      const remainingLinesBySheet = plugin.sortLines(linesByWorksheet, {
        linesWithNamespace,
        language: "cs",
      });

      expect(remainingLinesBySheet).toEqual({});
      expect(linesWithNamespace).toEqual([
        { ns: "sheet-1", lines: linesByWorksheet["Sheet 1"] },
      ]);
      expect(logger.warn).toHaveBeenCalledWith(
        "Requested splitting translations by sheet but only one sheet\n called Sheet 1 got. Check if this is intended."
      );
    });

    it("splits translations by specified namespaces and keep the rest from one sheet", () => {
      const linesByWorksheet = {
        "Sheet 1": [
          new Line("general.yes", "Yes"),
          new Line("general.no", "No"),
          new Line("login.username", "Uživatel"),
          new Line("login.password", "Heslo"),
          new Line("home.title", "Hlavní stránka"),
        ],
      };

      const plugin = splitPlugin({ namespaces: ["general", "login"], logger });
      const linesWithNamespace: LinesWithNamespace[] = [];

      const remainingLinesBySheet = plugin.sortLines(linesByWorksheet, {
        linesWithNamespace,
        language: "cs",
      });

      expect(remainingLinesBySheet).toEqual({
        "Sheet 1": [linesByWorksheet["Sheet 1"][4]],
      });
      expect(linesWithNamespace).toEqual([
        {
          ns: "general",
          lines: [
            linesByWorksheet["Sheet 1"][0],
            linesByWorksheet["Sheet 1"][1],
          ],
        },
        {
          ns: "login",
          lines: [
            linesByWorksheet["Sheet 1"][2],
            linesByWorksheet["Sheet 1"][3],
          ],
        },
      ]);
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it("splits translations by specified namespaces and keep the rest across multiple sheets", () => {
      const linesByWorksheet = {
        "Sheet 1": [
          new Line("general.yes", "Yes"),
          new Line("general.no", "No"),
          new Line("app.title", "Moje aplikace"),
        ],
        "Sheet 2": [
          new Line("app.subtitle", "testovací aplikace pro split plugin"),
          new Line("login.username", "Uživatel"),
          new Line("login.password", "Heslo"),
          new Line("general.action.save", "Uložit"),
        ],
        "Sheet 3": [new Line("login.title", "Přihlášení")],
      };

      const plugin = splitPlugin({ namespaces: ["app", "login"], logger });
      const linesWithNamespace: LinesWithNamespace[] = [];

      const remainingLinesBySheet = plugin.sortLines(linesByWorksheet, {
        linesWithNamespace,
        language: "cs",
      });

      expect(remainingLinesBySheet).toEqual({
        "Sheet 1": [
          linesByWorksheet["Sheet 1"][0],
          linesByWorksheet["Sheet 1"][1],
        ],
        "Sheet 2": [linesByWorksheet["Sheet 2"][3]],
      });
      expect(linesWithNamespace).toEqual([
        {
          ns: "app",
          lines: [
            linesByWorksheet["Sheet 1"][2],
            linesByWorksheet["Sheet 2"][0],
          ],
        },
        {
          ns: "login",
          lines: [
            linesByWorksheet["Sheet 2"][1],
            linesByWorksheet["Sheet 2"][2],
            linesByWorksheet["Sheet 3"][0],
          ],
        },
      ]);
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it("splits correctly when namespace is nested (contains dot)", () => {
      const linesByWorksheet = {
        "Sheet 1": [
          new Line("app.general.yes", "Yes"),
          new Line("app.general.no", "No"),
        ],
        "Sheet 2": [
          new Line("login.username", "Uživatel"),
          new Line("login.password", "Heslo"),
        ],
      };

      const plugin = splitPlugin({
        namespaces: ["app.general", "login"],
        logger,
      });
      const linesWithNamespace: LinesWithNamespace[] = [];

      const remainingLinesBySheet = plugin.sortLines(linesByWorksheet, {
        linesWithNamespace,
        language: "cs",
      });

      expect(remainingLinesBySheet).toEqual({});
      expect(linesWithNamespace).toEqual([
        {
          ns: "app.general",
          lines: linesByWorksheet["Sheet 1"],
        },
        {
          ns: "login",
          lines: linesByWorksheet["Sheet 2"],
        },
      ]);
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it("splits correctly when namespace name is part of other namespace", () => {
      const linesByWorksheet = {
        "Sheet 1": [
          new Line("home.title", "Bejsbol"),
          new Line("home.subtitle", "Aplikace o bejsbolu"),
          new Line("homerun.yes", "Byl"),
          new Line("homerun.no", "Nebyl"),
        ],
      };

      const plugin = splitPlugin({ namespaces: ["home", "homerun"], logger });
      const linesWithNamespace: LinesWithNamespace[] = [];

      const remainingLinesBySheet = plugin.sortLines(linesByWorksheet, {
        linesWithNamespace,
        language: "cs",
      });

      expect(remainingLinesBySheet).toEqual({});
      expect(linesWithNamespace).toEqual([
        {
          ns: "home",
          lines: [
            linesByWorksheet["Sheet 1"][0],
            linesByWorksheet["Sheet 1"][1],
          ],
        },
        {
          ns: "homerun",
          lines: [
            linesByWorksheet["Sheet 1"][2],
            linesByWorksheet["Sheet 1"][3],
          ],
        },
      ]);
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it("warns when some namespace has no lines", () => {
      const linesByWorksheet = {
        "Sheet 1": [
          new Line("general.yes", "Yes"),
          new Line("general.no", "No"),
        ],
        "Sheet 2": [
          new Line("login.username", "Uživatel"),
          new Line("login.password", "Heslo"),
        ],
      };

      const plugin = splitPlugin({
        namespaces: ["app", "general", "login"],
        logger,
      });
      const linesWithNamespace: LinesWithNamespace[] = [];

      const remainingLinesBySheet = plugin.sortLines(linesByWorksheet, {
        linesWithNamespace,
        language: "cs",
      });

      expect(remainingLinesBySheet).toEqual({});
      expect(linesWithNamespace).toHaveLength(2);
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringMatching(/no lines for language cs and namespace app/i)
      );
    });

    it("throw when namespaces configured incorrectly", () => {
      const linesByWorksheet = {
        "Sheet 1": [
          new Line("general.yes", "Yes"),
          new Line("general.no", "No"),
          new Line("app.title", "Moje aplikace"),
        ],
        "Sheet 2": [
          new Line("app.subtitle", "testovací aplikace pro split plugin"),
          new Line("login.username", "Uživatel"),
          new Line("login.password", "Heslo"),
          new Line("general.action.save", "Uložit"),
        ],
        "Sheet 3": [new Line("login.title", "Přihlášení")],
      };

      // @ts-expect-error Check possible runtime error
      const plugin = splitPlugin({ namespaces: "app", logger });
      const linesWithNamespace: LinesWithNamespace[] = [];

      expect(() =>
        plugin.sortLines(linesByWorksheet, {
          linesWithNamespace,
          language: "cs",
        })
      ).toThrowError(/must be omitted or an array/);
    });
  });
});
