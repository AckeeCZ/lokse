var COMMENT_STARTERS = ['//', '#'];
var PLURAL_KEY_RE = /.+##\{(zero|one|two|few|many|other)\}/;
var PLURAL_POSTFIX_RE = /##\{(zero|one|two|few|many|other)\}/;

var Line = function (key, value) {
    if (!key) {
        key = '';
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
        this._key = key || '';
        this._pluralKey = '';
    }

    this._isComment = isComment;
    this._isPlural = isPlural;
    this._value = value || '';

}

Line.checkIsComment = function (val) {
    for (var i = 0; i < COMMENT_STARTERS.length; i++) {
        var commentStarter = COMMENT_STARTERS[i];
        if (val.indexOf(commentStarter) == 0) {
            return true;
        }
    }
    return false;
};

Line.checkIsPlural = function(val) {
    if (val.match(PLURAL_KEY_RE)) {
        return true;
    }
    return false;
};

Line.parseKeysFromPlural = function(val) {
    var match = val.match(PLURAL_POSTFIX_RE);
    if (match) {
        return [val.replace(match[0], ''), match[1]];
    }
    return [val, ''];
};

Line.normalizeComment = function (val) {
    for (var i = 0; i < COMMENT_STARTERS.length; i++) {
        var commentStarter = COMMENT_STARTERS[i];
        var index = val.indexOf(commentStarter);
        if (index == 0) {
            var normalized = val.substr(commentStarter.length, val.length - commentStarter.length);
            normalized = normalized.trim();
            return normalized;
        }
    }
    return val;
};

Line.prototype.isEmpty = function () {
    return !this._isComment && !this._key;
};

Line.prototype.isComment = function () {
    return this._isComment;
};

Line.prototype.isPlural = function() {
    return this._isPlural;
};

Line.prototype.getComment = function () {
    return this._key;
};

Line.prototype.getKey = function () {
    return this._key;
};

Line.prototype.getPluralKey = function() {
    return this._pluralKey;
};

Line.prototype.getValue = function () {
    return this._value;
};

module.exports = Line;