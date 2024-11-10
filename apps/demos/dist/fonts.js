"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wretched_1 = require("wretched");
const demo_1 = require("./demo");
const choices = wretched_1.FontFamilies.map(f => [f, f]);
const text = new wretched_1.Text({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n0123456789\nNunc consectetur molestie faucibus.\nPhasellus iaculis pellentesque felis eu fringilla.\nUt in sollicitudin nisi.\nPraesent in mauris tortor.\nNam interdum, magna eu pellentesque scelerisque, dui ipsum adipiscing ante, vel ullamcorper nisl sapien id arcu.\nNullam egestas diam eu felis mollis sit amet cursus enim vehicula.\nQuisque eu tellus id erat pellentesque consequat.\nMaecenas fermentum faucibus magna, eget dictum nisi congue sed.\nQuisque a justo a nisi eleifend facilisis sit amet at augue.\nSed a sapien vitae augue hendrerit porta vel eu ligula.\nProin enim urna, faucibus in vestibulum tincidunt, commodo sit amet orci.\nVestibulum ac sem urna, quis mattis urna.\nNam eget ullamcorper ligula.\nNam volutpat, arcu vel auctor dignissim, tortor nisi sodales enim, et vestibulum nulla dui id ligula.\nNam ullamcorper, augue ut interdum vulputate, eros mauris lobortis sapien, ac sodales dui eros ac elit.',
    wrap: true,
    font: 'default',
    padding: { left: 1, right: 1 },
});
const dropdown = new wretched_1.Dropdown({
    theme: 'proceed',
    onSelect(value) {
        text.font = value;
    },
    padding: { left: 2, right: 2 },
    height: 3,
    choices,
    selected: 'default',
});
const buttons = wretched_1.Stack.right({
    children: wretched_1.FontFamilies.map(f => new wretched_1.Button({
        text: f,
        border: 'none',
        onClick() {
            text.font = f;
            dropdown.selected = f;
        },
    })),
});
(0, demo_1.demo)(wretched_1.Stack.down({
    children: [
        new wretched_1.Space({ height: 1 }),
        dropdown,
        buttons,
        new wretched_1.Space({ height: 1 }),
        text,
    ],
}));
//# sourceMappingURL=fonts.js.map