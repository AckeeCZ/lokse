import { identity } from "lodash";

import { createPlugin } from "../create";

describe("createPlugin", () => {
  it("should fulfill missing plugin hooks", () => {
    const plugin = createPlugin({
      transformFullOutput: (arg: string) => arg,
    });

    expect(plugin.transformLine).toEqual(identity);
    expect(plugin.transformFullOutput).not.toEqual(identity);
  });
});
