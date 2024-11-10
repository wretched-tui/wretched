import type { Terminal, SGRTerminal } from './terminal';
import type { Color } from './Color';
import { Style } from './Style';
import { Size } from './geometry';
export declare class Buffer implements Terminal {
    #private;
    size: Size;
    setForeground(fg: Color): void;
    setBackground(bg: Color): void;
    resize(size: Size): void;
    /**
     * Writes the string at the cursor from left to write. Exits on newline (no default
     * wrapping behavior).
     */
    writeChar(char: string, x: number, y: number, style: Style): void;
    /**
     * For ANSI sequences that aren't related to any specific character.
     */
    writeMeta(str: string): void;
    flush(terminal: SGRTerminal): void;
}
