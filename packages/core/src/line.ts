/* eslint-disable unicorn/filename-case */
const COMMENT_STARTERS = ["//", "#"];
const PLURAL_KEY_RE = /.+##\{(zero|one|two|few|many|other)\}/;
const PLURAL_POSTFIX_RE = /##\{(zero|one|two|few|many|other)\}/;

enum Type {
  COMMENT,
  PLURAL,
  TEXT,
}

class Line {
  public key: string;

  private pluralKey: string;

  private type: Type;

  public value: string;

  constructor(key: string | null, value: string | null) {
    key = key?.toString() ?? "";

    if (Line.checkIsComment(key)) {
      this.type = Type.COMMENT;
    } else if (Line.checkIsPlural(key)) {
      this.type = Type.PLURAL;
    } else {
      this.type = Type.TEXT;
    }

    if (this.isComment()) {
      key = Line.normalizeComment(key);
    }

    if (this.isPlural()) {
      const keys = Line.parseKeysFromPlural(key);
      this.key = keys[0];
      this.pluralKey = keys[1];
    } else {
      this.key = key;
      this.pluralKey = "";
    }

    this.value = value ?? "";
  }

  static checkIsComment(val: any): boolean {
    for (const commentStarter of COMMENT_STARTERS) {
      if (val.indexOf(commentStarter) === 0) {
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

  static parseKeysFromPlural = function (val: string) {
    const match = val.match(PLURAL_POSTFIX_RE);
    if (match) {
      return [val.replace(match[0], ""), match[1]];
    }
    return [val, ""];
  };

  static normalizeComment(val: string) {
    for (const commentStarter of COMMENT_STARTERS) {
      const index = val.indexOf(commentStarter);

      if (index === 0) {
        const normalized = val.substr(
          commentStarter.length,
          val.length - commentStarter.length
        );

        return normalized.trim();
      }
    }
    return val;
  }

  isEmpty() {
    return !this.isComment() && !(this.key && this.value);
  }

  isComment() {
    return this.type === Type.COMMENT;
  }

  isPlural() {
    return this.type === Type.PLURAL;
  }

  getComment() {
    return this.key;
  }

  getPluralKey() {
    return this.pluralKey;
  }
}

export default Line;
