import type { Color } from './Color';
import { Style } from './Style';
export type Purpose = 'primary' | 'blue' | 'secondary' | 'orange' | 'proceed' | 'green' | 'cancel' | 'red' | 'selected' | 'plain';
interface Props {
    text?: Color;
    dimText?: Color;
    dimBackground?: Color;
    brightText?: Color;
    background: Color;
    textBackground?: Color;
    highlight: Color;
    darken: Color;
}
export declare class Theme {
    textColor: Color;
    brightTextColor: Color;
    dimTextColor: Color;
    dimBackgroundColor: Color;
    backgroundColor: Color;
    textBackgroundColor: Color;
    highlightColor: Color;
    darkenColor: Color;
    static plain: Theme;
    static primary: Theme;
    static secondary: Theme;
    static proceed: Theme;
    static cancel: Theme;
    static selected: Theme;
    static red: Theme;
    static green: Theme;
    static blue: Theme;
    static orange: Theme;
    constructor({ text, brightText, dimText, dimBackground, background, textBackground, highlight, darken, }: Props);
    /**
     * "Ornament" is meant to draw decorative characters that disappear on hover/press
     */
    ui({ isPressed, isHover, isOrnament, }?: {
        isPressed?: boolean;
        isHover?: boolean;
        isOrnament?: boolean;
    }): Style;
    /**
     * Creates a text style using the current theme.
     *
     * Not all combinations are supported:
     * - isSelected and isPlaceholder revert to just isPlaceholder
     */
    text({ isPressed, isHover, isSelected, isPlaceholder, hasFocus, }?: {
        isPressed?: boolean;
        isHover?: boolean;
        isSelected?: boolean;
        isPlaceholder?: boolean;
        hasFocus?: boolean;
    }): Style;
}
export {};
