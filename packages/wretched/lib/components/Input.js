"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Input_instances, _Input_placeholder, _Input_printableLines, _Input_text, _Input_chars, _Input_wrappedLines, _Input_wrap, _Input_multiline, _Input_font, _Input_onChange, _Input_onSubmit, _Input_maxLineWidth, _Input_cursor, _Input_visibleWidth, _Input_update, _Input_updatePlaceholderLines, _Input_updateLines, _Input_toPosition, _Input_toOffset, _Input_cursorPosition, _Input_receiveKeyAccent, _Input_receiveKeyPrintable, _Input_receiveChar, _Input_receiveGotoStart, _Input_receiveGotoEnd, _Input_receiveHome, _Input_receiveEnd, _Input_receiveKeyUpArrow, _Input_receiveKeyDownArrow, _Input_prevWordOffset, _Input_nextWordOffset, _Input_receiveKeyLeftArrow, _Input_receiveKeyRightArrow, _Input_updateWidth, _Input_deleteSelection, _Input_receiveKeyBackspace, _Input_receiveKeyDelete, _Input_receiveKeyDeleteWord;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
var sys_1 = require("../sys");
var events_1 = require("../events");
var View_1 = require("../View");
var Style_1 = require("../Style");
var geometry_1 = require("../geometry");
var fonts_1 = require("./fonts");
var NL_SIGIL = '⤦';
/**
 * Text input. Supports selection, word movement via alt+←→, single and multiline
 * input, and wrapped lines.
 */
