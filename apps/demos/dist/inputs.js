"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wretched_1 = require("wretched");
const demo_1 = require("./demo");
(0, wretched_1.interceptConsoleLog)();
const singleLine = new wretched_1.Input({
    text: "family: 👨‍👩‍👧‍👦 smiley: 😀 some other text that isn't very interesting.",
});
const emptySingleLine = new wretched_1.Input({
    text: '',
    placeholder: 'Single line',
});
const wrapLine = new wretched_1.Input({
    text: 'Once upon a time... There was a little kid. She got into all kinds of trouble. The End.',
    wrap: true,
    width: 20,
    height: 3,
});
const emptyMultiLine = new wretched_1.Input({
    text: 'asdf\nasdf\nasdf\n',
    placeholder: 'INSERT\nLINES\nHERE',
    wrap: true,
    multiline: true,
});
const restrictedLine = new wretched_1.Input({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    maxWidth: 20,
});
const restrictedMultiLine = new wretched_1.Input({
    text: `\
Lorem ipsum
dolor sit
amet, ac
sodales dui
eros ac
elit...`,
    placeholder: 'ahha',
    maxWidth: 10,
    maxHeight: 5,
    multiline: true,
});
function box(input) {
    return wretched_1.Stack.right({
        children: [new wretched_1.Box({ border: 'single', child: input }), new wretched_1.Space()],
    });
}
(0, demo_1.demo)(wretched_1.Stack.down({
    children: [
        //
        box(singleLine),
        box(emptySingleLine),
        box(wrapLine),
        box(emptyMultiLine),
        box(restrictedLine),
        box(restrictedMultiLine),
    ],
}), false);
//# sourceMappingURL=inputs.js.map