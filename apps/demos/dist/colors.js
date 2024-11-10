"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wretched_1 = require("wretched");
const wretched_2 = require("wretched");
const demo_1 = require("./demo");
function pad(num) {
    if (num < 10) {
        return `0${num}`;
    }
    else {
        return `${num}`;
    }
}
const swatch = new wretched_2.Space({ background: '#000', height: 'fill' });
const rgb = [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
];
const redInput = new wretched_2.Input({
    text: `${pad(rgb[0])}`,
    padding: { top: 1 },
    onChange: text => {
        const value = Number.parseFloat(text);
        if (!Number.isNaN(value)) {
            rgb[0] = Math.round(value);
            update();
        }
    },
}), greenInput = new wretched_2.Input({
    text: `${pad(rgb[1])}`,
    padding: { top: 1 },
    onChange: text => {
        const value = Number.parseFloat(text);
        if (!Number.isNaN(value)) {
            rgb[1] = Math.round(value);
            update();
        }
    },
}), blueInput = new wretched_2.Input({
    text: `${pad(rgb[2])}`,
    padding: { top: 1 },
    onChange: text => {
        const value = Number.parseFloat(text);
        if (!Number.isNaN(value)) {
            rgb[2] = Math.round(value);
            update();
        }
    },
});
const rgbText1 = new wretched_2.Digits({ text: '', bold: true });
const rgbText2 = new wretched_2.Digits({ text: '', bold: false });
function updateText(text) {
    rgbText1.text = text;
    rgbText2.text = text;
}
const ansiText = new wretched_2.Text();
const update = () => {
    rgb[0] = Math.max(0, Math.min(255, rgb[0]));
    rgb[1] = Math.max(0, Math.min(255, rgb[1]));
    rgb[2] = Math.max(0, Math.min(255, rgb[2]));
    // const rgb = colors.HSBtoRGB(rgb[0] / 360, rgb[1] / 100, rgb[2] / 100)
    const sgr = wretched_1.colors.match(...rgb, undefined);
    let ansi = `\x1b[38;5;${sgr};48;5;${sgr}m      \x1b[39;49m`;
    ansi = [ansi, ansi, ansi].join('\n') + ` (6bit: ${sgr})`;
    updateText(wretched_1.colors.RGBtoHex(...rgb));
    ansiText.text = ansi;
    swatch.background = wretched_1.colors.RGBtoHex(...rgb);
    redInput.text = `${rgb[0]}`;
    greenInput.text = `${rgb[1]}`;
    blueInput.text = `${rgb[2]}`;
};
update();
(0, demo_1.demo)(wretched_2.Stack.right({
    children: [
        [
            'flex1',
            wretched_2.Stack.down({
                children: [
                    ['flex1', swatch],
                    wretched_2.Stack.right([rgbText1, ansiText]),
                    rgbText2,
                ],
            }),
        ],
        [
            'flex1',
            wretched_2.Stack.right({
                children: [
                    new wretched_2.Slider({
                        direction: 'vertical',
                        range: [0, 255],
                        value: rgb[0],
                        buttons: true,
                        step: 1,
                        border: true,
                        onChange(value) {
                            rgb[0] = Math.round(value);
                            update();
                        },
                    }),
                    new wretched_2.Slider({
                        theme: 'green',
                        direction: 'vertical',
                        range: [0, 255],
                        value: rgb[1],
                        buttons: true,
                        border: true,
                        step: 1,
                        onChange(value) {
                            rgb[1] = Math.round(value);
                            update();
                        },
                    }),
                    new wretched_2.Slider({
                        theme: 'blue',
                        direction: 'vertical',
                        range: [0, 255],
                        value: rgb[2],
                        buttons: true,
                        border: true,
                        step: 1,
                        onChange(value) {
                            rgb[2] = Math.round(value);
                            update();
                        },
                    }),
                    redInput,
                    greenInput,
                    blueInput,
                ],
            }),
        ],
    ],
}));
//# sourceMappingURL=colors.js.map