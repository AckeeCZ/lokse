import * as assert from "assert";
import Line from "../../src/core/line";

describe("Line.isComment", () => {
  it("is false when not comment", () => {
    const line = new Line("pas un commentaire", "une valeur");

    assert.strictEqual(false, line.isComment());
  });
  it("is true when comment", () => {
    const line1 = new Line("// un commentaire", null);
    const line2 = new Line("# un commentaire", null);

    assert.strictEqual(true, line1.isComment());
    assert.strictEqual(true, line2.isComment());
  });
});

describe("Line.getComment", () => {
  it("removes comment starter", () => {
    const line1 = new Line("// un commentaire", null);
    const line2 = new Line("# un commentaire   ", null);

    assert.strictEqual("un commentaire", line1.getComment());
    assert.strictEqual("un commentaire", line2.getComment());
  });
});

describe("Line.isEmpty", () => {
  const line1 = new Line(null, null);

  assert.strictEqual(true, line1.isEmpty());
  assert.strictEqual(false, line1.isComment());
});
// exports.test_isEmptyWhenEmpty = function (test) {

describe("Line", () => {
  it("getting fields", () => {
    const line1 = new Line("key", "value");

    assert.strictEqual("key", line1.key);
    assert.strictEqual("value", line1.value);
    assert.strictEqual(false, line1.isEmpty());
    assert.strictEqual(false, line1.isComment());
  });
});
