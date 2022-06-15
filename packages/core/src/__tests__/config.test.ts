import { cosmiconfig } from "cosmiconfig";
import { when } from "jest-when";
import { getConfig } from "../config";

jest.mock("cosmiconfig", () => {
  const mockExplorer = {
    search: jest.fn(),
  };

  return {
    cosmiconfig: jest.fn().mockReturnValue(mockExplorer),
  };
});

jest.mock("cosmiconfig-ts-loader");

describe("getConfig", () => {
  const OLD_ENV = process.env;
  const searchMock = cosmiconfig("foo").search as jest.Mock;

  beforeEach(() => {
    searchMock.mockReset();
    searchMock.mockResolvedValue({});
    // https://stackoverflow.com/a/48042799/7051731
    jest.resetModules();
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it("should return config loaded from cwd", async () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    when(searchMock).calledWith(undefined).mockResolvedValue({ config: "cwd" });

    await expect(getConfig()).resolves.toEqual("cwd");

    expect(searchMock).toHaveBeenCalledTimes(1);
    expect(searchMock).toHaveBeenCalledWith(undefined);
  });

  it("should return config loaded from custom path provided via env variable", async () => {
    process.env.LOKSE_CONFIG_PATH = "/path/from/variable";

    when(searchMock)
      .calledWith(process.env.LOKSE_CONFIG_PATH)
      .mockResolvedValue({ config: "from variable" });

    await expect(getConfig()).resolves.toEqual("from variable");

    expect(searchMock).toHaveBeenCalledTimes(1);
    expect(searchMock).toHaveBeenCalledWith("/path/from/variable");
  });

  it("should return config loaded from custom path provided via custom path", async () => {
    when(searchMock)
      .calledWith("/custom/path")
      .mockResolvedValue({ config: "custom" });

    await expect(getConfig("/custom/path")).resolves.toEqual("custom");

    expect(searchMock).toHaveBeenCalledTimes(1);
    expect(searchMock).toHaveBeenCalledWith("/custom/path");
  });
});
