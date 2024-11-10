"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorToHex = colorToHex;
exports.colorToSGR = colorToSGR;
var sys_1 = require("./sys");
function colorToHex(color) {
    if (Array.isArray(color)) {
        return sys_1.colors.RGBtoHex(color);
    }
    else if (typeof color === 'string' && color.startsWith('#')) {
        return color;
    }
    else if (typeof color === 'object' && 'sgr' in color) {
        return sys_1.colors.indexToHex(+color.sgr);
    }
    else if (typeof color === 'object' && 'grayscale' in color) {
        return sys_1.colors.RGBtoHex(color.grayscale, color.grayscale, color.grayscale);
    }
    else {
        var index = sys_1.colors.nameToIndex(color);
        return index === -1 ? '#ffffff' : sys_1.colors.indexToHex(index);
    }
}
function colorToSGR(color, fgbg) {
    if (typeof color === 'object' && 'sgr' in color) {
        return "".concat(color.sgr, " ").concat(fgbg);
    }
    else if (Array.isArray(color)) {
        return "".concat(colorToHex(color), " ").concat(fgbg);
    }
    else if (typeof color === 'object' && 'grayscale' in color) {
        var gray = 232 + Math.round((color.grayscale / 255) * 23);
        return "".concat(colorToHex(color), "(").concat(gray, ") ").concat(fgbg);
    }
    else {
        return "".concat(color, " ").concat(fgbg);
    }
}
