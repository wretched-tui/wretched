"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wretched_1 = require("wretched");
const demo_1 = require("./demo");
(0, demo_1.demo)(new wretched_1.Scrollable({
    child: wretched_1.Stack.down({
        children: Array(100)
            .fill(0)
            .map((_, index) => new wretched_1.Text({
            text: (index % 2
                ? 'abcdefghijklmnopqrstuvwxyz'
                : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ').repeat(12),
        })),
    }),
}));
//# sourceMappingURL=scrollable.js.map