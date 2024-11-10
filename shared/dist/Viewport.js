"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Viewport = void 0;
const sys_1 = require("./sys");
const ansi_1 = require("./ansi");
const Style_1 = require("./Style");
const geometry_1 = require("./geometry");
const util_1 = require("./util");
/**
 * Defines a region (contentSize) in which to draw, and a subset (visibleRect) that
 * is on-screen. Anything not in the visibleRect is considered invisible (and any
 * drawing outside the rect will be clipped)
 */
class Viewport {
    #terminal;
    #currentRender = null;
    #contentSize;
    #visibleRect;
    #offset;
    #screen;
    #style;
    /**
     * For modals, this offset points to the Rect of the view that presented the modal
     */
    parentRect;
    constructor(screen, terminal, contentSize) {
        const rect = new geometry_1.Rect(geometry_1.Point.zero, contentSize);
        this.#terminal = terminal;
        this.#screen = screen;
        this.#contentSize = contentSize;
        this.parentRect = rect;
        this.#visibleRect = rect;
        this.#offset = geometry_1.Point.zero;
        this.#style = Style_1.Style.NONE;
        // control visibility of props for inspect(viewport)
        (0, util_1.define)(this, 'contentSize', { enumerable: true });
        (0, util_1.define)(this, 'contentRect', { enumerable: true });
        (0, util_1.define)(this, 'visibleRect', { enumerable: true });
    }
    /**
     * during render, `contentSize` is what you should use for laying out your
     * rectangles. in most cases this is synonymous with "visible" area, but not
     * always.
     */
    get contentSize() {
        return this.#contentSize;
    }
    /*
     * `visibleRect` can be used to optimize drawing. `visibleRect.origin`
     * represents the first visible point, taking clipping into account.
     */
    get visibleRect() {
        return this.#visibleRect;
    }
    /*
     * `contentRect` is a convenience property, useful for creating clipped inner
     * regions. origin is always [0, 0] and size is contentSize.
     */
    get contentRect() {
        return new geometry_1.Rect(geometry_1.Point.zero, this.#contentSize);
    }
    get isEmpty() {
        return this.#contentSize.isEmpty;
    }
    /**
     * @return boolean Whether the modal creation was successful
     */
    requestModal(modal, onClose) {
        if (!this.#currentRender) {
            return false;
        }
        return this.#screen.requestModal(this.#currentRender, modal, onClose, new geometry_1.Rect(this.#offset, this.#contentSize));
    }
    registerHotKey(key) {
        if (!this.#currentRender) {
            return;
        }
        this.#screen.registerHotKey(this.#currentRender, key);
    }
    /**
     * @return boolean Whether the current render target is the focus view
     */
    registerFocus() {
        if (!this.#currentRender) {
            return false;
        }
        return this.#screen.registerFocus(this.#currentRender);
    }
    /**
     * @see MouseManager.registerMouse
     */
    registerMouse(eventNames, rect) {
        if (!this.#currentRender || this.#currentRender.screen !== this.#screen) {
            return;
        }
        if (rect) {
            rect = this.#visibleRect.intersection(rect);
        }
        else {
            rect = this.#visibleRect;
        }
        const maxX = rect.maxX();
        const maxY = rect.maxY();
        const events = typeof eventNames === 'string' ? [eventNames] : eventNames;
        for (let y = rect.minY(); y < maxY; ++y)
            for (let x = rect.minX(); x < maxX; ++x) {
                this.#screen.registerMouse(this.#currentRender, this.#offset, new geometry_1.Point(x, y), events);
            }
    }
    registerTick() {
        if (!this.#currentRender) {
            return;
        }
        this.#screen.registerTick(this.#currentRender);
    }
    /**
     * Clears out, and optionally "paints" default foreground/background colors. If no
     * region is provided, the entire visibleRect is painted.
     */
    paint(defaultStyle, region) {
        if (region instanceof geometry_1.Point) {
            this.write(' ', region, defaultStyle);
        }
        else {
            region ??= this.visibleRect;
            region.forEachPoint(pt => this.paint(defaultStyle, pt));
        }
    }
    /**
     * Does not support newlines (no default wrapping behavior),
     * always prints left-to-right.
     */
    write(input, to, style) {
        const minX = this.#visibleRect.minX(), maxX = this.#visibleRect.maxX(), minY = this.#visibleRect.minY(), maxY = this.#visibleRect.maxY();
        if (to.x >= maxX || to.y < minY || to.y >= maxY) {
            return;
        }
        style ??= this.#style;
        const startingStyle = style;
        let x = to.x, y = to.y;
        for (const char of sys_1.unicode.printableChars(input)) {
            if (char === '\n') {
                x = to.x;
                y += 1;
                if (y >= maxY) {
                    break;
                }
                continue;
            }
            if (x >= maxX) {
                continue;
            }
            const width = sys_1.unicode.charWidth(char);
            if (width === 0) {
                style =
                    char === ansi_1.RESET
                        ? startingStyle
                        : startingStyle.merge(Style_1.Style.fromSGR(char, startingStyle));
            }
            else if (x >= minX && x + width - 1 < maxX) {
                this.#terminal.writeChar(char, this.#offset.x + x, this.#offset.y + y, style);
                if (this.#currentRender &&
                    // if the currentRender wasn't added as a child to the screen's tree,
                    // we shouldn't perform this check
                    this.#currentRender.screen === this.#screen) {
                    this.#screen.checkMouse(this.#currentRender, this.#offset.x + x, this.#offset.y + y);
                }
            }
            x += width;
        }
    }
    /**
     * Forwards 'meta' ANSI sequences (see ITerm) to the terminal
     */
    writeMeta(str) {
        this.#terminal.writeMeta(str);
    }
    usingPen(...args) {
        const prevStyle = this.#style;
        const pen = new Pen(prevStyle, (style) => {
            this.#style = style ?? prevStyle;
        });
        if (args.length === 2) {
            if (args[0] && args[0] !== Style_1.Style.NONE) {
                pen.replacePen(args[0]);
            }
            args[1](pen);
        }
        else {
            args[0](pen);
        }
        this.#style = prevStyle;
    }
    _render(view, clip, draw) {
        const prevRender = this.#currentRender;
        this.#currentRender = view;
        this.clipped(clip, draw);
        this.#currentRender = prevRender;
    }
    clipped(...args) {
        let clip;
        let style;
        let draw;
        if (args.length === 3) {
            ;
            [clip, style, draw] = args;
        }
        else {
            ;
            [clip, draw] = args;
            style = this.#style;
        }
        const offsetX = this.#offset.x + clip.origin.x;
        const offsetY = this.#offset.y + clip.origin.y;
        const contentWidth = Math.max(0, clip.size.width);
        const contentHeight = Math.max(0, clip.size.height);
        // visibleRect.origin doesn't go negative - Math.max(0) prevents that.
        // The subtraction of clip.origin.x only has an effect when the clipped
        // origin is *negative*. In that case, the effect is that (0, 0) is outside the
        // visible space, and so visibleRect.origin represents the first visiblePoint
        // (in local coordinates). Basically - trust this math, it looks wrong, but I
        // double checked it.
        const visibleMinX = Math.max(0, this.#visibleRect.origin.x - clip.origin.x);
        const visibleMinY = Math.max(0, this.#visibleRect.origin.y - clip.origin.y);
        const visibleMaxX = Math.min(clip.size.width, this.#visibleRect.origin.x + this.#visibleRect.size.width - clip.origin.x);
        const visibleMaxY = Math.min(clip.size.height, this.#visibleRect.origin.y +
            this.#visibleRect.size.height -
            clip.origin.y);
        const contentSize = new geometry_1.Size(contentWidth, contentHeight);
        const visibleRect = new geometry_1.Rect(new geometry_1.Point(visibleMinX, visibleMinY), new geometry_1.Size(visibleMaxX - visibleMinX, visibleMaxY - visibleMinY));
        const offset = new geometry_1.Point(offsetX, offsetY);
        const prevContentSize = this.#contentSize;
        const prevVisibleRect = this.#visibleRect;
        const prevOffset = this.#offset;
        const prevStyle = this.#style;
        this.#contentSize = contentSize;
        this.#visibleRect = visibleRect;
        this.#offset = offset;
        this.#style = style;
        draw(this);
        this.#contentSize = prevContentSize;
        this.#visibleRect = prevVisibleRect;
        this.#offset = prevOffset;
        this.#style = prevStyle;
    }
}
exports.Viewport = Viewport;
class Pen {
    #setter;
    #initial;
    #stack;
    constructor(initialStyle, setter) {
        this.#setter = setter;
        this.#initial = initialStyle;
        this.#stack = [];
    }
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
    mergePen(style) {
        const current = this.#stack[0] ?? this.#initial;
        style = current.merge(style);
        this.replacePen(style);
    }
    /**
     * replacePen is better when you need to control the drawing style, but you will
     * assign the entire desired style.
     */
    replacePen(style) {
        this.#stack[0] = style;
        this.#setter(style);
    }
    pushPen(style = undefined) {
        style ??= this.#stack[0] ?? this.#initial;
        // yeah I know I said pushPen but #style[0] is easier!
        this.#stack.unshift(style);
        this.#setter(style);
    }
    popPen() {
        this.#setter(this.#stack.shift());
    }
}
//# sourceMappingURL=Viewport.js.map