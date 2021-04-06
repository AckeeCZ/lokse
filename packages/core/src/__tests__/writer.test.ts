import { EOL } from "os";
import FileWriter from "../writer";
import Line from "../line";
import { transformersByFormat } from "../transformer";
import { OutputFormat } from "../constants";

const androidTransformer = transformersByFormat[OutputFormat.ANDROID];
const iosTransformer = transformersByFormat[OutputFormat.IOS];

describe("Writer.getTransformedLines", () => {
  it("with android transformer should return xml", () => {
    const writer = new FileWriter();
    const result = writer.getTransformedLines(
      [
        new Line("key", "value"),
        new Line("// commentaire", null),
        new Line("key2", "value2"),
      ],
      androidTransformer
    );

    expect(result).toEqual(
      '    <string name="key">value</string>' +
        EOL +
        "    <!-- commentaire -->" +
        EOL +
        '    <string name="key2">value2</string>'
    );
  });

  it("with ios transformer should return in format", () => {
    const writer = new FileWriter();
    const result = writer.getTransformedLines(
      [
        new Line("key", "value"),
        new Line("# commentaire", null),
        new Line("key2", "value2"),
      ],
      iosTransformer
    );

    expect(result).toEqual(
      '"key" = "value";' + EOL + "// commentaire" + EOL + '"key2" = "value2";'
    );
  });
});
