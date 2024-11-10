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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _Text_instances, _Text_style, _Text_text, _Text_lines, _Text_alignment, _Text_wrap, _Text_wrappedLines, _Text_font, _Text_update, _Text_updateLines, _Text_wrapLines;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = void 0;
var sys_1 = require("../sys");
var View_1 = require("../View");
var Style_1 = require("../Style");
var geometry_1 = require("../geometry");
var fonts_1 = require("./fonts");
var util_1 = require("../util");
var DEFAULTS = {
    alignment: 'left',
    wrap: false,
    font: 'default',
};
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text(props) {
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _Text_instances.add(_this);
        _Text_style.set(_this, void 0);
        _Text_text.set(_this, '');
        _Text_lines.set(_this, []);
        _Text_alignment.set(_this, DEFAULTS.alignment);
        _Text_wrap.set(_this, DEFAULTS.wrap);
        _Text_wrappedLines.set(_this, void 0);
        _Text_font.set(_this, DEFAULTS.font);
        __classPrivateFieldGet(_this, _Text_instances, "m", _Text_update).call(_this, props);
        (0, util_1.define)(_this, 'text', { enumerable: true });
        (0, util_1.define)(_this, 'font', { enumerable: true });
        return _this;
    }
    Object.defineProperty(Text.prototype, "text", {
        get: function () {
            return __classPrivateFieldGet(this, _Text_text, "f");
        },
        set: function (value) {
            if (__classPrivateFieldGet(this, _Text_text, "f") === value) {
                return;
            }
            __classPrivateFieldGet(this, _Text_instances, "m", _Text_updateLines).call(this, value, value.split('\n'), __classPrivateFieldGet(this, _Text_font, "f"));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "font", {
        get: function () {
            return __classPrivateFieldGet(this, _Text_font, "f");
        },
        set: function (value) {
            if (__classPrivateFieldGet(this, _Text_font, "f") === value) {
                return;
            }
            __classPrivateFieldGet(this, _Text_instances, "m", _Text_updateLines).call(this, __classPrivateFieldGet(this, _Text_text, "f"), undefined, value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "style", {
        get: function () {
            return __classPrivateFieldGet(this, _Text_style, "f");
        },
        set: function (value) {
            if (__classPrivateFieldGet(this, _Text_style, "f") === value) {
                return;
            }
            __classPrivateFieldSet(this, _Text_style, value, "f");
            this.invalidateRender();
        },
        enumerable: false,
        configurable: true
    });
    Text.prototype.update = function (props) {
        __classPrivateFieldGet(this, _Text_instances, "m", _Text_update).call(this, props);
        _super.prototype.update.call(this, props);
    };
    Text.prototype.naturalSize = function (available) {
        var _this = this;
        if (__classPrivateFieldGet(this, _Text_lines, "f").length === 0) {
            return geometry_1.Size.zero;
        }
        return __classPrivateFieldGet(this, _Text_lines, "f").reduce(function (size, _a) {
            var width = _a[1];
            if (__classPrivateFieldGet(_this, _Text_wrap, "f")) {
                var lineHeight = Math.ceil(width / available.width);
                size.width = Math.max(size.width, Math.min(width, available.width));
                size.height += lineHeight;
                return size;
            }
            size.width = Math.max(size.width, width);
            size.height += 1;
            return size;
        }, geometry_1.Size.zero.mutableCopy());
    };
    Text.prototype.render = function (viewport) {
        var _this = this;
        if (viewport.isEmpty) {
            return;
        }
        var lines;
        if (__classPrivateFieldGet(this, _Text_wrap, "f")) {
            lines = __classPrivateFieldGet(this, _Text_instances, "m", _Text_wrapLines).call(this, viewport.contentSize.width, __classPrivateFieldGet(this, _Text_lines, "f"));
            // cache for future render
            __classPrivateFieldSet(this, _Text_wrappedLines, [viewport.contentSize.width, lines], "f");
        }
        else {
            lines = __classPrivateFieldGet(this, _Text_lines, "f");
        }
        var startingStyle = this.theme.text().merge(__classPrivateFieldGet(this, _Text_style, "f"));
        viewport.usingPen(startingStyle, function (pen) {
            var point = new geometry_1.Point(0, 0).mutableCopy();
            for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                var _a = lines_1[_i], line = _a[0], lineWidth = _a[1];
                if (!line.length) {
                    point.y += 1;
                    continue;
                }
                var didWrap = false;
                if (__classPrivateFieldGet(_this, _Text_wrap, "f")) {
                    lineWidth = Math.min(lineWidth, viewport.contentSize.width);
                }
                var offsetX = __classPrivateFieldGet(_this, _Text_alignment, "f") === 'left'
                    ? 0
                    : __classPrivateFieldGet(_this, _Text_alignment, "f") === 'center'
                        ? ~~((viewport.contentSize.width - lineWidth) / 2)
                        : viewport.contentSize.width - lineWidth;
                point.x = offsetX;
                for (var _b = 0, _c = sys_1.unicode.printableChars(line); _b < _c.length; _b++) {
                    var char = _c[_b];
                    var charWidth = sys_1.unicode.charWidth(char);
                    if (charWidth === 0) {
                        // track the current style regardless of wether we are printing
                        pen.mergePen(Style_1.Style.fromSGR(char, startingStyle));
                        continue;
                    }
                    if (__classPrivateFieldGet(_this, _Text_wrap, "f") && point.x >= viewport.contentSize.width) {
                        didWrap = true;
                        point.x = 0;
                        point.y += 1;
                    }
                    if (didWrap && char.match(/\s/)) {
                        continue;
                    }
                    didWrap = false;
                    if (point.x >= viewport.visibleRect.minX() &&
                        point.x + charWidth - 1 < viewport.visibleRect.maxX()) {
                        viewport.write(char, point);
                    }
                    point.x += charWidth;
                    // do not early exit when point.x >= maxX. 'line' may contain ANSI codes that
                    // need to be picked up by mergePen.
                }
                point.y += 1;
            }
        });
    };
    return Text;
}(View_1.View));
exports.Text = Text;
_Text_style = new WeakMap(), _Text_text = new WeakMap(), _Text_lines = new WeakMap(), _Text_alignment = new WeakMap(), _Text_wrap = new WeakMap(), _Text_wrappedLines = new WeakMap(), _Text_font = new WeakMap(), _Text_instances = new WeakSet(), _Text_update = function _Text_update(_a) {
    var text = _a.text, lines = _a.lines, style = _a.style, alignment = _a.alignment, wrap = _a.wrap, font = _a.font;
    __classPrivateFieldSet(this, _Text_style, style, "f");
    __classPrivateFieldSet(this, _Text_alignment, alignment !== null && alignment !== void 0 ? alignment : DEFAULTS.alignment, "f");
    __classPrivateFieldSet(this, _Text_wrap, wrap !== null && wrap !== void 0 ? wrap : DEFAULTS.wrap, "f");
    __classPrivateFieldGet(this, _Text_instances, "m", _Text_updateLines).call(this, text, lines, font);
}, _Text_updateLines = function _Text_updateLines(text, lines, font) {
    __classPrivateFieldSet(this, _Text_font, font !== null && font !== void 0 ? font : DEFAULTS.font, "f");
    var fontMap = font && fonts_1.FONTS[font];
    if (text !== undefined) {
        __classPrivateFieldSet(this, _Text_text, text, "f");
        lines = text === '' ? [] : text.split('\n');
    }
    else if (lines !== undefined) {
        __classPrivateFieldSet(this, _Text_text, lines.join('\n'), "f");
    }
    else {
        __classPrivateFieldSet(this, _Text_text, '', "f");
        lines = [];
    }
    __classPrivateFieldSet(this, _Text_lines, lines.map(function (line) {
        if (fontMap) {
            line = __spreadArray([], line, true).map(function (c) { var _a; return (_a = fontMap.get(c)) !== null && _a !== void 0 ? _a : c; }).join('');
        }
        return [line, sys_1.unicode.lineWidth(line)];
    }), "f");
    __classPrivateFieldSet(this, _Text_wrappedLines, undefined, "f");
    this.invalidateSize();
}, _Text_wrapLines = function _Text_wrapLines(contentWidth, lines) {
    if (contentWidth === 0) {
        return [];
    }
    if (__classPrivateFieldGet(this, _Text_wrap, "f") &&
        __classPrivateFieldGet(this, _Text_wrappedLines, "f") &&
        __classPrivateFieldGet(this, _Text_wrappedLines, "f")[0] === contentWidth) {
        return __classPrivateFieldGet(this, _Text_wrappedLines, "f")[1];
    }
    var wrapped = lines.flatMap(function (_a) {
        var _b;
        var line = _a[0], width = _a[1];
        if (width <= contentWidth) {
            return [[line, width]];
        }
        var lines = [];
        var currentLine = [];
        var currentWidth = 0;
        var STOP = null;
        function pushTrimmed(line) {
            var trimmed = line.replace(/\s+$/, '');
            lines.push([trimmed, sys_1.unicode.lineWidth(trimmed)]);
        }
        for (var _i = 0, _c = __spreadArray(__spreadArray([], sys_1.unicode.words(line), true), [[STOP]], false); _i < _c.length; _i++) {
            var wordChars = _c[_i][0];
            var wordWidth = wordChars ? sys_1.unicode.lineWidth(wordChars) : 0;
            if ((!currentWidth || currentWidth + wordWidth <= contentWidth) &&
                wordChars !== STOP) {
                // there's enough room on the line (and it's not the sentinel STOP)
                // or the line is empty
                currentLine.push.apply(currentLine, wordChars);
                currentWidth += wordWidth;
            }
            else {
                if (currentWidth <= contentWidth) {
                    pushTrimmed(currentLine.join(''));
                    currentLine = [];
                    currentWidth = 0;
                }
                else {
                    // if currentLine is _already_ longer than contentWidth, wrap it, leaving the
                    // remainder on currentLine
                    do {
                        var buffer = '', bufferWidth = 0;
                        for (var _d = 0, _e = currentLine.entries(); _d < _e.length; _d++) {
                            var _f = _e[_d], index = _f[0], char = _f[1];
                            var charWidth = sys_1.unicode.charWidth(char);
                            if (bufferWidth + charWidth > contentWidth) {
                                pushTrimmed(buffer);
                                // scan past whitespace
                                while ((_b = currentLine[index]) === null || _b === void 0 ? void 0 : _b.match(/^\s+$/)) {
                                    index += 1;
                                }
                                currentLine = currentLine.slice(index);
                                currentWidth = sys_1.unicode.lineWidth(currentLine);
                                break;
                            }
                            buffer += char;
                            bufferWidth += charWidth;
                        }
                    } while (currentWidth > contentWidth);
                }
                if (wordChars) {
                    // remove preceding whitespace if currentLine is empty
                    if (currentLine.length === 0) {
                        while (wordChars.length && wordChars[0].match(/^\s+$/)) {
                            wordChars = wordChars.slice(1);
                        }
                    }
                    currentLine.push.apply(currentLine, wordChars);
                    currentWidth = sys_1.unicode.lineWidth(currentLine);
                }
            }
        }
        return lines;
    });
    __classPrivateFieldSet(this, _Text_wrappedLines, [contentWidth, wrapped], "f");
    return wrapped;
};
