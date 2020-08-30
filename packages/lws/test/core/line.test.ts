import * as assert from "assert";
import Line from "../../src/core/line";

describe("Line.isComment", () => {
  it("is false when not comment", () => {
    const line = new Line("pas un commentaire", "une valeur");

    assert.equal(false, line.isComment());
  });
  it("is true when comment", () => {
    const line1 = new Line("// un commentaire");
    const line2 = new Line("# un commentaire");

    assert.equal(true, line1.isComment());
    assert.equal(true, line2.isComment());
  });
});

describe("Line.getComment", () => {
  it("removes comment starter", () => {
    const line1 = new Line("// un commentaire");
    const line2 = new Line("# un commentaire   ");

    assert.equal("un commentaire", line1.getComment());
    assert.equal("un commentaire", line2.getComment());
  });
});

describe("Line.isEmpty", () => {
  const line1 = new Line(null, null);

  assert.equal(true, line1.isEmpty());
  assert.equal(false, line1.isComment());
});
//exports.test_isEmptyWhenEmpty = function (test) {

describe("Line", () => {
  it("getting fields", () => {
    const line1 = new Line("key", "value");

    assert.equal("key", line1.getKey());
    assert.equal("value", line1.getValue());
    assert.equal(false, line1.isEmpty());
    assert.equal(false, line1.isComment());
  });
});
