"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Style = void 0;
var sys_1 = require("./sys");
var Color_1 = require("./Color");
var util_1 = require("./util");
var Style = /** @class */ (function () {
    function Style(_a) {
        var _b = _a === void 0 ? {} : _a, bold = _b.bold, dim = _b.dim, italic = _b.italic, strikeout = _b.strikeout, underline = _b.underline, inverse = _b.inverse, blink = _b.blink, invisible = _b.invisible, foreground = _b.foreground, background = _b.background;
        this.underline = underline;
        this.inverse = inverse;
        this.bold = bold;
        // bold and dim are mutually exclusive - bold has precedence
        this.dim = bold ? undefined : dim;
        this.italic = italic;
        this.strikeout = strikeout;
        this.blink = blink;
        this.invisible = invisible;
        this.foreground = foreground;
        this.background = background;
        (0, util_1.define)(this, 'underline', { enumerable: this.underline !== undefined });
        (0, util_1.define)(this, 'inverse', { enumerable: this.inverse !== undefined });
        (0, util_1.define)(this, 'bold', { enumerable: this.bold !== undefined });
        (0, util_1.define)(this, 'dim', { enumerable: this.dim !== undefined });
        (0, util_1.define)(this, 'italic', { enumerable: this.italic !== undefined });
        (0, util_1.define)(this, 'strikeout', { enumerable: this.strikeout !== undefined });
        (0, util_1.define)(this, 'blink', { enumerable: this.blink !== undefined });
        (0, util_1.define)(this, 'invisible', { enumerable: this.invisible !== undefined });
        (0, util_1.define)(this, 'foreground', { enumerable: this.foreground !== undefined });
        (0, util_1.define)(this, 'background', { enumerable: this.background !== undefined });
    }
    Style.prototype.invert = function () {
        return this.merge({
            foreground: this.background,
            background: this.foreground,
        });
    };
    Style.prototype.merge = function (style) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (style === undefined) {
            return this;
        }
        return new Style({
            underline: (_a = style.underline) !== null && _a !== void 0 ? _a : this.underline,
            inverse: (_b = style.inverse) !== null && _b !== void 0 ? _b : this.inverse,
            // only one of bold or dim
            bold: (_c = style.bold) !== null && _c !== void 0 ? _c : (style.dim ? undefined : this.bold),
            dim: (_d = style.dim) !== null && _d !== void 0 ? _d : (style.bold ? undefined : this.dim),
            italic: (_e = style.italic) !== null && _e !== void 0 ? _e : this.italic,
            strikeout: (_f = style.strikeout) !== null && _f !== void 0 ? _f : this.strikeout,
            blink: (_g = style.blink) !== null && _g !== void 0 ? _g : this.blink,
            invisible: (_h = style.invisible) !== null && _h !== void 0 ? _h : this.invisible,
            foreground: style.foreground === null
                ? undefined
                : style.foreground === undefined
                    ? this.foreground
                    : style.foreground,
            background: style.background === null
                ? undefined
                : style.background === undefined
                    ? this.background
                    : style.background,
        });
    };
    Style.prototype.isEqual = function (style) {
        return (this.underline === style.underline &&
            this.inverse === style.inverse &&
            this.bold === style.bold &&
            this.dim === style.dim &&
            this.italic === style.italic &&
            this.strikeout === style.strikeout &&
            this.blink === style.blink &&
            this.invisible === style.invisible &&
            this.foreground === style.foreground &&
            this.background === style.background);
    };
    /**
     * @return a more easily debuggable object
     */
    Style.prototype.toDebug = function () {
        return [
            ['bold', this.bold],
            ['dim', this.dim],
            ['italic', this.italic],
            ['strikeout', this.strikeout],
            ['underline', this.underline],
            ['inverse', this.inverse],
            ['blink', this.blink],
            ['invisible', this.invisible],
            ['foreground', this.foreground],
            ['background', this.background],
        ]
            .filter(function (_a) {
            var name = _a[0], value = _a[1];
            return value !== undefined;
        })
            .reduce(function (o, _a) {
            var name = _a[0], value = _a[1];
            o[name] = value;
            return o;
        }, {});
    };
    Style.fromSGR = function (ansi, prevStyle) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        var match = ansi.match(/^\x1b\[([\d;]*)m$/);
        if (!match) {
            return Style.NONE;
        }
        ansi = match[1] + ';';
        var ansiCodes = [];
        var code = '';
        for (var _i = 0, ansi_1 = ansi; _i < ansi_1.length; _i++) {
            var char = ansi_1[_i];
            if (char === ';') {
                if (code === '38' ||
                    code === '38;5' ||
                    code === '48' ||
                    code === '48;5') {
                    code += ';';
                }
                else {
                    ansiCodes.push(code);
                    code = '';
                }
            }
            else {
                code += char;
            }
        }
        var styles = {};
        for (var _u = 0, ansiCodes_1 = ansiCodes; _u < ansiCodes_1.length; _u++) {
            var code_1 = ansiCodes_1[_u];
            if ((match = code_1.match(/^38;5;(\d+)$/))) {
                styles.foreground = { sgr: match[1] };
                continue;
            }
            else if ((match = code_1.match(/^48;5;(\d+)$/))) {
                styles.background = { sgr: match[1] };
                continue;
            }
            else if ((match = code_1.match(/^38;2;([\d;]+)$/))) {
                var _v = match[1]
                    .split(';')
                    .map(function (i) { return Math.max(0, Math.min(255, parseInt(i, 10))); }), r = _v[0], g = _v[1], b = _v[2];
                styles.foreground = [r, g, b];
                continue;
            }
            else if ((match = code_1.match(/^48;2;([\d;]+)$/))) {
                var _w = match[1]
                    .split(';')
                    .map(function (i) { return Math.max(0, Math.min(255, parseInt(i, 10))); }), r = _w[0], g = _w[1], b = _w[2];
                styles.background = [r, g, b];
                continue;
            }
            switch (code_1) {
                case '':
                    break;
                case '0':
                    styles.foreground = (_a = prevStyle.foreground) !== null && _a !== void 0 ? _a : 'default';
                    styles.background = (_b = prevStyle.background) !== null && _b !== void 0 ? _b : 'default';
                    styles.bold = (_c = prevStyle.bold) !== null && _c !== void 0 ? _c : false;
                    styles.dim = (_d = prevStyle.dim) !== null && _d !== void 0 ? _d : false;
                    styles.italic = (_e = prevStyle.italic) !== null && _e !== void 0 ? _e : false;
                    styles.underline = (_f = prevStyle.underline) !== null && _f !== void 0 ? _f : false;
                    styles.blink = (_g = prevStyle.blink) !== null && _g !== void 0 ? _g : false;
                    styles.inverse = (_h = prevStyle.inverse) !== null && _h !== void 0 ? _h : false;
                    styles.invisible = (_j = prevStyle.invisible) !== null && _j !== void 0 ? _j : false;
                    styles.strikeout = (_k = prevStyle.strikeout) !== null && _k !== void 0 ? _k : false;
                    break;
                case '1':
                    styles.bold = true;
                    break;
                case '2':
                    styles.dim = true;
                    break;
                case '22':
                    styles.bold = (_l = prevStyle.bold) !== null && _l !== void 0 ? _l : false;
                    styles.dim = (_m = prevStyle.dim) !== null && _m !== void 0 ? _m : false;
                    break;
                case '3':
                    styles.italic = true;
                    break;
                case '23':
                    styles.italic = (_o = prevStyle.italic) !== null && _o !== void 0 ? _o : false;
                    break;
                case '4':
                    styles.underline = true;
                    break;
                case '24':
                    styles.underline = (_p = prevStyle.underline) !== null && _p !== void 0 ? _p : false;
                    break;
                case '5':
                    styles.blink = true;
                    break;
                case '25':
                    styles.blink = (_q = prevStyle.blink) !== null && _q !== void 0 ? _q : false;
                    break;
                case '7':
                    styles.inverse = true;
                    break;
                case '27':
                    styles.inverse = (_r = prevStyle.inverse) !== null && _r !== void 0 ? _r : false;
                    break;
                case '8':
                    styles.invisible = true;
                    break;
                case '28':
                    styles.invisible = (_s = prevStyle.invisible) !== null && _s !== void 0 ? _s : false;
                    break;
                case '9':
                    styles.strikeout = true;
                    break;
                case '29':
                    styles.strikeout = (_t = prevStyle.strikeout) !== null && _t !== void 0 ? _t : false;
                    break;
                case '30':
                    styles.foreground = 'black';
                    break;
                case '31':
                    styles.foreground = 'red';
                    break;
                case '32':
                    styles.foreground = 'green';
                    break;
                case '33':
                    styles.foreground = 'yellow';
                    break;
                case '34':
                    styles.foreground = 'blue';
                    break;
                case '35':
                    styles.foreground = 'magenta';
                    break;
                case '36':
                    styles.foreground = 'cyan';
                    break;
                case '37':
                    styles.foreground = 'white';
                    break;
                case '39':
                    styles.foreground = 'default';
                    break;
                case '90':
                    styles.foreground = 'gray';
                    break;
                case '91':
                    styles.foreground = 'brightRed';
                    break;
                case '92':
                    styles.foreground = 'brightGreen';
                    break;
                case '93':
                    styles.foreground = 'brightYellow';
                    break;
                case '94':
                    styles.foreground = 'brightBlue';
                    break;
                case '95':
                    styles.foreground = 'brightMagenta';
                    break;
                case '96':
                    styles.foreground = 'brightCyan';
                    break;
                case '97':
                    styles.foreground = 'brightWhite';
                    break;
                case '40':
                    styles.background = 'black';
                    break;
                case '41':
                    styles.background = 'red';
                    break;
                case '42':
                    styles.background = 'green';
                    break;
                case '43':
                    styles.background = 'yellow';
                    break;
                case '44':
                    styles.background = 'blue';
                    break;
                case '45':
                    styles.background = 'magenta';
                    break;
                case '46':
                    styles.background = 'cyan';
                    break;
                case '47':
                    styles.background = 'white';
                    break;
                case '49':
                    styles.background = 'default';
                    break;
                case '100':
                    styles.background = 'gray';
                    break;
                case '101':
                    styles.background = 'brightRed';
                    break;
                case '102':
                    styles.background = 'brightGreen';
                    break;
                case '103':
                    styles.background = 'brightYellow';
                    break;
                case '104':
                    styles.background = 'brightBlue';
                    break;
                case '105':
                    styles.background = 'brightMagenta';
                    break;
                case '106':
                    styles.background = 'brightCyan';
                    break;
                case '107':
                    styles.background = 'brightWhite';
                    break;
            }
        }
        return new Style(styles);
    };
    /**
     * @param prevStyle Used by the buffer to reset foreground/background colors and attrs
     * @param text If provided, the text will be "wrapped" in the new codes, and
     * `prevStyle` will be restored.
     */
    Style.prototype.toSGR = function (prevStyle, text) {
        var _a, _b;
        var globalProgram = sys_1.program.global;
        if (!globalProgram) {
            return '';
        }
        var parts = [];
        var undo = [];
        if (this.underline && !prevStyle.underline) {
            parts.push('underline');
            if (text)
                undo.push('!underline');
        }
        else if (!this.underline && prevStyle.underline) {
            parts.push('!underline');
            if (text)
                undo.push('underline');
        }
        if (this.bold && !prevStyle.bold) {
            parts.push('bold');
            if (text)
                undo.push('!bold');
        }
        else if (!this.bold && prevStyle.bold) {
            parts.push('!bold');
            if (text)
                undo.push('bold');
        }
        if (this.dim && !prevStyle.dim) {
            parts.push('dim');
            if (text)
                undo.push('!dim');
        }
        else if (!this.dim && prevStyle.dim) {
            parts.push('!dim');
            if (text)
                undo.push('dim');
        }
        if (this.italic && !prevStyle.italic) {
            parts.push('italic');
            if (text)
                undo.push('!italic');
        }
        else if (!this.italic && prevStyle.italic) {
            parts.push('!italic');
            if (text)
                undo.push('italic');
        }
        if (this.strikeout && !prevStyle.strikeout) {
            parts.push('strikeout');
            if (text)
                undo.push('!strikeout');
        }
        else if (!this.strikeout && prevStyle.strikeout) {
            parts.push('!strikeout');
            if (text)
                undo.push('strikeout');
        }
        if (this.inverse && !prevStyle.inverse) {
            parts.push('inverse');
            if (text)
                undo.push('!inverse');
        }
        else if (!this.inverse && prevStyle.inverse) {
            parts.push('!inverse');
            if (text)
                undo.push('inverse');
        }
        if (this.foreground) {
            parts.push((0, Color_1.colorToSGR)(this.foreground, 'fg'));
            if (text)
                undo.push((0, Color_1.colorToSGR)((_a = prevStyle.foreground) !== null && _a !== void 0 ? _a : 'default', 'fg'));
        }
        else if (prevStyle.foreground && prevStyle.foreground !== 'default') {
            parts.push((0, Color_1.colorToSGR)('default', 'fg'));
            if (text)
                undo.push((0, Color_1.colorToSGR)(prevStyle.foreground, 'fg'));
        }
        if (this.background) {
            parts.push((0, Color_1.colorToSGR)(this.background, 'bg'));
            if (text)
                undo.push((0, Color_1.colorToSGR)((_b = prevStyle.background) !== null && _b !== void 0 ? _b : 'default', 'bg'));
        }
        else if (prevStyle.background && prevStyle.background !== 'default') {
            parts.push((0, Color_1.colorToSGR)('default', 'bg'));
            if (text)
                undo.push((0, Color_1.colorToSGR)(prevStyle.background, 'bg'));
        }
        // put '!' flags in front
        parts.sort();
        undo.sort();
        if (text !== undefined) {
            return globalProgram.style(parts) + text + globalProgram.style(undo);
        }
        if (parts.length) {
            return globalProgram.style(parts);
        }
        else {
            return '';
        }
    };
    Style.NONE = new Style();
    Style.underlined = new Style({ underline: true });
    Style.bold = new Style({ bold: true });
    return Style;
}());
exports.Style = Style;
