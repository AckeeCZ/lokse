import { cosmiconfigSync } from "cosmiconfig";
import { getConfig } from "../config";

jest.mock("cosmiconfig", () => {
  const mockExplorer = {
    search: jest.fn(),
  };

  return {
    cosmiconfigSync: jest.fn().mockReturnValue(mockExplorer),
  };
});

jest.mock("cosmiconfig-typescript-loader");

describe("getConfig", () => {
  const OLD_ENV = process.env;
  const searchMock = cosmiconfigSync("foo").search as jest.Mock;

  beforeEach(() => {
    searchMock.mockReset();
    // https://stackoverflow.com/a/48042799/7051731
    jest.resetModules();
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it("should return config loaded from cwd", () => {
    getConfig();

    expect(searchMock).toHaveBeenCalledTimes(1);
    expect(searchMock).toHaveBeenCalledWith(undefined);
  });

  it("should return config loaded from custom path provided via env variable", () => {
    process.env.LOKSE_CONFIG_PATH = "/path/from/variable";

    getConfig();

    expect(searchMock).toHaveBeenCalledTimes(1);
    expect(searchMock).toHaveBeenCalledWith("/path/from/variable");
  });

  it("should return config loaded from custom path provided via custom path", () => {
    getConfig("/custom/path");

    expect(searchMock).toHaveBeenCalledTimes(1);
    expect(searchMock).toHaveBeenCalledWith("/custom/path");
  });
});
