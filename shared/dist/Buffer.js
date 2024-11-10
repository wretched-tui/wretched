"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buffer = void 0;
const sys_1 = require("./sys");
const ansi_1 = require("./ansi");
const Style_1 = require("./Style");
const geometry_1 = require("./geometry");
class Buffer {
    size = geometry_1.Size.zero;
    #meta = '';
    #canvas = new Map();
    #prev = new Map();
    setForeground(fg) { }
    setBackground(bg) { }
    resize(size) {
        if (size.width !== this.size.width || size.height !== this.size.height) {
            this.#prev = new Map();
        }
        this.size = size;
    }
    /**
     * Writes the string at the cursor from left to write. Exits on newline (no default
     * wrapping behavior).
     */
    writeChar(char, x, y, style) {
        x = ~~x;
        y = ~~y;
        if (char === '\n') {
            return;
        }
        const width = sys_1.unicode.charWidth(char);
        if (width === 0) {
            return;
        }
        if (x < 0 || x >= this.size.width || y < 0 || y >= this.size.height) {
            return;
        }
        let line = this.#canvas.get(y);
        if (line) {
            const prev = line.get(x);
            if (prev?.char === ansi_1.BG_DRAW) {
                const { foreground, background } = prev.style;
                style = style.merge({ foreground, background });
            }
            const leftChar = line.get(x - 1);
            if (leftChar && leftChar.width === 2) {
                // hides a 2-width character that this character is overlapping
                line.set(x - 1, { char: ' ', width: 1, style: leftChar.style });
                // actually writes the character, and records the hidden character
                line.set(x, { char, width, style, hiding: leftChar });
                if (width === 2) {
                    line.delete(x + 1);
                }
                const hiding = leftChar.hiding;
                if (hiding) {
                    line.set(x - 2, hiding);
                }
            }
            else {
                // actually writes the character
                line.set(x, { char, width, style });
                if (width === 2) {
                    line.delete(x + 1);
                }
                const next = line.get(x + 1);
                if (next && next.hiding) {
                    // the next character can no longer be "hiding" the previous character (this
                    // character)
                    line.set(x + 1, { ...next, hiding: undefined });
                }
            }
        }
        else {
            line = new Map([[x, { char, width, style }]]);
            this.#canvas.set(y, line);
        }
    }
    /**
     * For ANSI sequences that aren't related to any specific character.
     */
    writeMeta(str) {
        this.#meta += str;
    }
    flush(terminal) {
        if (this.#meta) {
            terminal.write(this.#meta);
        }
        let prevStyle = Style_1.Style.NONE;
        for (let y = 0; y < this.size.height; y++) {
            const line = this.#canvas.get(y) ?? new Map();
            const prevLine = this.#prev.get(y) ?? new Map();
            this.#prev.set(y, prevLine);
            let didWrite = false;
            let dx = 1;
            for (let x = 0; x < this.size.width; x += dx) {
                const chrInfo = line.get(x) ?? { char: ' ', style: Style_1.Style.NONE, width: 1 };
                const prevInfo = prevLine.get(x);
                dx = chrInfo.width;
                if (prevInfo && isCharEqual(chrInfo, prevInfo)) {
                    didWrite = false;
                    continue;
                }
                if (!didWrite) {
                    didWrite = true;
                    terminal.move(x, y);
                }
                let { char, style } = chrInfo;
                if (char === ansi_1.BG_DRAW) {
                    char = ' ';
                }
                if (!prevStyle.isEqual(style)) {
                    terminal.write(style.toSGR(prevStyle));
                    prevStyle = style;
                }
                terminal.write(char);
                prevLine.set(x, chrInfo);
                if (chrInfo.width === 2) {
                    prevLine.delete(x + 1);
                }
            }
        }
        if (prevStyle !== Style_1.Style.NONE) {
            terminal.write('\x1b[0m');
        }
        terminal.flush();
        this.#canvas = new Map();
    }
}
exports.Buffer = Buffer;
function isCharEqual(lhs, rhs) {
    return (lhs.char === rhs.char &&
        lhs.width === rhs.width &&
        lhs.style.isEqual(rhs.style));
}
//# sourceMappingURL=Buffer.js.map