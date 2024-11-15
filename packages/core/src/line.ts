const COMMENT_STARTERS = ['//', '#'];
const PLURAL_KEY_RE = /.+##{(zero|one|two|few|many|other)}/;
const PLURAL_POSTFIX_RE = /##{(zero|one|two|few|many|other)}/;

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
        key = key?.toString() ?? '';

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
            this.pluralKey = '';
        }

        this.value = value ?? '';
    }

    static checkIsComment(val: string): boolean {
        for (const commentStarter of COMMENT_STARTERS) {
            if (val.indexOf(commentStarter) === 0) {
                return true;
            }
        }

        return false;
    }

    static checkIsPlural = function (val: string): boolean {
        if (PLURAL_KEY_RE.test(val)) {
            return true;
        }

        return false;
    };

    static parseKeysFromPlural = function (val: string): [string, string] {
        const match = val.match(PLURAL_POSTFIX_RE);
        if (match) {
            return [val.replace(match[0], ''), match[1]];
        }

        return [val, ''];
    };

    static normalizeComment(val: string): string {
        for (const commentStarter of COMMENT_STARTERS) {
            const index = val.indexOf(commentStarter);

            if (index === 0) {
                const normalized = val.slice(commentStarter.length);

                return normalized.trim();
            }
        }

        return val;
    }

    isEmpty(): boolean {
        return !this.isComment() && !(this.key && this.value);
    }

    isComment(): boolean {
        return this.type === Type.COMMENT;
    }

    isPlural(): boolean {
        return this.type === Type.PLURAL;
    }

    getComment(): string {
        return this.key;
    }

    getPluralKey(): string {
        return this.pluralKey;
    }

    setKey(nextKey: string | ((key: string) => string)): void {
        this.key = typeof nextKey === 'function' ? nextKey(this.key) : nextKey;
    }

    setValue(nextValue: string | ((value: string) => string)): void {
        this.value = typeof nextValue === 'function' ? nextValue(this.value) : nextValue;
    }
}

export default Line;
