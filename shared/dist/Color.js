"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorToHex = colorToHex;
exports.colorToSGR = colorToSGR;
const sys_1 = require("./sys");
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
        const index = sys_1.colors.nameToIndex(color);
        return index === -1 ? '#ffffff' : sys_1.colors.indexToHex(index);
    }
}
function colorToSGR(color, fgbg) {
    if (typeof color === 'object' && 'sgr' in color) {
        return `${color.sgr} ${fgbg}`;
    }
    else if (Array.isArray(color)) {
        return `${colorToHex(color)} ${fgbg}`;
    }
    else if (typeof color === 'object' && 'grayscale' in color) {
        const gray = 232 + Math.round((color.grayscale / 255) * 23);
        return `${colorToHex(color)}(${gray}) ${fgbg}`;
    }
    else {
        return `${color} ${fgbg}`;
    }
}
//# sourceMappingURL=Color.js.map