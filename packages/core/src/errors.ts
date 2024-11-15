export class FatalError extends Error {}

export class KeyColumnNotFound extends Error {
    public key: string;

    constructor(key: string, sheetTitle: string) {
        super(`Key column "${key}" not found in sheet ${sheetTitle}.`);

        this.name = 'KeyColumnNotFound';
        this.key = key;
    }
}

export class LangColumnNotFound extends Error {
    public lang: string;

    constructor(lang: string, sheetTitle: string) {
        super(`Language column "${lang}" not found in sheet ${sheetTitle}!`);

        this.name = 'LangColumnNotFound';
        this.lang = lang;
    }
}

export function getErrorMessage(error: unknown): string {
    return 'message' in (error as Error) ? (error as Error).message : 'Unrecognized error';
}
