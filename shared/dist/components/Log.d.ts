import { LogLine } from '../log';
import { Viewport } from '../Viewport';
import { type Props as ViewProps } from '../View';
import { Container } from '../Container';
export declare class Log extends Container {
    #private;
    constructor(props?: ViewProps);
    setLogs(logs: LogLine[]): void;
    appendLog(log: LogLine): void;
    clear(): void;
}
export declare class ConsoleLog extends Log {
    static default: ConsoleLog | undefined;
    constructor(props?: ViewProps);
    render(viewport: Viewport): void;
}
