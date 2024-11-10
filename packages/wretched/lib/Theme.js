"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme = void 0;
var Style_1 = require("./Style");
var defaultText = '#E2E2E2(253)';
var defaultBrightText = '#FFF(16)';
var defaultDimText = '#808080(239)';
var defaultDimBackground = '#434343(238)';
var Theme = /** @class */ (function () {
    function Theme(_a) {
        var text = _a.text, brightText = _a.brightText, dimText = _a.dimText, dimBackground = _a.dimBackground, background = _a.background, textBackground = _a.textBackground, highlight = _a.highlight, darken = _a.darken;
        this.textColor = text !== null && text !== void 0 ? text : defaultText;
        this.brightTextColor = brightText !== null && brightText !== void 0 ? brightText : defaultBrightText;
        this.dimTextColor = dimText !== null && dimText !== void 0 ? dimText : defaultDimText;
        this.dimBackgroundColor = dimBackground !== null && dimBackground !== void 0 ? dimBackground : defaultDimBackground;
        this.backgroundColor = background;
        this.textBackgroundColor = textBackground !== null && textBackground !== void 0 ? textBackground : background;
        this.highlightColor = highlight;
        this.darkenColor = darken;
    }
    /**
     * "Ornament" is meant to draw decorative characters that disappear on hover/press
     */
    Theme.prototype.ui = function (_a) {
        var _b = _a === void 0 ? {} : _a, isPressed = _b.isPressed, isHover = _b.isHover, isOrnament = _b.isOrnament;
        if (isPressed) {
            return new Style_1.Style({
                foreground: isOrnament ? this.darkenColor : this.textColor,
                background: this.darkenColor,
            });
        }
        else if (isHover) {
            return new Style_1.Style({
                foreground: isOrnament ? this.highlightColor : this.textColor,
                background: this.highlightColor,
            });
        }
        else if (isOrnament) {
            return new Style_1.Style({
                foreground: this.darkenColor,
                background: this.backgroundColor,
            });
        }
        else {
            return new Style_1.Style({
                foreground: this.textColor,
                background: this.backgroundColor,
            });
        }
    };
    /**
     * Creates a text style using the current theme.
     *
     * Not all combinations are supported:
     * - isSelected and isPlaceholder revert to just isPlaceholder
     */
    Theme.prototype.text = function (_a) {
        var _b = _a === void 0 ? {} : _a, isPressed = _b.isPressed, isHover = _b.isHover, isSelected = _b.isSelected, isPlaceholder = _b.isPlaceholder, hasFocus = _b.hasFocus;
        if (isPlaceholder) {
            return new Style_1.Style({
                foreground: isPressed ? this.textColor : this.dimTextColor,
                background: isHover
                    ? this.dimBackgroundColor
                    : this.textBackgroundColor,
                bold: hasFocus,
            });
        }
        if (isPressed) {
            return new Style_1.Style({
                foreground: this.highlightColor,
                background: this.textBackgroundColor,
                inverse: hasFocus && isSelected,
                bold: hasFocus,
            });
        }
        if (isHover) {
            return new Style_1.Style({
                foreground: this.brightTextColor,
                background: this.textBackgroundColor,
                inverse: hasFocus && isSelected,
                bold: hasFocus,
            });
        }
        if (isSelected && !hasFocus) {
            return new Style_1.Style({
                foreground: this.dimTextColor,
                background: this.dimBackgroundColor,
            });
        }
        return new Style_1.Style({
            foreground: this.textColor,
            background: this.textBackgroundColor,
            inverse: hasFocus && isSelected,
            bold: hasFocus,
        });
    };
    Theme.plain = new Theme({
        background: '#4F4F4F(239)',
        textBackground: 'default',
        highlight: '#616161(241)',
        darken: '#3F3F3F(237)',
    });
    Theme.primary = new Theme({
        background: '#0032FA',
        textBackground: '#00197F',
        highlight: '#0074FF',
        darken: '#002AD3',
        text: '#E2E2E2(253)',
        brightText: '#0074FF',
        dimText: '#0058C8',
    });
    Theme.secondary = new Theme({
        background: '#D0851C',
        textBackground: '#805211',
        highlight: '#F39614',
        darken: '#A66A16',
        text: '#E2E2E2(253)',
        brightText: '#F39614',
        dimText: '#A66A16',
    });
    Theme.proceed = new Theme({
        background: '#108040',
        textBackground: '#073F20',
        highlight: '#1EB317',
        darken: '#0C6030',
        text: '#E2E2E2(253)',
        brightText: '#1EB317',
        dimText: '#0C6030',
    });
    Theme.cancel = new Theme({
        background: '#981618',
        textBackground: '#4A0A0B',
        highlight: '#C51B1E',
        darken: '#821113',
        text: '#E2E2E2(253)',
        brightText: '#C51B1E',
        dimText: '#821113',
    });
    Theme.selected = new Theme({
        text: '#383838(236)',
        background: '#BDBDBD(250)',
        textBackground: '#BDBDBD(250)',
        highlight: '#E6E6E6(254)',
        darken: '#7F7F7F(243)',
    });
    Theme.red = Theme.cancel;
    Theme.green = Theme.proceed;
    Theme.blue = Theme.primary;
    Theme.orange = Theme.secondary;
    return Theme;
}());
exports.Theme = Theme;
