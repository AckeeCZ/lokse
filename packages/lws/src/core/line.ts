const COMMENT_STARTERS = ["//", "#"];
const PLURAL_KEY_RE = /.+##\{(zero|one|two|few|many|other)\}/;
const PLURAL_POSTFIX_RE = /##\{(zero|one|two|few|many|other)\}/;

class Line {
  public _key: string;

  public _pluralKey: string;

  public _isComment: boolean;

  public _isPlural: boolean;

  public _value: string;

  constructor(key: string | null = "", value: string | null = "") {
    if (!key) {
      key = "";
    }
    key = key.toString();

    var isComment = Line.checkIsComment(key);

    if (isComment) {
      key = Line.normalizeComment(key);
    }

    var isPlural = Line.checkIsPlural(key);

    if (isPlural) {
      var keys = Line.parseKeysFromPlural(key);
      this._key = keys[0];
      this._pluralKey = keys[1];
    } else {
      this._key = key || "";
      this._pluralKey = "";
    }

    this._isComment = isComment;
    this._isPlural = isPlural;
    this._value = value || "";
  }

  static checkIsComment(val: any): boolean {
    for (var i = 0; i < COMMENT_STARTERS.length; i++) {
      var commentStarter = COMMENT_STARTERS[i];
      if (val.indexOf(commentStarter) == 0) {
        return true;
      }
    }
    return false;
  }

  static checkIsPlural = function (val: any): boolean {
    if (val.match(PLURAL_KEY_RE)) {
      return true;
    }
    return false;
  };

  static parseKeysFromPlural = function (val) {
    var match = val.match(PLURAL_POSTFIX_RE);
    if (match) {
      return [val.replace(match[0], ""), match[1]];
    }
    return [val, ""];
  };

  static normalizeComment(val) {
    for (var i = 0; i < COMMENT_STARTERS.length; i++) {
      var commentStarter = COMMENT_STARTERS[i];
      var index = val.indexOf(commentStarter);
      if (index == 0) {
        var normalized = val.substr(
          commentStarter.length,
          val.length - commentStarter.length
        );
        normalized = normalized.trim();
        return normalized;
      }
    }
    return val;
  }

  isEmpty() {
    return !this._isComment && !this._key;
  }

  isComment() {
    return this._isComment;
  }

  isPlural() {
    return this._isPlural;
  }

  getComment() {
    return this._key;
  }

  getKey() {
    return this._key;
  }

  getPluralKey() {
    return this._pluralKey;
  }

  getValue() {
    return this._value;
  }
}

export default Line;
