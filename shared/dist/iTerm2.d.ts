import type { BlessedProgram } from './sys';
import type { Color } from './Color';
/**
 * Sets iTerm2 proprietary ANSI codes
 */
export declare class iTerm2 {
    static _restoreBg: string | undefined;
    /**
     * Returns a promise in case you really want to do flow control here, but it's not
     * necessary; you can fire and forget this as part of `Screen.start()`
     *
     * @example
     * Screen.start(async (program) => {
     *   await iTerm2.setBackground(program, [23, 23, 23])
     *   return new Box({ … })
     * })
     */
    static setBackground(program: BlessedProgram, bg: Color): Promise<void>;
    static restoreBg(program: BlessedProgram): void;
}
