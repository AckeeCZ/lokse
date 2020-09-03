import * as assert from "assert";
import { EOL } from "os";
import { FileWriter } from "../../src/core/writer";
import Line from "../../src/core/line";
import { transformersByFormat } from "../../src/core/transformer";
import { OutputFormat } from "../../src/constants";
const androidTransformer = transformersByFormat[OutputFormat.ANDROID];
const iosTransformer = transformersByFormat[OutputFormat.IOS];

describe("Writer.getTransformedLines", () => {
  it("with android transformer should return xml", () => {
    const writer = new FileWriter();
    const result = writer.getTransformedLines(
      [
        new Line("key", "value"),
        new Line("// commentaire"),
        new Line("key2", "value2"),
      ],
      androidTransformer
    );

    assert.strictEqual(
      '    <string name="key">value</string>' +
        EOL +
        "    <!-- commentaire -->" +
        EOL +
        '    <string name="key2">value2</string>',
      result
    );
  });

  it("with ios transformer should return in format", () => {
    const writer = new FileWriter();
    const result = writer.getTransformedLines(
      [
        new Line("key", "value"),
        new Line("# commentaire"),
        new Line("key2", "value2"),
      ],
      iosTransformer
    );

    assert.strictEqual(
      '"key" = "value";' + EOL + "// commentaire" + EOL + '"key2" = "value2";',
      result
    );
  });
});
