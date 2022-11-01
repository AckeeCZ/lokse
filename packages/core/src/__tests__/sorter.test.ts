import Line from "../line";
import { Sorter } from "../sorter";
import { OTHER_TRANSLATIONS_NAMESPACE } from "../constants";
import { PluginsRunner } from "../plugins";

const logger = { warn: jest.fn(), log: jest.fn() };
const plugin = {
  pluginName: "test",
  transformFullOutput: jest.fn(),
  transformLine: jest.fn(),
  readTranslation: jest.fn(),
  sortLines: jest.fn(),
};

const plugins = new PluginsRunner([plugin], { logger });

describe("Sorter.sort", () => {
  const sorter = new Sorter();
  const sorterWithPlugins = new Sorter(plugins);

  beforeEach(() => {
    plugin.sortLines.mockReset();
  });

  it("put all translations from single sheet spreadsheet to the other namespace", async () => {
    const lines = {
      sheet1: [new Line("general.yes", "Yes"), new Line("general.no", "No")],
    };
    const result = await sorter.sort(lines, "cs");

    expect(result).toEqual([
      { ns: OTHER_TRANSLATIONS_NAMESPACE, lines: [...lines.sheet1] },
    ]);
  });

  it("put all translations from multi sheet spreadsheet to the other namespace", async () => {
    const lines = {
      sheet1: [new Line("general.yes", "Yes"), new Line("general.no", "No")],
      sheet2: [
        new Line("login.username", "Uživatel"),
        new Line("login.password", "Heslo"),
      ],
    };
    const result = await sorter.sort(lines, "cs");

    expect(result).toEqual([
      {
        ns: OTHER_TRANSLATIONS_NAMESPACE,
        lines: [...lines.sheet1, ...lines.sheet2],
      },
    ]);
  });

  it("should put all rest translations after processing by plugins to the rest", async () => {
    const lines = {
      sheet1: [
        new Line("login.username", "Uživatel"),
        new Line("login.password", "Heslo"),
      ],
      sheet2: [new Line("general.yes", "Yes"), new Line("general.no", "No")],
    };

    plugin.sortLines.mockImplementationOnce((_, meta) => {
      meta.linesWithNamespace.push({ lines: lines.sheet1, ns: "login" });

      return {
        sheet2: lines.sheet2,
      };
    });

    const result = await sorterWithPlugins.sort(lines, "cs");

    expect(result).toEqual([
      {
        ns: "login",
        lines: [...lines.sheet1],
      },
      {
        ns: OTHER_TRANSLATIONS_NAMESPACE,
        lines: [...lines.sheet2],
      },
    ]);
  });

  it("should merge rest translations with other translations by plugin", async () => {
    const lines = {
      sheet1: [
        new Line("login.username", "Uživatel"),
        new Line("login.password", "Heslo"),
      ],
      sheet2: [new Line("app.title", "Moje app")],
      sheet3: [new Line("general.yes", "Yes"), new Line("general.no", "No")],
    };

    plugin.sortLines.mockImplementationOnce((_, meta) => {
      meta.linesWithNamespace[0].lines = lines.sheet2;
      meta.linesWithNamespace.push({ lines: lines.sheet1, ns: "login" });

      return {
        sheet3: lines.sheet3,
      };
    });

    const result = await sorterWithPlugins.sort(lines, "cs");

    expect(result).toEqual([
      {
        ns: "login",
        lines: [...lines.sheet1],
      },
      {
        ns: OTHER_TRANSLATIONS_NAMESPACE,
        lines: [...lines.sheet2, ...lines.sheet3],
      },
    ]);
  });

  it("should delete other namespace when it's empty", async () => {
    const lines = {
      sheet1: [new Line("general.yes", "Yes"), new Line("general.no", "No")],
      sheet2: [
        new Line("login.username", "Uživatel"),
        new Line("login.password", "Heslo"),
      ],
    };

    plugin.sortLines.mockImplementationOnce((_, meta) => {
      meta.linesWithNamespace.push(
        { lines: lines.sheet1, ns: "general" },
        { lines: lines.sheet2, ns: "login" }
      );

      return {};
    });

    const result = await sorterWithPlugins.sort(lines, "cs");

    expect(result).toEqual([
      {
        ns: "general",
        lines: [...lines.sheet1],
      },
      {
        ns: "login",
        lines: [...lines.sheet2],
      },
    ]);
  });

  it("should always move other translations to the end", async () => {
    const lines = {
      sheet1: [new Line("general.yes", "Yes"), new Line("general.no", "No")],
      sheet2: [
        new Line("login.username", "Uživatel"),
        new Line("login.password", "Heslo"),
      ],
    };

    plugin.sortLines.mockImplementationOnce((_, meta) => {
      meta.linesWithNamespace[0].lines = lines.sheet1;
      meta.linesWithNamespace.push({ lines: lines.sheet2, ns: "login" });

      return {};
    });

    const result = await sorterWithPlugins.sort(lines, "cs");

    expect(result).toEqual([
      {
        ns: "login",
        lines: [...lines.sheet2],
      },
      {
        ns: OTHER_TRANSLATIONS_NAMESPACE,
        lines: [...lines.sheet1],
      },
    ]);
  });

  // THESE belongs to the plugin
  it.todo("splits by sheet title when split option is true");

  it.todo("warns if there is only one sheet so splitting is unnecessary");

  it.todo(
    "split translations by specified namespaces and put rest into the other"
  );

  it.todo("should split correctly when namespace is nested (contains dot)");

  it.todo("should split correctly when domain name is part of other domain");
});
