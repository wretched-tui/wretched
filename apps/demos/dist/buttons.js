"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wretched_1 = require("wretched");
const demo_1 = require("./demo");
(0, demo_1.demo)(wretched_1.Stack.down({
    children: [
        new wretched_1.Separator({
            direction: 'horizontal',
            border: 'trailing',
            padding: 1,
        }),
        ['flex1', new wretched_1.Space()],
        wretched_1.Stack.right({
            children: Array(8)
                .fill(0)
                .map((_, index) => [
                'flex1',
                new wretched_1.Button({
                    height: 1,
                    theme: 'primary',
                    text: `Launch ${8 - index}`,
                }),
            ]),
        }),
        ['flex1', new wretched_1.Space()],
        new wretched_1.Button({
            height: 3,
            border: 'none',
            theme: 'proceed',
            text: 'Proceed',
        }),
        ['flex1', new wretched_1.Space()],
        new wretched_1.Button({
            height: 3,
            border: 'none',
            theme: 'cancel',
            text: 'Cancel',
        }),
        ['flex1', new wretched_1.Space()],
        new wretched_1.Button({
            height: 3,
            border: 'none',
            theme: 'secondary',
            text: 'Do it!',
        }),
        ['flex1', new wretched_1.Space()],
        new wretched_1.Button({ theme: 'plain', height: 3, text: 'Do it!' }),
        new wretched_1.Button({ theme: 'selected', height: 3, text: 'Do it!' }),
        ['flex1', new wretched_1.Space()],
        new wretched_1.Separator({
            direction: 'horizontal',
            border: 'trailing',
            padding: 1,
        }),
    ],
}));
//# sourceMappingURL=buttons.js.map