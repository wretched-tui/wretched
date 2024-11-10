"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = void 0;
const react_1 = __importStar(require("react"));
const wretched_1 = require("wretched");
const wretched_react_1 = require("wretched-react");
function Test() {
    const hello = 'hello';
    const [height, setHeight] = (0, react_1.useState)(10);
    return (react_1.default.createElement(wretched_react_1.Stack.down, null,
        react_1.default.createElement(wretched_react_1.Stack, { direction: "right", gap: 1 },
            react_1.default.createElement(wretched_react_1.Box, { height: 1, width: 20 }),
            react_1.default.createElement(wretched_react_1.Button, { text: "-", onClick: () => setHeight(height - 1) }),
            react_1.default.createElement(wretched_react_1.Button, { text: "+", onClick: () => setHeight(height + 1) })),
        react_1.default.createElement(wretched_react_1.Box, { height: height, border: "single" },
            react_1.default.createElement(wretched_react_1.Text, { alignment: "left", font: "fraktur" },
                react_1.default.createElement(wretched_react_1.Style, { bold: true, foreground: "blue" },
                    hello,
                    ' ',
                    react_1.default.createElement(wretched_react_1.Style, { italic: true, foreground: "green" }, "world"),
                    ", I hope you are doing well,",
                    ' ',
                    react_1.default.createElement(wretched_react_1.Style, { italic: true },
                        "all things ",
                        react_1.default.createElement(wretched_react_1.Style, { underline: true }, "considered"))))),
        react_1.default.createElement(wretched_react_1.Box, { height: height, border: "single" },
            react_1.default.createElement(wretched_react_1.Text, { alignment: "right", wrap: true },
                hello,
                "!",
                '\n',
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur molestie faucibus. Phasellus iaculis pellentesque felis eu fringilla. Ut in sollicitudin nisi. Praesent in mauris tortor. Nam interdum, magna eu pellentesque scelerisque, dui ipsum adipiscing ante, vel ullamcorper nisl sapien id arcu. Nullam egestas diam eu felis mollis sit amet cursus enim vehicula. Quisque eu tellus id erat vestibulum nulla dui id ligula. Nam ullamcorper, augue ut interdum vulputate, eros mauris lobortis sapien, ac sodales dui eros ac elit.",
                react_1.default.createElement("br", null),
                "world @ ",
                height,
                react_1.default.createElement("br", null),
                "\uD83D\uDC4D")),
        react_1.default.createElement(wretched_react_1.Box, { height: height, border: "single" },
            react_1.default.createElement(wretched_react_1.Text, { alignment: "center" },
                hello,
                "!",
                '\n',
                "world @ ",
                height,
                react_1.default.createElement("br", null),
                "\uD83D\uDC4D")),
        react_1.default.createElement(wretched_react_1.Box, { height: height, border: "single" },
            react_1.default.createElement(wretched_react_1.Style, { bold: true },
                hello,
                react_1.default.createElement(wretched_react_1.Style, { dim: true }, "!"),
                "woah"),
            '\n',
            "world @ ",
            height,
            react_1.default.createElement("br", null),
            "\uD83D\uDC4D")));
}
exports.Test = Test;
(0, wretched_1.interceptConsoleLog)();
(0, wretched_react_1.run)(react_1.default.createElement(Test, null));
//# sourceMappingURL=test.js.map