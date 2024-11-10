"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wretched_1 = require("wretched");
const wretched_2 = require("wretched");
const demo_1 = require("./demo");
const OBJ = {
    word: 'something',
    tags: ['tag1', 'tag2', 'tag3', 'tag4'],
    sentences: {
        short: 'this is a short sentence.',
        medium: 'this is another sentence, slightly longer.',
        long: 'finally, a long sentence, one that goes on a little too long, it could be argued.',
    },
};
(0, demo_1.demo)(new wretched_2.Collapsible({
    isCollapsed: false,
    collapsed: new wretched_2.Text({ text: (0, wretched_1.inspect)(OBJ, false) }),
    expanded: new wretched_2.Text({ text: (0, wretched_1.inspect)(OBJ, true) }),
}));
//# sourceMappingURL=collapsible.js.map