var Input = /** @class */ (function (_super) {
    __extends(Input, _super);
    function Input(props) {
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _Input_instances.add(_this);
        /**
         * Array of graphemes, with pre-calculated length
         */
        _Input_placeholder.set(_this, []);
        _Input_printableLines.set(_this, []
        /**
         * Cached after assignment - this is converted to #chars and #lines
         */
        );
        /**
         * Cached after assignment - this is converted to #chars and #lines
         */
        _Input_text.set(_this, ''
        /**
         * For easy edit operations. Gets converted to #lines for printing.
         */
        );
        /**
         * For easy edit operations. Gets converted to #lines for printing.
         */
        _Input_chars.set(_this, []);
        _Input_wrappedLines.set(_this, []
        // formatting options
        );
        // formatting options
        _Input_wrap.set(_this, false);
        _Input_multiline.set(_this, false);
        _Input_font.set(_this, 'default');
        _Input_onChange.set(_this, void 0);
        _Input_onSubmit.set(_this, void 0);
        // Printable width
        _Input_maxLineWidth.set(_this, 0);
        _Input_cursor.set(_this, { start: 0, end: 0 });
        _Input_visibleWidth.set(_this, 0);
        __classPrivateFieldGet(_this, _Input_instances, "m", _Input_update).call(_this, props);
        __classPrivateFieldSet(_this, _Input_cursor, { start: __classPrivateFieldGet(_this, _Input_chars, "f").length, end: __classPrivateFieldGet(_this, _Input_chars, "f").length }, "f");
        return _this;
    }
    Input.prototype.update = function (props) {
        __classPrivateFieldGet(this, _Input_instances, "m", _Input_update).call(this, props);
        _super.prototype.update.call(this, props);
    };
    Object.defineProperty(Input.prototype, "text", {
        get: function () {
            return __classPrivateFieldGet(this, _Input_text, "f");
        },
        set: function (text) {
            if (text !== __classPrivateFieldGet(this, _Input_text, "f")) {
                __classPrivateFieldGet(this, _Input_instances, "m", _Input_updateLines).call(this, sys_1.unicode.printableChars(text), undefined);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Input.prototype, "placeholder", {
        get: function () {
            return __classPrivateFieldGet(this, _Input_placeholder, "f").map(function (_a) {
                var chars = _a[0];
                return chars.join('');
            }).join('\n');
        },
        set: function (placeholder) {
            __classPrivateFieldGet(this, _Input_instances, "m", _Input_updatePlaceholderLines).call(this, placeholder !== null && placeholder !== void 0 ? placeholder : '');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Input.prototype, "font", {
        get: function () {
            return __classPrivateFieldGet(this, _Input_font, "f");
        },
        set: function (font) {
            if (font !== __classPrivateFieldGet(this, _Input_font, "f")) {
                __classPrivateFieldGet(this, _Input_instances, "m", _Input_updateLines).call(this, undefined, font);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Input.prototype, "wrap", {
        get: function () {
            return __classPrivateFieldGet(this, _Input_wrap, "f");
        },
        set: function (wrap) {
            if (wrap !== __classPrivateFieldGet(this, _Input_wrap, "f")) {
                __classPrivateFieldSet(this, _Input_wrap, wrap, "f");
                __classPrivateFieldGet(this, _Input_instances, "m", _Input_updateLines).call(this, undefined, undefined);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Input.prototype, "multiline", {
        get: function () {
            return __classPrivateFieldGet(this, _Input_multiline, "f");
        },
        set: function (multiline) {
            if (multiline !== __classPrivateFieldGet(this, _Input_multiline, "f")) {
                __classPrivateFieldSet(this, _Input_multiline, multiline, "f");
                __classPrivateFieldGet(this, _Input_instances, "m", _Input_updateLines).call(this, undefined, undefined);
            }
        },
        enumerable: false,
        configurable: true
    });
    Input.prototype.naturalSize = function (available) {
        var lines = __classPrivateFieldGet(this, _Input_printableLines, "f");
        if (!lines.length || !available.width) {
            return geometry_1.Size.one;
        }
        var height = 0;
        if (__classPrivateFieldGet(this, _Input_wrap, "f")) {
            for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                var _a = lines_1[_i], width = _a[1];
                // width + 1 because there should always be room for the cursor to be _after_
                // the last character.
                height += Math.ceil((width + 1) / available.width);
            }
        }
        else {
            height = lines.length;
        }
        return new geometry_1.Size(__classPrivateFieldGet(this, _Input_maxLineWidth, "f"), height);
    };
    Input.prototype.minSelected = function () {
        return Math.min(__classPrivateFieldGet(this, _Input_cursor, "f").start, __classPrivateFieldGet(this, _Input_cursor, "f").end);
    };
    Input.prototype.maxSelected = function () {
        return isEmptySelection(__classPrivateFieldGet(this, _Input_cursor, "f"))
            ? __classPrivateFieldGet(this, _Input_cursor, "f").start + 1
            : Math.max(__classPrivateFieldGet(this, _Input_cursor, "f").start, __classPrivateFieldGet(this, _Input_cursor, "f").end);
    };
    Input.prototype.receiveKey = function (event) {
        var _a, _b;
        var prevChars = __classPrivateFieldGet(this, _Input_chars, "f");
        var prevText = __classPrivateFieldGet(this, _Input_text, "f");
        var removeAccent = true;
        if (event.name === 'enter' || event.name === 'return') {
            if (__classPrivateFieldGet(this, _Input_multiline, "f")) {
                __classPrivateFieldGet(this, _Input_instances, "m", _Input_receiveChar).call(this, '\n', true);
            }
            else {
                (_a = __classPrivateFieldGet(this, _Input_onSubmit, "f")) === null || _a === void 0 ? void 0 : _a.call(this, __classPrivateFieldGet(this, _Input_text, "f"));
                return;
            }
        }
        else if (event.full === 'C-a') {
            __classPrivateFieldGet(this, _Input_instances, "m", _Input_receiveGotoStart).call(this);
        }
        else if (event.full === 'C-e') {
            __classPrivateFieldGet(this, _Input_instances, "m", _Input_receiveGotoEnd).call(this);
        }
        else if (event.name === 'up') {
            __classPrivateFieldGet(this, _Input_instances, "m", _Input_receiveKeyUpArrow).call(this, event);
        }
        else if (event.name === 'down') {
            __classPrivateFieldGet(this, _Input_instances, "m", _Input_receiveKeyDownArrow).call(this, event);
        }
        else if (event.name === 'home') {
            __classPrivateFieldGet(this, _Input_instances, "m", _Input_receiveHome).call(this, event);
        }
        else if (event.name === 'end') {
            __classPrivateFieldGet(this, _Input_instances, "m", _Input_receiveEnd).call(this, event);
        }
        else if (event.name === 'left') {
            __classPrivateFieldGet(this, _Input_instances, "m", _Input_receiveKeyLeftArrow).call(this, event);
        }
        else if (event.name === 'right') {
            __classPrivateFieldGet(this, _Input_instances, "m", _Input_receiveKeyRightArrow).call(this, event);
        }
        else if (event.full === 'backspace') {
            __classPrivateFieldGet(this, _Input_instances, "m", _Input_receiveKeyBackspace).call(this);
        }
        else if (event.name === 'delete') {
            __classPrivateFieldGet(this, _Input_instances, "m", _Input_receiveKeyDelete).call(this);
        }
        else if (event.full === 'M-backspace' || event.full === 'C-w') {
            __classPrivateFieldGet(this, _Input_instances, "m", _Input_receiveKeyDeleteWord).call(this);
        }
        else if (isKeyAccent(event)) {
            __classPrivateFieldGet(this, _Input_instances, "m", _Input_receiveKeyAccent).call(this, event);
            removeAccent = false;
        }
        else if ((0, events_1.isKeyPrintable)(event)) {
            __classPrivateFieldGet(this, _Input_instances, "m", _Input_receiveKeyPrintable).call(this, event);
        }
        if (removeAccent) {
            __classPrivateFieldSet(this, _Input_chars, __classPrivateFieldGet(this, _Input_chars, "f").filter(function (char) { return !isAccentChar(char); }), "f");
        }
        if (prevChars !== __classPrivateFieldGet(this, _Input_chars, "f")) {
            __classPrivateFieldGet(this, _Input_instances, "m", _Input_updateLines).call(this, __classPrivateFieldGet(this, _Input_chars, "f"), undefined);
        }
        if (prevText !== __classPrivateFieldGet(this, _Input_text, "f")) {
            (_b = __classPrivateFieldGet(this, _Input_onChange, "f")) === null || _b === void 0 ? void 0 : _b.call(this, __classPrivateFieldGet(this, _Input_text, "f"));
        }
    };
    Input.prototype.receiveMouse = function (event, system) {
        if (event.name === 'mouse.button.down') {
            system.requestFocus();
        }
    };
    Input.prototype.render = function (viewport) {
        var _this = this;
        var hasFocus = viewport.registerFocus();
        if (viewport.isEmpty) {
            return;
        }
        var visibleSize = viewport.contentSize;
        if (hasFocus) {
            viewport.registerTick();
        }
        viewport.registerMouse('mouse.button.left');
        // cursorEnd: the location of the cursor relative to the text
        // (ie if the text had been drawn at 0,0, cursorEnd is the screen location of
        // the cursor)
        // cursorPosition: the location of the cursor relative to the viewport
        var _a = __classPrivateFieldGet(this, _Input_instances, "m", _Input_cursorPosition).call(this, visibleSize), cursorEnd = _a[0], cursorPosition = _a[1];
        var cursorMin = __classPrivateFieldGet(this, _Input_instances, "m", _Input_toPosition).call(this, this.minSelected(), visibleSize.width);
        var cursorMax = __classPrivateFieldGet(this, _Input_instances, "m", _Input_toPosition).call(this, this.maxSelected(), visibleSize.width);
        // cursorVisible: the text location of the first line & char to draw
        var cursorVisible = new geometry_1.Point(cursorEnd.x - cursorPosition.x, cursorEnd.y - cursorPosition.y);
        var lines = __classPrivateFieldGet(this, _Input_printableLines, "f");
        if (visibleSize.width !== __classPrivateFieldGet(this, _Input_visibleWidth, "f") ||
            __classPrivateFieldGet(this, _Input_wrappedLines, "f").length === 0) {
            if (__classPrivateFieldGet(this, _Input_wrap, "f")) {
                lines = lines.flatMap(function (line) {
                    var wrappedLines = [];
                    var currentLine = [];
                    var currentWidth = 0;
                    for (var _i = 0, _a = line[0]; _i < _a.length; _i++) {
                        var char = _a[_i];
                        var charWidth = sys_1.unicode.charWidth(char);
                        currentLine.push(char);
                        currentWidth += charWidth;
                        if (currentWidth >= visibleSize.width) {
                            wrappedLines.push([currentLine, currentWidth]);
                            currentLine = [];
                            currentWidth = 0;
                        }
                    }
                    if (currentLine.length) {
                        wrappedLines.push([currentLine, currentWidth]);
                    }
                    return wrappedLines;
                });
            }
            __classPrivateFieldSet(this, _Input_wrappedLines, lines, "f");
            __classPrivateFieldSet(this, _Input_visibleWidth, visibleSize.width, "f");
        }
        else {
            lines = __classPrivateFieldGet(this, _Input_wrappedLines, "f");
        }
        var isPlaceholder = !Boolean(__classPrivateFieldGet(this, _Input_chars, "f").length);
        var currentStyle = Style_1.Style.NONE;
        var plainStyle = this.theme.text({
            isPlaceholder: isPlaceholder,
            hasFocus: hasFocus,
        });
        var selectedStyle = this.theme.text({
            isSelected: true,
            hasFocus: hasFocus,
        });
        var cursorStyle = plainStyle.merge({ underline: true });
        var nlStyle = this.theme.text({ isPlaceholder: true });
        var fontMap = __classPrivateFieldGet(this, _Input_font, "f") && fonts_1.FONTS[__classPrivateFieldGet(this, _Input_font, "f")];
        viewport.usingPen(function (pen) {
            var _a;
            var style = plainStyle;
            var visibleLines = lines.slice(cursorVisible.y);
            if (visibleLines.length === 0) {
                visibleLines.push([[' '], 0]);
            }
            // is the viewport tall/wide enough to show ellipses …
            var isTallEnough = viewport.contentSize.height > 4;
            var isWideEnough = viewport.contentSize.width > 9;
            // do we need to show vertical ellipses
            var isTooTall = visibleLines.length > visibleSize.height;
            // firstPoint is top-left corner of the viewport
            var firstPoint = new geometry_1.Point(0, cursorVisible.y);
            // lastPoint is bottom-right corner of the viewport
            var lastPoint = new geometry_1.Point(visibleSize.width + cursorVisible.x - 1, cursorVisible.y + visibleSize.height - 1);
            var scanTextPosition = firstPoint.mutableCopy();
            for (var _i = 0, visibleLines_1 = visibleLines; _i < visibleLines_1.length; _i++) {
                var _b = visibleLines_1[_i], line = _b[0], width = _b[1];
                // used to determine whether to draw a final …
                var isTooWide = __classPrivateFieldGet(_this, _Input_wrap, "f")
                    ? false
                    : width - cursorVisible.x > viewport.contentSize.width;
                // set to true if any character is skipped
                var drawInitialEllipses = false;
                scanTextPosition.x = 0;
                for (var _c = 0, line_1 = line; _c < line_1.length; _c++) {
                    var char = line_1[_c];
                    char = (_a = fontMap === null || fontMap === void 0 ? void 0 : fontMap.get(char)) !== null && _a !== void 0 ? _a : char;
                    var charWidth = sys_1.unicode.charWidth(char);
                    if (scanTextPosition.x >= cursorVisible.x) {
                        var inSelection = isInSelection(cursorMin, cursorMax, scanTextPosition);
                        var inCursor = scanTextPosition.x === cursorEnd.x &&
                            scanTextPosition.y === cursorEnd.y;
                        var inNewline = char === NL_SIGIL && scanTextPosition.x + charWidth === width;
                        if (isEmptySelection(__classPrivateFieldGet(_this, _Input_cursor, "f"))) {
                            if (isAccentChar(char)) {
                                style = plainStyle.merge({ underline: true, inverse: true });
                            }
                            else if (hasFocus && inCursor) {
                                style = inNewline
                                    ? nlStyle.merge({ underline: true })
                                    : cursorStyle;
                            }
                            else if (inNewline) {
                                style = nlStyle;
                            }
                            else {
                                style = plainStyle;
                            }
                        }
                        else {
                            if (inSelection) {
                                style = inNewline
                                    ? nlStyle.merge({ background: selectedStyle.foreground })
                                    : selectedStyle.merge({ underline: inCursor });
                            }
                            else if (inNewline) {
                                style = nlStyle;
                            }
                            else {
                                style = plainStyle;
                            }
                        }
                        if (!currentStyle.isEqual(style)) {
                            pen.replacePen(style);
                            currentStyle = style;
                        }
                        var drawEllipses = false;
                        if (cursorVisible.y > 0 && scanTextPosition.isEqual(firstPoint)) {
                            drawEllipses = isTallEnough;
                        }
                        else if (isTooTall && scanTextPosition.isEqual(lastPoint)) {
                            drawEllipses = isTallEnough;
                        }
                        else if (isWideEnough) {
                            if (drawInitialEllipses) {
                                drawEllipses = true;
                            }
                            else if (isTooWide &&
                                scanTextPosition.x - cursorVisible.x + charWidth >=
                                    viewport.contentSize.width) {
                                drawEllipses = true;
                            }
                        }
                        viewport.write(drawEllipses ? '…' : char, scanTextPosition.offset(-cursorVisible.x, -cursorVisible.y));
                        drawInitialEllipses = false;
                    }
                    else {
                        drawInitialEllipses = true;
                    }
                    scanTextPosition.x += charWidth;
                    if (scanTextPosition.x - cursorVisible.x >=
                        viewport.contentSize.width) {
                        break;
                    }
                }
                scanTextPosition.y += 1;
                if (scanTextPosition.y - cursorVisible.y >=
                    viewport.contentSize.height) {
                    break;
                }
            }
        });
    };
    return Input;
}(View_1.View));
exports.Input = Input;
_Input_placeholder = new WeakMap(), _Input_printableLines = new WeakMap(), _Input_text = new WeakMap(), _Input_chars = new WeakMap(), _Input_wrappedLines = new WeakMap(), _Input_wrap = new WeakMap(), _Input_multiline = new WeakMap(), _Input_font = new WeakMap(), _Input_onChange = new WeakMap(), _Input_onSubmit = new WeakMap(), _Input_maxLineWidth = new WeakMap(), _Input_cursor = new WeakMap(), _Input_visibleWidth = new WeakMap(), _Input_instances = new WeakSet(), _Input_update = function _Input_update(_a) {
    var text = _a.text, wrap = _a.wrap, multiline = _a.multiline, font = _a.font, placeholder = _a.placeholder, onChange = _a.onChange, onSubmit = _a.onSubmit;
    __classPrivateFieldSet(this, _Input_onChange, onChange, "f");
    __classPrivateFieldSet(this, _Input_onSubmit, onSubmit, "f");
    __classPrivateFieldSet(this, _Input_wrap, wrap !== null && wrap !== void 0 ? wrap : false, "f");
    __classPrivateFieldSet(this, _Input_multiline, multiline !== null && multiline !== void 0 ? multiline : false, "f");
    __classPrivateFieldGet(this, _Input_instances, "m", _Input_updatePlaceholderLines).call(this, placeholder !== null && placeholder !== void 0 ? placeholder : '');
    __classPrivateFieldGet(this, _Input_instances, "m", _Input_updateLines).call(this, sys_1.unicode.printableChars(text !== null && text !== void 0 ? text : ''), font !== null && font !== void 0 ? font : 'default');
}, _Input_updatePlaceholderLines = function _Input_updatePlaceholderLines(placeholder) {
    var placeholderLines = placeholder === ''
        ? []
        : placeholder.split('\n').map(function (line) { return sys_1.unicode.printableChars(line); });
    __classPrivateFieldSet(this, _Input_placeholder, placeholderLines.map(function (line) { return [
        line,
        line.reduce(function (w, c) { return w + sys_1.unicode.charWidth(c); }, 0),
    ]; }), "f");
}, _Input_updateLines = function _Input_updateLines(_chars, font) {
    var _this = this;
    var chars = _chars !== null && _chars !== void 0 ? _chars : __classPrivateFieldGet(this, _Input_chars, "f");
    if (font === undefined) {
        font = __classPrivateFieldGet(this, _Input_font, "f");
    }
    else {
        __classPrivateFieldSet(this, _Input_font, font, "f");
    }
    var startIsAtEnd = __classPrivateFieldGet(this, _Input_cursor, "f").start === __classPrivateFieldGet(this, _Input_chars, "f").length;
    var endIsAtEnd = __classPrivateFieldGet(this, _Input_cursor, "f").end === __classPrivateFieldGet(this, _Input_chars, "f").length;
    if (chars.length > 0) {
        if (!__classPrivateFieldGet(this, _Input_multiline, "f")) {
            chars = chars.map(function (char) { return (char === '\n' ? ' ' : char); });
        }
        __classPrivateFieldSet(this, _Input_text, chars.filter(function (char) { return !isAccentChar(char); }).join(''), "f");
        __classPrivateFieldSet(this, _Input_chars, chars, "f");
        var charLines = __classPrivateFieldGet(this, _Input_chars, "f").reduce(function (_a, char, index) {
            var lines = _a[0], line = _a[1];
            if (char === '\n') {
                lines.push(line);
                if (index === __classPrivateFieldGet(_this, _Input_chars, "f").length - 1) {
                    lines.push([]);
                }
                return [lines, []];
            }
            line.push(char);
            if (index === __classPrivateFieldGet(_this, _Input_chars, "f").length - 1) {
                lines.push(line);
                return [lines, []];
            }
            return [lines, line];
        }, [[], []])[0];
        __classPrivateFieldSet(this, _Input_printableLines, charLines.map(function (printableLine, index, all) {
            // every line needs a ' ' or NL_SIGIL at the end, for the EOL cursor
            return [
                printableLine.concat(index === all.length - 1 ? ' ' : NL_SIGIL),
                printableLine.reduce(function (width, char) { return width + sys_1.unicode.charWidth(char); }, 0) + 1,
            ];
        }), "f");
    }
    else {
        __classPrivateFieldSet(this, _Input_text, '', "f");
        __classPrivateFieldSet(this, _Input_printableLines, __classPrivateFieldGet(this, _Input_placeholder, "f").map(function (_a) {
            var line = _a[0], width = _a[1];
            return [line.concat(' '), width];
        }), "f");
    }
    __classPrivateFieldSet(this, _Input_visibleWidth, 0, "f");
    if (endIsAtEnd) {
        __classPrivateFieldGet(this, _Input_cursor, "f").end = __classPrivateFieldGet(this, _Input_chars, "f").length;
    }
    else {
        __classPrivateFieldGet(this, _Input_cursor, "f").end = Math.min(__classPrivateFieldGet(this, _Input_cursor, "f").end, __classPrivateFieldGet(this, _Input_chars, "f").length);
    }
    if (startIsAtEnd) {
        __classPrivateFieldGet(this, _Input_cursor, "f").start = __classPrivateFieldGet(this, _Input_chars, "f").length;
    }
    else {
        __classPrivateFieldGet(this, _Input_cursor, "f").start = Math.min(__classPrivateFieldGet(this, _Input_cursor, "f").start, __classPrivateFieldGet(this, _Input_chars, "f").length);
    }
    __classPrivateFieldSet(this, _Input_maxLineWidth, __classPrivateFieldGet(this, _Input_printableLines, "f").reduce(function (maxWidth, _a) {
        var width = _a[1];
        // the _printable_ width, not the number of characters
        return Math.max(maxWidth, width);
    }, 0), "f");
    this.invalidateSize();
}, _Input_toPosition = function _Input_toPosition(offset, visibleWidth) {
    if (__classPrivateFieldGet(this, _Input_wrap, "f")) {
        var y_1 = 0, index_1 = 0;
        var x = 0;
        // immediately after a line wrap, we don't want to also increase y by 1
        var isFirst = true;
        for (var _i = 0, _a = __classPrivateFieldGet(this, _Input_printableLines, "f"); _i < _a.length; _i++) {
            var chars = _a[_i][0];
            if (!isFirst) {
                y_1 += 1;
            }
            isFirst = false;
            x = 0;
            for (var _b = 0, chars_1 = chars; _b < chars_1.length; _b++) {
                var char = chars_1[_b];
                if (index_1 === offset) {
                    if (x === visibleWidth) {
                        x = 0;
                        y_1 += 1;
                    }
                    return new geometry_1.Point(x, y_1);
                }
                var charWidth = sys_1.unicode.charWidth(char);
                if (x + charWidth > visibleWidth) {
                    x = charWidth;
                    y_1 += 1;
                }
                else {
                    x += charWidth;
                }
                index_1 += 1;
            }
        }
        return new geometry_1.Point(x, y_1);
    }
    var y = 0, index = 0;
    for (var _c = 0, _d = __classPrivateFieldGet(this, _Input_printableLines, "f"); _c < _d.length; _c++) {
        var chars = _d[_c][0];
        if (index + chars.length > offset) {
            var x = 0;
            for (var _e = 0, _f = chars.slice(0, offset - index); _e < _f.length; _e++) {
                var char = _f[_e];
                x += sys_1.unicode.charWidth(char);
            }
            return new geometry_1.Point({ x: x, y: y });
        }
        index += chars.length;
        y += 1;
    }
    return new geometry_1.Point(0, y);
}, _Input_toOffset = function _Input_toOffset(position, visibleWidth) {
    if (__classPrivateFieldGet(this, _Input_wrap, "f")) {
        var y = 0, index = 0;
        var x = 0;
        for (var _i = 0, _a = __classPrivateFieldGet(this, _Input_printableLines, "f"); _i < _a.length; _i++) {
            var chars = _a[_i][0];
            if (y) {
                y += 1;
            }
            x = 0;
            for (var _b = 0, chars_2 = chars; _b < chars_2.length; _b++) {
                var char = chars_2[_b];
                if (position.isEqual(x, y)) {
                    return index;
                }
                var charWidth = sys_1.unicode.charWidth(char);
                if (x + charWidth >= visibleWidth) {
                    x = 0;
                    y += 1;
                    index += 1;
                }
                else {
                    x += charWidth;
                    index += 1;
                }
            }
        }
        return index;
    }
    else {
        if (position.y >= __classPrivateFieldGet(this, _Input_printableLines, "f").length) {
            return __classPrivateFieldGet(this, _Input_chars, "f").length;
        }
        var y = 0, index = 0;
        for (var _c = 0, _d = __classPrivateFieldGet(this, _Input_printableLines, "f"); _c < _d.length; _c++) {
            var _e = _d[_c], chars = _e[0], width = _e[1];
            if (y === position.y) {
                var x = 0;
                for (var _f = 0, chars_3 = chars; _f < chars_3.length; _f++) {
                    var char = chars_3[_f];
                    x += sys_1.unicode.charWidth(char);
                    if (x > position.x) {
                        return index;
                    }
                    index += 1;
                }
                return index;
            }
            y += 1;
            index += chars.length + 1;
        }
        return __classPrivateFieldGet(this, _Input_chars, "f").length;
    }
}, _Input_cursorPosition = function _Input_cursorPosition(visibleSize) {
    var _a, _b;
    var halfWidth = Math.floor(visibleSize.width / 2);
    var halfHeight = Math.floor(visibleSize.height / 2);
    // the cursor, relative to the start of text (as if all text was visible),
    // ie in the "coordinate system" of the text.
    var cursorEnd = __classPrivateFieldGet(this, _Input_instances, "m", _Input_toPosition).call(this, __classPrivateFieldGet(this, _Input_cursor, "f").end, visibleSize.width);
    var currentLineWidth, totalHeight;
    if (!__classPrivateFieldGet(this, _Input_printableLines, "f").length) {
        return [cursorEnd, new geometry_1.Point(0, 0)];
    }
    if (__classPrivateFieldGet(this, _Input_wrap, "f")) {
        // run through the lines until we get to our desired cursorEnd.y
        // but also add all the heights to calculate currentHeight
        var h = 0;
        currentLineWidth = -1;
        totalHeight = 0;
        for (var _i = 0, _c = __classPrivateFieldGet(this, _Input_printableLines, "f"); _i < _c.length; _i++) {
            var _d = _c[_i], width = _d[1];
            var dh = Math.ceil(width / visibleSize.width);
            totalHeight += dh;
            if (currentLineWidth === -1 && dh >= cursorEnd.y) {
                if (cursorEnd.y - h === dh) {
                    // the cursor is on the last wrapped line, use modulo divide to calculate the
                    // last line width, add 1 for the EOL cursor
                    currentLineWidth = (visibleSize.width % width) + 1;
                }
                else {
                    currentLineWidth = visibleSize.width;
                }
                break;
            }
        }
        currentLineWidth = Math.max(0, currentLineWidth);
    }
    else {
        currentLineWidth = (_b = (_a = __classPrivateFieldGet(this, _Input_printableLines, "f")[cursorEnd.y]) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : 0;
        totalHeight = __classPrivateFieldGet(this, _Input_printableLines, "f").length;
    }
    // Calculate the viewport location where the cursor will be drawn
    // x location:
    var cursorX;
    if (currentLineWidth <= visibleSize.width) {
        // If the viewport can accommodate the entire line
        // draw the cursor at its natural location.
        cursorX = cursorEnd.x;
    }
    else if (cursorEnd.x < halfWidth) {
        // If the cursor is at the start of the line
        // place the cursor at the start of the viewport
        cursorX = cursorEnd.x;
    }
    else if (cursorEnd.x > currentLineWidth - halfWidth) {
        // or if the cursor is at the end of the line
        // draw it at the end of the viewport
        cursorX = visibleSize.width - currentLineWidth + cursorEnd.x;
    }
    else {
        // otherwise place it in the middle.
        cursorX = halfWidth;
    }
    // y location:
    var cursorY;
    if (totalHeight <= visibleSize.height) {
        // If the viewport can accommodate the entire height
        // draw the cursor at its natural location.
        cursorY = cursorEnd.y;
    }
    else if (cursorEnd.y < halfHeight) {
        // If the cursor is at the start of the text
        // place the cursor at the start of the viewport
        cursorY = cursorEnd.y;
    }
    else if (cursorEnd.y >= totalHeight - halfHeight) {
        // or if the cursor is at the end of the text
        // draw it at the end of the viewport
        cursorY = visibleSize.height - totalHeight + cursorEnd.y;
    }
    else {
        // otherwise place it in the middle.
        cursorY = halfHeight;
    }
    // The viewport location where the cursor will be drawn
    return [cursorEnd, new geometry_1.Point(cursorX, cursorY)];
}, _Input_receiveKeyAccent = function _Input_receiveKeyAccent(event) {
    __classPrivateFieldSet(this, _Input_chars, __classPrivateFieldGet(this, _Input_chars, "f").filter(function (char) { return !isAccentChar(char); }), "f");
    var char = ACCENT_KEYS[event.full];
    if (!char) {
        return;
    }
    __classPrivateFieldGet(this, _Input_instances, "m", _Input_receiveChar).call(this, char, false);
}, _Input_receiveKeyPrintable = function _Input_receiveKeyPrintable(_a) {
    var char = _a.char;
    if (__classPrivateFieldGet(this, _Input_cursor, "f").start === __classPrivateFieldGet(this, _Input_cursor, "f").end &&
        isAccentChar(__classPrivateFieldGet(this, _Input_chars, "f")[__classPrivateFieldGet(this, _Input_cursor, "f").start])) {
        // if character under cursor is an accent, replace it.
        var accented = accentChar(__classPrivateFieldGet(this, _Input_chars, "f")[__classPrivateFieldGet(this, _Input_cursor, "f").start], char);
        __classPrivateFieldGet(this, _Input_instances, "m", _Input_receiveChar).call(this, accented, true);
        return;
    }
    __classPrivateFieldGet(this, _Input_instances, "m", _Input_receiveChar).call(this, char, true);
}, _Input_receiveChar = function _Input_receiveChar(char, advance) {
    if (isEmptySelection(__classPrivateFieldGet(this, _Input_cursor, "f"))) {
        __classPrivateFieldSet(this, _Input_chars, __classPrivateFieldGet(this, _Input_chars, "f")
            .slice(0, __classPrivateFieldGet(this, _Input_cursor, "f").start)
            .concat(char, __classPrivateFieldGet(this, _Input_chars, "f").slice(__classPrivateFieldGet(this, _Input_cursor, "f").start)), "f");
        __classPrivateFieldGet(this, _Input_cursor, "f").start = __classPrivateFieldGet(this, _Input_cursor, "f").end =
            __classPrivateFieldGet(this, _Input_cursor, "f").start + (advance ? 1 : 0);
    }
    else {
        __classPrivateFieldSet(this, _Input_chars, __classPrivateFieldGet(this, _Input_chars, "f")
            .slice(0, this.minSelected())
            .concat(char, __classPrivateFieldGet(this, _Input_chars, "f").slice(this.maxSelected())), "f");
        __classPrivateFieldGet(this, _Input_cursor, "f").start = __classPrivateFieldGet(this, _Input_cursor, "f").end =
            this.minSelected() + (advance ? 1 : 0);
    }
}, _Input_receiveGotoStart = function _Input_receiveGotoStart() {
    __classPrivateFieldSet(this, _Input_cursor, { start: 0, end: 0 }, "f");
}, _Input_receiveGotoEnd = function _Input_receiveGotoEnd() {
    __classPrivateFieldSet(this, _Input_cursor, { start: __classPrivateFieldGet(this, _Input_chars, "f").length, end: __classPrivateFieldGet(this, _Input_chars, "f").length }, "f");
}, _Input_receiveHome = function _Input_receiveHome(_a) {
    var shift = _a.shift;
    var dest = 0;
    // move the cursor to the previous line, moving the cursor until it is at the
    // same X position.
    var cursorPosition = __classPrivateFieldGet(this, _Input_instances, "m", _Input_toPosition).call(this, __classPrivateFieldGet(this, _Input_cursor, "f").end, __classPrivateFieldGet(this, _Input_visibleWidth, "f")).mutableCopy();
    if (cursorPosition.y === 0) {
        dest = 0;
    }
    else {
        var _b = __classPrivateFieldGet(this, _Input_wrappedLines, "f")[cursorPosition.y], targetChars = _b[0], targetWidth = _b[1];
        dest = __classPrivateFieldGet(this, _Input_wrappedLines, "f")
            .slice(0, cursorPosition.y)
            .reduce(function (dest, _a) {
            var width = _a[1];
            return dest + width;
        }, 0);
    }
    if (shift) {
        __classPrivateFieldGet(this, _Input_cursor, "f").end = dest;
    }
    else {
        __classPrivateFieldSet(this, _Input_cursor, { start: dest, end: dest }, "f");
    }
}, _Input_receiveEnd = function _Input_receiveEnd(_a) {
    var shift = _a.shift;
    var dest = 0;
    // move the cursor to the next line, moving the cursor until it is at the
    // same X position.
    var cursorPosition = __classPrivateFieldGet(this, _Input_instances, "m", _Input_toPosition).call(this, __classPrivateFieldGet(this, _Input_cursor, "f").end, __classPrivateFieldGet(this, _Input_visibleWidth, "f")).mutableCopy();
    if (cursorPosition.y === __classPrivateFieldGet(this, _Input_wrappedLines, "f").length - 1) {
        dest = __classPrivateFieldGet(this, _Input_chars, "f").length;
    }
    else {
        var _b = __classPrivateFieldGet(this, _Input_wrappedLines, "f")[cursorPosition.y + 1], targetChars = _b[0], targetWidth = _b[1];
        dest =
            __classPrivateFieldGet(this, _Input_wrappedLines, "f")
                .slice(0, cursorPosition.y + 1)
                .reduce(function (dest, _a) {
                var width = _a[1];
                return dest + width;
            }, 0) - 1;
    }
    if (shift) {
        __classPrivateFieldGet(this, _Input_cursor, "f").end = dest;
    }
    else {
        __classPrivateFieldSet(this, _Input_cursor, { start: dest, end: dest }, "f");
    }
}, _Input_receiveKeyUpArrow = function _Input_receiveKeyUpArrow(_a) {
    var shift = _a.shift;
    var dest = 0;
    // move the cursor to the previous line, moving the cursor until it is at the
    // same X position.
    var cursorPosition = __classPrivateFieldGet(this, _Input_instances, "m", _Input_toPosition).call(this, __classPrivateFieldGet(this, _Input_cursor, "f").end, __classPrivateFieldGet(this, _Input_visibleWidth, "f")).mutableCopy();
    if (cursorPosition.y === 0) {
        dest = 0;
    }
    else if (cursorPosition.y <= __classPrivateFieldGet(this, _Input_wrappedLines, "f").length) {
        var _b = __classPrivateFieldGet(this, _Input_wrappedLines, "f")[cursorPosition.y - 1], targetChars = _b[0], targetWidth = _b[1];
        dest = __classPrivateFieldGet(this, _Input_wrappedLines, "f")
            .slice(0, cursorPosition.y - 1)
            .reduce(function (dest, _a) {
            var width = _a[1];
            return dest + width;
        }, 0);
        if (targetWidth <= cursorPosition.x) {
            dest += targetWidth - 1;
        }
        else {
            var destOffset = 0;
            for (var _i = 0, targetChars_1 = targetChars; _i < targetChars_1.length; _i++) {
                var char = targetChars_1[_i];
                var charWidth = sys_1.unicode.charWidth(char);
                if (destOffset + charWidth > cursorPosition.x) {
                    break;
                }
                destOffset += 1;
            }
            dest += destOffset;
        }
    }
    if (shift) {
        __classPrivateFieldGet(this, _Input_cursor, "f").end = dest;
    }
    else {
        __classPrivateFieldSet(this, _Input_cursor, { start: dest, end: dest }, "f");
    }
}, _Input_receiveKeyDownArrow = function _Input_receiveKeyDownArrow(_a) {
    var shift = _a.shift;
    var dest = 0;
    // move the cursor to the next line, moving the cursor until it is at the
    // same X position.
    var cursorPosition = __classPrivateFieldGet(this, _Input_instances, "m", _Input_toPosition).call(this, __classPrivateFieldGet(this, _Input_cursor, "f").end, __classPrivateFieldGet(this, _Input_visibleWidth, "f")).mutableCopy();
    if (cursorPosition.y === __classPrivateFieldGet(this, _Input_wrappedLines, "f").length - 1 ||
        __classPrivateFieldGet(this, _Input_wrappedLines, "f").length === 0) {
        dest = __classPrivateFieldGet(this, _Input_chars, "f").length;
    }
    else {
        var _b = __classPrivateFieldGet(this, _Input_wrappedLines, "f")[cursorPosition.y + 1], targetChars = _b[0], targetWidth = _b[1];
        dest = __classPrivateFieldGet(this, _Input_wrappedLines, "f")
            .slice(0, cursorPosition.y + 1)
            .reduce(function (dest, _a) {
            var width = _a[1];
            return dest + width;
        }, 0);
        if (targetWidth <= cursorPosition.x) {
            dest += targetWidth - 1;
        }
        else {
            var destOffset = 0;
            for (var _i = 0, targetChars_2 = targetChars; _i < targetChars_2.length; _i++) {
                var char = targetChars_2[_i];
                var charWidth = sys_1.unicode.charWidth(char);
                if (destOffset + charWidth > cursorPosition.x) {
                    break;
                }
                destOffset += 1;
            }
            dest += destOffset;
        }
    }
    if (shift) {
        __classPrivateFieldGet(this, _Input_cursor, "f").end = dest;
    }
    else {
        __classPrivateFieldSet(this, _Input_cursor, { start: dest, end: dest }, "f");
    }
}, _Input_prevWordOffset = function _Input_prevWordOffset(shift) {
    var cursor;
    if (shift) {
        cursor = __classPrivateFieldGet(this, _Input_cursor, "f").end;
    }
    else if (isEmptySelection(__classPrivateFieldGet(this, _Input_cursor, "f"))) {
        cursor = __classPrivateFieldGet(this, _Input_cursor, "f").start;
    }
    else {
        cursor = this.minSelected();
    }
    var prevWordOffset = 0;
    for (var _i = 0, _a = sys_1.unicode.words(__classPrivateFieldGet(this, _Input_chars, "f")); _i < _a.length; _i++) {
        var _b = _a[_i], chars = _b[0], offset = _b[1];
        prevWordOffset = offset;
        if (cursor <= offset + chars.length) {
            break;
        }
    }
    return prevWordOffset;
}, _Input_nextWordOffset = function _Input_nextWordOffset(shift) {
    var cursor;
    if (shift) {
        cursor = __classPrivateFieldGet(this, _Input_cursor, "f").end;
    }
    else if (isEmptySelection(__classPrivateFieldGet(this, _Input_cursor, "f"))) {
        cursor = __classPrivateFieldGet(this, _Input_cursor, "f").start;
    }
    else {
        cursor = this.maxSelected();
    }
    var nextWordOffset = 0;
    for (var _i = 0, _a = sys_1.unicode.words(__classPrivateFieldGet(this, _Input_chars, "f")); _i < _a.length; _i++) {
        var _b = _a[_i], chars = _b[0], offset = _b[1];
        nextWordOffset = offset + chars.length;
        if (cursor < offset + chars.length) {
            break;
        }
    }
    return nextWordOffset;
}, _Input_receiveKeyLeftArrow = function _Input_receiveKeyLeftArrow(_a) {
    var shift = _a.shift, meta = _a.meta;
    if (meta) {
        var prevWordOffset = __classPrivateFieldGet(this, _Input_instances, "m", _Input_prevWordOffset).call(this, shift);
        if (shift) {
            __classPrivateFieldGet(this, _Input_cursor, "f").end = prevWordOffset;
        }
        else {
            __classPrivateFieldGet(this, _Input_cursor, "f").start = __classPrivateFieldGet(this, _Input_cursor, "f").end = prevWordOffset;
        }
    }
    else if (shift) {
        __classPrivateFieldGet(this, _Input_cursor, "f").end = Math.max(0, __classPrivateFieldGet(this, _Input_cursor, "f").end - 1);
    }
    else if (isEmptySelection(__classPrivateFieldGet(this, _Input_cursor, "f"))) {
        __classPrivateFieldGet(this, _Input_cursor, "f").start = __classPrivateFieldGet(this, _Input_cursor, "f").end = Math.max(0, __classPrivateFieldGet(this, _Input_cursor, "f").start - 1);
    }
    else {
        __classPrivateFieldGet(this, _Input_cursor, "f").start = __classPrivateFieldGet(this, _Input_cursor, "f").end = this.minSelected();
    }
}, _Input_receiveKeyRightArrow = function _Input_receiveKeyRightArrow(_a) {
    var shift = _a.shift, meta = _a.meta;
    if (meta) {
        var nextWordOffset = __classPrivateFieldGet(this, _Input_instances, "m", _Input_nextWordOffset).call(this, shift);
        if (shift) {
            __classPrivateFieldGet(this, _Input_cursor, "f").end = nextWordOffset;
        }
        else {
            __classPrivateFieldGet(this, _Input_cursor, "f").start = __classPrivateFieldGet(this, _Input_cursor, "f").end = nextWordOffset;
        }
    }
    else if (shift) {
        __classPrivateFieldGet(this, _Input_cursor, "f").end = Math.min(__classPrivateFieldGet(this, _Input_chars, "f").length, __classPrivateFieldGet(this, _Input_cursor, "f").end + 1);
    }
    else if (isEmptySelection(__classPrivateFieldGet(this, _Input_cursor, "f"))) {
        __classPrivateFieldGet(this, _Input_cursor, "f").start = __classPrivateFieldGet(this, _Input_cursor, "f").end = Math.min(__classPrivateFieldGet(this, _Input_chars, "f").length, __classPrivateFieldGet(this, _Input_cursor, "f").start + 1);
    }
    else {
        __classPrivateFieldGet(this, _Input_cursor, "f").start = __classPrivateFieldGet(this, _Input_cursor, "f").end = this.maxSelected();
    }
}, _Input_updateWidth = function _Input_updateWidth() {
    __classPrivateFieldSet(this, _Input_maxLineWidth, __classPrivateFieldGet(this, _Input_chars, "f")
        .map(sys_1.unicode.charWidth)
        .reduce(function (a, b) { return a + b; }, 0), "f");
}, _Input_deleteSelection = function _Input_deleteSelection() {
    __classPrivateFieldSet(this, _Input_chars, __classPrivateFieldGet(this, _Input_chars, "f")
        .slice(0, this.minSelected())
        .concat(__classPrivateFieldGet(this, _Input_chars, "f").slice(this.maxSelected())), "f");
    __classPrivateFieldGet(this, _Input_cursor, "f").start = __classPrivateFieldGet(this, _Input_cursor, "f").end = this.minSelected();
    __classPrivateFieldGet(this, _Input_instances, "m", _Input_updateWidth).call(this);
}, _Input_receiveKeyBackspace = function _Input_receiveKeyBackspace() {
    if (isEmptySelection(__classPrivateFieldGet(this, _Input_cursor, "f"))) {
        if (__classPrivateFieldGet(this, _Input_cursor, "f").start === 0) {
            return;
        }
        __classPrivateFieldSet(this, _Input_chars, __classPrivateFieldGet(this, _Input_chars, "f")
            .slice(0, __classPrivateFieldGet(this, _Input_cursor, "f").start - 1)
            .concat(__classPrivateFieldGet(this, _Input_chars, "f").slice(__classPrivateFieldGet(this, _Input_cursor, "f").start)), "f");
        __classPrivateFieldGet(this, _Input_cursor, "f").start = __classPrivateFieldGet(this, _Input_cursor, "f").end = __classPrivateFieldGet(this, _Input_cursor, "f").start - 1;
    }
    else {
        __classPrivateFieldGet(this, _Input_instances, "m", _Input_deleteSelection).call(this);
    }
}, _Input_receiveKeyDelete = function _Input_receiveKeyDelete() {
    if (isEmptySelection(__classPrivateFieldGet(this, _Input_cursor, "f"))) {
        if (__classPrivateFieldGet(this, _Input_cursor, "f").start > __classPrivateFieldGet(this, _Input_chars, "f").length - 1) {
            return;
        }
        __classPrivateFieldSet(this, _Input_maxLineWidth, __classPrivateFieldGet(this, _Input_maxLineWidth, "f") - sys_1.unicode.charWidth(__classPrivateFieldGet(this, _Input_chars, "f")[__classPrivateFieldGet(this, _Input_cursor, "f").start]), "f");
        __classPrivateFieldSet(this, _Input_chars, __classPrivateFieldGet(this, _Input_chars, "f")
            .slice(0, __classPrivateFieldGet(this, _Input_cursor, "f").start)
            .concat(__classPrivateFieldGet(this, _Input_chars, "f").slice(__classPrivateFieldGet(this, _Input_cursor, "f").start + 1)), "f");
    }
    else {
        __classPrivateFieldGet(this, _Input_instances, "m", _Input_deleteSelection).call(this);
    }
}, _Input_receiveKeyDeleteWord = function _Input_receiveKeyDeleteWord() {
    if (!isEmptySelection(__classPrivateFieldGet(this, _Input_cursor, "f"))) {
        return __classPrivateFieldGet(this, _Input_instances, "m", _Input_deleteSelection).call(this);
    }
    if (__classPrivateFieldGet(this, _Input_cursor, "f").start === 0) {
        return;
    }
    var offset = __classPrivateFieldGet(this, _Input_instances, "m", _Input_prevWordOffset).call(this, false);
    __classPrivateFieldSet(this, _Input_chars, __classPrivateFieldGet(this, _Input_chars, "f")
        .slice(0, offset)
        .concat(__classPrivateFieldGet(this, _Input_chars, "f").slice(__classPrivateFieldGet(this, _Input_cursor, "f").start)), "f");
    __classPrivateFieldGet(this, _Input_cursor, "f").start = __classPrivateFieldGet(this, _Input_cursor, "f").end = offset;
    __classPrivateFieldGet(this, _Input_instances, "m", _Input_updateWidth).call(this);
};
function isEmptySelection(cursor) {
    return cursor.start === cursor.end;
}
function isInSelection(cursorMin, cursorMax, scanTextPosition) {
    if (scanTextPosition.y < cursorMin.y || scanTextPosition.y > cursorMax.y) {
        return false;
    }
    if (scanTextPosition.y === cursorMin.y) {
        if (scanTextPosition.x < cursorMin.x) {
            return false;
        }
    }
    if (scanTextPosition.y === cursorMax.y) {
        if (scanTextPosition.x >= cursorMax.x) {
            return false;
        }
    }
    return true;
}
function isAccentChar(char) {
    return ACCENTS[char] !== undefined;
}
var ACCENTS = {
    '`': {
        A: 'À',
        E: 'È',
        I: 'Ì',
        O: 'Ò',
        U: 'Ù',
        N: 'Ǹ',
        a: 'à',
        e: 'è',
        i: 'ì',
        o: 'ò',
        u: 'ù',
        n: 'ǹ',
    },
    '¸': {
        C: 'Ç',
        D: 'Ḑ',
        E: 'Ȩ',
        G: 'Ģ',
        H: 'Ḩ',
        K: 'Ķ',
        L: 'Ļ',
        N: 'Ņ',
        R: 'Ŗ',
        S: 'Ş',
        T: 'Ţ',
        c: 'ç',
        d: 'ḑ',
        e: 'ȩ',
        g: 'ģ',
        h: 'ḩ',
        k: 'ķ',
        l: 'ļ',
        n: 'ņ',
        r: 'ŗ',
        s: 'ş',
        t: 'ţ',
    },
    '´': {
        A: 'Á',
        C: 'Ć',
        E: 'É',
        G: 'Ǵ',
        I: 'Í',
        K: 'Ḱ',
        L: 'Ĺ',
        M: 'Ḿ',
        N: 'Ń',
        O: 'Ó',
        P: 'Ṕ',
        R: 'Ŕ',
        S: 'Ś',
        U: 'Ú',
        W: 'Ẃ',
        Y: 'Ý',
        a: 'á',
        c: 'ć',
        e: 'é',
        g: 'ǵ',
        i: 'í',
        k: 'ḱ',
        l: 'ĺ',
        m: 'ḿ',
        n: 'ń',
        o: 'ó',
        p: 'ṕ',
        r: 'ŕ',
        s: 'ś',
        u: 'ú',
        w: 'ẃ',
        y: 'ý',
    },
    ˆ: {
        A: 'Â',
        C: 'Ĉ',
        E: 'Ê',
        G: 'Ĝ',
        H: 'Ĥ',
        I: 'Î',
        J: 'Ĵ',
        O: 'Ô',
        S: 'Ŝ',
        U: 'Û',
        W: 'Ŵ',
        Y: 'Ŷ',
        a: 'â',
        c: 'ĉ',
        e: 'ê',
        g: 'ĝ',
        h: 'ĥ',
        i: 'î',
        j: 'ĵ',
        o: 'ô',
        s: 'ŝ',
        u: 'û',
        w: 'ŵ',
        y: 'ŷ',
    },
    '˜': {
        A: 'Ã',
        I: 'Ĩ',
        N: 'Ñ',
        O: 'Õ',
        U: 'Ũ',
        Y: 'Ỹ',
        a: 'ã',
        i: 'ĩ',
        n: 'ñ',
        o: 'õ',
        u: 'ũ',
        y: 'ỹ',
    },
    '¯': {
        A: 'Ā',
        E: 'Ē',
        I: 'Ī',
        O: 'Ō',
        U: 'Ū',
        Y: 'Ȳ',
        a: 'ā',
        e: 'ē',
        i: 'ī',
        o: 'ō',
        u: 'ū',
        y: 'ȳ',
    },
    '¨': {
        A: 'Ä',
        E: 'Ë',
        I: 'Ï',
        O: 'Ö',
        U: 'Ü',
        W: 'Ẅ',
        X: 'Ẍ',
        Y: 'Ÿ',
        a: 'ä',
        e: 'ë',
        i: 'ï',
        o: 'ö',
        u: 'ü',
        w: 'ẅ',
        x: 'ẍ',
        y: 'ÿ',
    },
};
var ACCENT_KEYS = {
    'M-a': '`',
    'M-c': '¸',
    'M-e': '´',
    'M-i': 'ˆ',
    'M-n': '˜',
    'M-o': '¯',
    'M-s': '¸',
    'M-u': '¨',
};
function accentChar(accent, char) {
    var _a, _b;
    return (_b = (_a = ACCENTS[accent]) === null || _a === void 0 ? void 0 : _a[char]) !== null && _b !== void 0 ? _b : char;
}
function isKeyAccent(event) {
    if (!event.meta || event.ctrl) {
        return false;
    }
    return ACCENT_KEYS[event.full] !== undefined;
}
