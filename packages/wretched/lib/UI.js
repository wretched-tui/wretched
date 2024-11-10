"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.childTheme = childTheme;
var Theme_1 = require("./Theme");
function childTheme(theme, isPressed, isHover) {
    if (isPressed === void 0) { isPressed = false; }
    if (isHover === void 0) { isHover = false; }
    return new Theme_1.Theme({
        background: isPressed
            ? theme.darkenColor
            : isHover
                ? theme.highlightColor
                : theme.backgroundColor,
        textBackground: isPressed
            ? theme.darkenColor
            : isHover
                ? theme.highlightColor
                : theme.backgroundColor,
        highlight: theme.highlightColor,
        darken: isPressed
            ? theme.darkenColor
            : isHover
                ? theme.highlightColor
                : theme.darkenColor,
        text: theme.textColor,
        brightText: theme.brightTextColor,
        dimText: theme.dimTextColor,
    });
}
