import type { Terminal } from './terminal';
import { Style } from './Style';
import { Rect, Point, Size } from './geometry';
import { Screen } from './Screen';
import { View } from './View';
import type { HotKeyDef, MouseEventListenerName } from './events';
/**
 * Defines a region (contentSize) in which to draw, and a subset (visibleRect) that
 * is on-screen. Anything not in the visibleRect is considered invisible (and any
 * drawing outside the rect will be clipped)
 */
export declare class Viewport {
    #private;
    /**
     * For modals, this offset points to the Rect of the view that presented the modal
     */
    parentRect: Rect;
    constructor(screen: Screen, terminal: Terminal, contentSize: Size);
    /**
     * during render, `contentSize` is what you should use for laying out your
     * rectangles. in most cases this is synonymous with "visible" area, but not
     * always.
     */
    get contentSize(): Size;
    get visibleRect(): Rect;
    get contentRect(): Rect;
    get isEmpty(): boolean;
    /**
     * @return boolean Whether the modal creation was successful
     */
    requestModal(modal: View, onClose: () => void): boolean;
    registerHotKey(key: HotKeyDef): void;
    /**
     * @return boolean Whether the current render target is the focus view
     */
    registerFocus(): boolean;
    /**
     * @see MouseManager.registerMouse
     */
    registerMouse(eventNames: MouseEventListenerName | MouseEventListenerName[], rect?: Rect): void;
    registerTick(): void;
    /**
     * Clears out, and optionally "paints" default foreground/background colors. If no
     * region is provided, the entire visibleRect is painted.
     */
    paint(defaultStyle: Style, region?: Point | Rect): void;
    /**
     * Does not support newlines (no default wrapping behavior),
     * always prints left-to-right.
     */
    write(input: string, to: Point, style?: Style): void;
    /**
     * Forwards 'meta' ANSI sequences (see ITerm) to the terminal
     */
    writeMeta(str: string): void;
    usingPen(style: Style | undefined, draw: (pen: Pen) => void): void;
    usingPen(draw: (pen: Pen) => void): void;
    _render(view: View, clip: Rect, draw: (viewport: Viewport) => void): void;
    clipped(clip: Rect, draw: (viewport: Viewport) => void): void;
    clipped(clip: Rect, style: Style, draw: (viewport: Viewport) => void): void;
}
declare class Pen {
    #private;
    constructor(initialStyle: Style, setter: (style?: Style) => void);
    /**
     * Used in Text drawing components - the component usually defines a starting
     * style (`viewport.usingPen(style, pen => {})`), and as it prints characters
     * (`char of unicode.printableChars(line)`) it will detect 0-width SGR codes
     * (`unicode.charWidth(char) === 0`). These codes can be used to create a `Style`
     * object (`Style.fromSGR(char)`).
     *
     * SGR codes do support turn-on/turn-off, but this doesn't work well when, say, the
     * default style already has certain features turned on. For instance, if the
     * string specifies one region to be bold, but the entire Text component is meant
     * to be bold, the behaviour of "turn-off-bold" is actually incorrect here.
     *
     * This is why the `fromSGR` method accepts the default style - it can be compared
     * with the SGR state to determine what to do.
     */
    mergePen(style: Style): void;
    /**
     * replacePen is better when you need to control the drawing style, but you will
     * assign the entire desired style.
     */
    replacePen(style: Style): void;
    pushPen(style?: Style | undefined): void;
    popPen(): void;
}
export {};
