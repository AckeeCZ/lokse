import { test } from "@oclif/test";
import * as open from "open";
import { exit } from "process";

jest.mock("open");

describe("open command", () => {
  test
    .stdout()
    .command(["open", "--id=this-is-fake-sheet-id"])
    .it("opens sheet in browser", () => {
      expect(open).toHaveBeenCalledWith(
        `https://docs.google.com/spreadsheets/d/this-is-fake-sheet-id`
      );
    });

  test
    .command(["open"])
    .catch((error) => {
      expect(error.message).toEqual(`💥 Sheet id is required for updating translations`);
    })
    .it("throws when id not provided");
});
