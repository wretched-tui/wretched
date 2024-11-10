declare const levels: readonly ["debug", "error", "info", "log", "warn"];
export type Level = (typeof levels)[number];
export type Listener = (level: Level, args: any[]) => void;
export interface LogLine {
    level: Level;
    args: any[];
}
export declare function interceptConsoleLog(logListener?: Listener): void;
export declare function decorateConsoleLog(): void;
export declare function fetchLogs(): LogLine[];
export declare function flushLogs(): void;
export {};
