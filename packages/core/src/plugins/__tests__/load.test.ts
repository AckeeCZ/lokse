const generalOptions = {
  logger: {
    warn: jest.fn(),
    log: jest.fn(),
  },
};

const plugin1Factory = jest.fn();
const plugin2Factory = jest.fn();
const plugin3Factory = jest.fn();

jest.doMock("@lokse/plugin1", () => plugin1Factory, {
  virtual: true,
});
jest.doMock("@lokse/plugin2", () => plugin2Factory, {
  virtual: true,
});
jest.doMock("@lokse/plugin3", () => plugin3Factory, {
  virtual: true,
});

import { loadPlugins } from "../load";

describe("loadPlugins", () => {
  const plugin1Matcher = expect.objectContaining({ id: "plugin1" });
  const plugin2Matcher = expect.objectContaining({ id: "plugin2" });
  const plugin3Matcher = expect.objectContaining({ id: "plugin3" });

  beforeEach(() => {
    plugin1Factory.mockReset().mockReturnValue({ id: "plugin1" });
    plugin2Factory.mockReset().mockReturnValue({ id: "plugin2" });
    plugin3Factory.mockReset().mockReturnValue({ id: "plugin3" });
    generalOptions.logger.warn.mockClear();
    generalOptions.logger.log.mockClear();
  });

  it("should load plugins by name", () => {
    const plugins = ["@lokse/plugin1", "@lokse/plugin2"];

    expect(loadPlugins(plugins, generalOptions).plugins).toEqual([
      plugin1Matcher,
      plugin2Matcher,
    ]);
    expect(plugin1Factory).toHaveBeenCalled();
    expect(plugin1Factory).toHaveBeenCalledWith(generalOptions);
    expect(plugin2Factory).toHaveBeenCalled();
    expect(plugin2Factory).toHaveBeenCalledWith(generalOptions);
  });

  it("should load plugins by full definition", () => {
    const plugin2Options = { test: "test2" };
    const plugin3Options = { test: "test3" };
    const plugins = [
      { name: "@lokse/plugin2", options: plugin2Options },
      { name: "@lokse/plugin3", options: plugin3Options },
    ];

    expect(loadPlugins(plugins, generalOptions).plugins).toEqual([
      plugin2Matcher,
      plugin3Matcher,
    ]);
    expect(plugin2Factory).toHaveBeenCalled();
    expect(plugin2Factory).toHaveBeenCalledWith({
      ...generalOptions,
      ...plugin2Options,
    });
    expect(plugin3Factory).toHaveBeenCalled();
    expect(plugin3Factory).toHaveBeenCalledWith({
      ...generalOptions,
      ...plugin3Options,
    });
  });

  it("should load all plugins mixed names and definitions", () => {
    const pluginOptions = { test: "test" };
    const plugins = [
      { name: "@lokse/plugin1", options: pluginOptions },
      "@lokse/plugin3",
    ];

    expect(loadPlugins(plugins, generalOptions).plugins).toEqual([
      plugin1Matcher,
      plugin3Matcher,
    ]);
    expect(plugin1Factory).toHaveBeenCalled();
    expect(plugin1Factory).toHaveBeenCalledWith({
      ...generalOptions,
      ...pluginOptions,
    });
    expect(plugin3Factory).toHaveBeenCalled();
    expect(plugin3Factory).toHaveBeenCalledWith(generalOptions);
  });

  it("should log plugins that were unable to find and load others", () => {
    const plugins = [
      "@lokse/plugin1",
      "@lokse/plugin1.5",
      "@lokse/plugin2",
      "@lokse/plugin4",
    ];

    expect(loadPlugins(plugins, generalOptions).plugins).toEqual([
      plugin1Matcher,
      plugin2Matcher,
    ]);
    expect(generalOptions.logger.warn).toHaveBeenCalledTimes(2);
    expect(generalOptions.logger.warn).toHaveBeenCalledWith(
      expect.stringMatching(/Unable to load/)
    );
  });

  it("should log errors that occurred during its initialization", () => {
    plugin1Factory.mockImplementation(() => {
      throw new Error("Plugin 1 requires options");
    });
    plugin2Factory.mockImplementation(() => {
      throw new Error("Plugin 2 contains error");
    });
    const plugins = ["@lokse/plugin1", "@lokse/plugin2", "@lokse/plugin3"];

    expect(loadPlugins(plugins, generalOptions).plugins).toEqual([
      plugin3Matcher,
    ]);
    expect(generalOptions.logger.warn).toHaveBeenCalledTimes(2);
    expect(generalOptions.logger.warn).toHaveBeenCalledWith(
      expect.stringMatching("Plugin 1 requires options")
    );
    expect(generalOptions.logger.warn).toHaveBeenCalledWith(
      expect.stringMatching("Plugin 2 contains error")
    );
  });

  it("assign name to every loaded plugin", () => {
    const plugins = ["@lokse/plugin1", { name: "@lokse/plugin2", options: {} }];

    const { plugins: loadedPlugins } = loadPlugins(plugins, generalOptions);

    expect(loadedPlugins[0]).toHaveProperty("pluginName", "@lokse/plugin1");
    expect(loadedPlugins[1]).toHaveProperty("pluginName", "@lokse/plugin2");
  });
});
