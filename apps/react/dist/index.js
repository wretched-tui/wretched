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
const react_1 = __importStar(require("react"));
const wretched_1 = require("wretched");
const wretched_react_1 = require("wretched-react");
const borders = ['dotted', 'bold', 'rounded', 'double'];
function useToggle(initial) {
    return (0, react_1.useReducer)(state => !state, initial);
}
function Demo() {
    const [height, setHeight_] = (0, react_1.useState)(12);
    const [message, leave] = (0, react_1.useReducer)(state => (state === 'hello' ? 'goodbye' : 'hello'), 'hello');
    const [showExtra, toggleExtra] = useToggle(false);
    const [selected, setSelected] = (0, react_1.useState)([]);
    const [debug, toggleDebug] = useToggle(false);
    const [accordionMultiple, toggleAccordionMultiple] = useToggle(false);
    const [border, switchBorder] = (0, react_1.useReducer)((border) => {
        borders.unshift(border);
        return borders.pop();
    }, 'single');
    const setHeight = (height) => {
        if (debug) {
            console.debug({ height });
        }
        setHeight_(height);
    };
    return (react_1.default.createElement(wretched_react_1.Drawer.bottom, null,
        react_1.default.createElement(wretched_react_1.Stack.right, null,
            react_1.default.createElement(wretched_react_1.Box, { border: border, flex: 1 },
                react_1.default.createElement(wretched_react_1.Stack.down, { gap: 1 },
                    react_1.default.createElement(wretched_react_1.Stack.right, null,
                        react_1.default.createElement(wretched_react_1.Space, { width: 1 }),
                        react_1.default.createElement(wretched_react_1.Slider, { direction: "horizontal", range: [0, 20], value: height, buttons: true, step: 1, border: true, onChange: setHeight }),
                        react_1.default.createElement(wretched_react_1.Space, { width: 1 }),
                        react_1.default.createElement(wretched_react_1.Slider, { flex: 1, direction: "horizontal", range: [0, 20], value: height, buttons: true, step: 1, border: true, onChange: setHeight }),
                        react_1.default.createElement(wretched_react_1.Space, { width: 1 })),
                    react_1.default.createElement(wretched_react_1.Separator.horizontal, null),
                    react_1.default.createElement(wretched_react_1.Stack.down, null,
                        react_1.default.createElement(wretched_react_1.Stack.right, { gap: 1 },
                            react_1.default.createElement(wretched_react_1.Button, { text: "-", onClick: () => setHeight(height - 1) }),
                            react_1.default.createElement(wretched_react_1.Button, { text: "+", onClick: () => setHeight(height + 1) }),
                            react_1.default.createElement(wretched_react_1.Checkbox, { text: "Show Console Log", onChange: toggleDebug, value: debug, hotKey: "C-d" }),
                            react_1.default.createElement(wretched_react_1.Checkbox, { text: "Accordion: multiple", onChange: toggleAccordionMultiple, value: debug, hotKey: "C-m" })),
                        react_1.default.createElement(wretched_react_1.Stack.right, { gap: 1 },
                            react_1.default.createElement(wretched_react_1.Digits, { text: `${height} + ${height} = ${2 * height}`, minWidth: 32 }),
                            react_1.default.createElement(wretched_react_1.ToggleGroup, { titles: [
                                    (0, wretched_1.bold)('B'),
                                    (0, wretched_1.italic)('I'),
                                    (0, wretched_1.underline)('U'),
                                    (0, wretched_1.strikeout)('S'),
                                ], selected: selected, multiple: true, onChange: (_, selected) => setSelected(selected) }))),
                    react_1.default.createElement(wretched_react_1.Tabs, { border: true },
                        react_1.default.createElement(wretched_react_1.Tabs.Section, { title: "Text Example", height: height },
                            react_1.default.createElement(wretched_react_1.Style, { bold: true, foreground: "blue" },
                                message,
                                ' ',
                                react_1.default.createElement(wretched_react_1.Style, { italic: true, foreground: "green" }, "world"),
                                ", I hope you are doing well,",
                                ' ',
                                react_1.default.createElement(wretched_react_1.Style, { italic: true },
                                    "all things ",
                                    react_1.default.createElement(wretched_react_1.Style, { underline: true }, "considered"))),
                            react_1.default.createElement("br", null),
                            "world @ ",
                            height,
                            react_1.default.createElement(wretched_react_1.Br, null),
                            "\uD83D\uDC4D",
                            '\n',
                            "\uD83D\uDC4B"),
                        react_1.default.createElement(wretched_react_1.Tabs.Section, { title: "Headers Example" },
                            react_1.default.createElement(wretched_react_1.Stack.down, { height: height },
                                react_1.default.createElement(wretched_react_1.H1, { text: "Header 1" }),
                                react_1.default.createElement(wretched_react_1.H2, { text: "Header 2" }),
                                react_1.default.createElement(wretched_react_1.H3, { text: "Header 3" }),
                                react_1.default.createElement(wretched_react_1.H4, { text: "Header 4" }),
                                react_1.default.createElement(wretched_react_1.H5, { text: "Header 5" }),
                                react_1.default.createElement(wretched_react_1.H6, { text: "Header 6" })))),
                    react_1.default.createElement(wretched_react_1.Input, { wrap: true, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur molestie faucibus. Phasellus iaculis pellentesque felis eu fringilla. Ut in sollicitudin nisi. Praesent in mauris tortor. Nam interdum, magna eu pellentesque scelerisque, dui sodales enim, et vestibulum nulla dui id ligula. Nam ullamcorper, augue ut interdum vulputate, eros mauris lobortis sapien, ac sodales dui eros ac elit." }),
                    react_1.default.createElement(wretched_react_1.Button, { text: message === 'hello' ? 'Leave' : 'Enter', onClick: leave }),
                    react_1.default.createElement(wretched_react_1.Stack.right, null,
                        react_1.default.createElement(wretched_react_1.Space, { flex: 1 }),
                        react_1.default.createElement(wretched_react_1.Button, { flex: 3, text: "Border", onClick: switchBorder }),
                        react_1.default.createElement(wretched_react_1.Space, { flex: 1 })),
                    react_1.default.createElement(wretched_react_1.Button, { text: showExtra ? 'Hide' : 'Show', onClick: toggleExtra }),
                    showExtra ? (react_1.default.createElement(wretched_react_1.Scrollable, { height: 7 },
                        react_1.default.createElement(wretched_react_1.Stack.down, null,
                            react_1.default.createElement(wretched_react_1.Collapsible, { isCollapsed: true, collapsed: react_1.default.createElement(wretched_react_1.Text, { italic: true },
                                    message,
                                    " (1)"), expanded: react_1.default.createElement(wretched_react_1.Text, { wrap: true },
                                    message,
                                    " (1)",
                                    react_1.default.createElement("br", null),
                                    react_1.default.createElement(wretched_react_1.Style, { bold: true }, "bye,"),
                                    " it was nice to see you! I hope we have another chance to chat. Now I've run out of things to say. Anyway, I think you see what the collapsed text component does.") }),
                            react_1.default.createElement(wretched_react_1.Collapsible, { isCollapsed: true, collapsed: react_1.default.createElement(wretched_react_1.Text, { italic: true },
                                    message,
                                    " (2)"), expanded: react_1.default.createElement(wretched_react_1.Text, { wrap: true },
                                    message,
                                    " (2)",
                                    react_1.default.createElement("br", null),
                                    react_1.default.createElement(wretched_react_1.Style, { bold: true }, "bye,"),
                                    " it was nice to see you! I hope we have another chance to chat. Now I've run out of things to say. Anyway, I think you see what the collapsed text component does.") }),
                            react_1.default.createElement(wretched_react_1.Collapsible, { isCollapsed: true, collapsed: react_1.default.createElement(wretched_react_1.Text, { italic: true },
                                    message,
                                    " (3)"), expanded: react_1.default.createElement(wretched_react_1.Text, { wrap: true },
                                    message,
                                    " (3)",
                                    react_1.default.createElement("br", null),
                                    react_1.default.createElement(wretched_react_1.Style, { bold: true }, "bye,"),
                                    " it was nice to see you! I hope we have another chance to chat. Now I've run out of things to say. Anyway, I think you see what the collapsed text component does.") }),
                            react_1.default.createElement(wretched_react_1.Collapsible, { isCollapsed: true, collapsed: react_1.default.createElement(wretched_react_1.Text, { italic: true },
                                    message,
                                    " (4)"), expanded: react_1.default.createElement(wretched_react_1.Text, { wrap: true },
                                    message,
                                    " (4)",
                                    react_1.default.createElement("br", null),
                                    react_1.default.createElement(wretched_react_1.Style, { bold: true }, message),
                                    " it was nice to see you! I hope we have another chance to chat. Now I've run out of things to say. Anyway, I think you see what the collapsed text component does.") }),
                            react_1.default.createElement(wretched_react_1.Collapsible, { isCollapsed: true, collapsed: react_1.default.createElement(wretched_react_1.Text, { italic: true },
                                    message,
                                    " (5)"), expanded: react_1.default.createElement(wretched_react_1.Text, { wrap: true },
                                    message,
                                    " (5)",
                                    react_1.default.createElement("br", null),
                                    react_1.default.createElement(wretched_react_1.Style, { bold: true }, "bye,"),
                                    " it was nice to see you! I hope we have another chance to chat. Now I've run out of things to say. Anyway, I think you see what the collapsed text component does.") }),
                            react_1.default.createElement(wretched_react_1.Collapsible, { isCollapsed: true, collapsed: react_1.default.createElement(wretched_react_1.Text, { italic: true },
                                    message,
                                    " (6)"), expanded: react_1.default.createElement(wretched_react_1.Text, { wrap: true },
                                    message,
                                    " (6)",
                                    react_1.default.createElement("br", null),
                                    react_1.default.createElement(wretched_react_1.Style, { bold: true }, "bye,"),
                                    " it was nice to see you! I hope we have another chance to chat. Now I've run out of things to say. Anyway, I think you see what the collapsed text component does.") }),
                            react_1.default.createElement(wretched_react_1.Collapsible, { isCollapsed: true, collapsed: react_1.default.createElement(wretched_react_1.Text, { italic: true },
                                    message,
                                    " (7)"), expanded: react_1.default.createElement(wretched_react_1.Text, { wrap: true },
                                    message,
                                    " (7)",
                                    react_1.default.createElement("br", null),
                                    react_1.default.createElement(wretched_react_1.Style, { bold: true }, "bye,"),
                                    " it was nice to see you! I hope we have another chance to chat. Now I've run out of things to say. Anyway, I think you see what the collapsed text component does.") }),
                            react_1.default.createElement(wretched_react_1.Collapsible, { isCollapsed: true, collapsed: react_1.default.createElement(wretched_react_1.Text, { italic: true },
                                    message,
                                    " (8)"), expanded: react_1.default.createElement(wretched_react_1.Text, { wrap: true },
                                    message,
                                    " (8)",
                                    react_1.default.createElement("br", null),
                                    react_1.default.createElement(wretched_react_1.Style, { bold: true }, "bye,"),
                                    " it was nice to see you! I hope we have another chance to chat. Now I've run out of things to say. Anyway, I think you see what the collapsed text component does.") }),
                            react_1.default.createElement(wretched_react_1.Collapsible, { isCollapsed: true, collapsed: react_1.default.createElement(wretched_react_1.Text, { italic: true },
                                    message,
                                    " (9)"), expanded: react_1.default.createElement(wretched_react_1.Text, { wrap: true },
                                    message,
                                    " (9)",
                                    react_1.default.createElement("br", null),
                                    react_1.default.createElement(wretched_react_1.Style, { bold: true }, "bye,"),
                                    " it was nice to see you! I hope we have another chance to chat. Now I've run out of things to say. Anyway, I think you see what the collapsed text component does.") })))) : null,
                    debug ? react_1.default.createElement(wretched_react_1.ConsoleLog, null) : null)),
            react_1.default.createElement(wretched_react_1.Accordion, { multiple: accordionMultiple },
                react_1.default.createElement(wretched_react_1.Accordion.Section, { title: "A" }, "Yup, this is section A"),
                react_1.default.createElement(wretched_react_1.Accordion.Section, { title: "B" }, "You get the idea"),
                react_1.default.createElement(wretched_react_1.Accordion.Section, { title: "C", width: "shrink" },
                    react_1.default.createElement(wretched_react_1.Stack.down, null,
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur molestie faucibus. Phasellus iaculis pellentesque felis eu fringilla. Ut in sollicitudin nisi. Praesent in mauris tortor. Nam interdum, magna eu pellentesque scelerisque, dui ipsum adipiscing ante, vel ullamcorper nisl sapien id arcu. Nullam egestas diam eu felis mollis sit amet cursus enim vehicula. Quisque eu tellus id erat pellentesque consequat. Maecenas fermentum faucibus magna, eget dictum nisi congue sed.",
                        react_1.default.createElement(wretched_react_1.CollapsibleText, { text: "Quisque a justo a nisi eleifend facilisis sit amet at augue. Sed a sapien vitae augue hendrerit porta vel eu ligula. Proin enim urna, faucibus in vestibulum tincidunt, commodo sit amet orci. Vestibulum ac sem urna, quis mattis urna. Nam eget ullamcorper ligula. Nam volutpat, arcu vel auctor dignissim, tortor nisi sodales enim, et vestibulum nulla dui id ligula. Nam ullamcorper, augue ut interdum vulputate, eros mauris lobortis sapien, ac sodales dui eros ac elit." }))))),
        react_1.default.createElement(wretched_react_1.Text, { alignment: "center" }, "Not much to see here")));
}
(0, wretched_1.interceptConsoleLog)();
(0, wretched_react_1.run)(react_1.default.createElement(Demo, null));
//# sourceMappingURL=index.js.map