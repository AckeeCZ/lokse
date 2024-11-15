export interface Logger {
    log: (...args: any[]) => void;
    warn: (...args: any[]) => void;
}

export default console as Logger;
