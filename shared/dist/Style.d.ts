import type { Color } from './Color';
type Nullable<T> = {
    [K in keyof T]?: null | undefined | T[K];
};
export declare class Style {
    bold?: boolean;
    dim?: boolean;
    italic?: boolean;
    strikeout?: boolean;
    underline?: boolean;
    inverse?: boolean;
    blink?: boolean;
    invisible?: boolean;
    foreground?: Color;
    background?: Color;
    static NONE: Style;
    static underlined: Style;
    static bold: Style;
    constructor({ bold, dim, italic, strikeout, underline, inverse, blink, invisible, foreground, background, }?: {
        underline?: boolean;
        inverse?: boolean;
        bold?: boolean;
        dim?: boolean;
        italic?: boolean;
        strikeout?: boolean;
        blink?: boolean;
        invisible?: boolean;
        foreground?: Color;
        background?: Color;
    });
    invert(): Style;
    merge(style?: Nullable<Style>): Style;
    isEqual(style: Style): boolean;
    /**
     * @return a more easily debuggable object
     */
    toDebug(): any;
    static fromSGR(ansi: string, prevStyle: Style): Style;
    /**
     * @param prevStyle Used by the buffer to reset foreground/background colors and attrs
     * @param text If provided, the text will be "wrapped" in the new codes, and
     * `prevStyle` will be restored.
     */
    toSGR(prevStyle: Style, text?: string): string;
}
export {};
