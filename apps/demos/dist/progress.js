"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wretched_1 = require("wretched");
const demo_1 = require("./demo");
const progressViews = [];
progressViews.push(new wretched_1.Progress({
    direction: 'horizontal',
    width: 'fill',
    height: 5,
    value: 0,
    theme: 'cancel',
}));
progressViews.push(new wretched_1.Progress({
    direction: 'horizontal',
    width: 'fill',
    height: 1,
    value: 0,
    theme: 'primary',
}));
progressViews.push(new wretched_1.Progress({
    direction: 'horizontal',
    width: 'fill',
    height: 2,
    value: 0,
    theme: 'secondary',
}));
progressViews.push(new wretched_1.Progress({
    direction: 'vertical',
    width: 5,
    height: 20,
    value: 0,
    theme: 'proceed',
}));
progressViews.push(new wretched_1.Progress({
    direction: 'vertical',
    width: 1,
    height: 20,
    value: 0,
    theme: 'selected',
}));
progressViews.push(new wretched_1.Progress({
    direction: 'vertical',
    width: 2,
    height: 20,
    value: 0,
}));
class Timer {
    timerId;
    delta = 1;
    value = 0;
    constructor() { }
    toggle() {
        if (this.timerId) {
            this.stop();
        }
        else {
            this.start();
        }
    }
    start() {
        if (this.timerId) {
            return;
        }
        this.timerId = setInterval(() => {
            this.value += this.delta;
            if (this.value === 110) {
                this.delta = -1;
            }
            else if (this.value === -10) {
                this.delta = 1;
            }
            for (const progress of progressViews) {
                progress.value = this.value;
            }
        }, 10);
    }
    stop() {
        if (!this.timerId) {
            return;
        }
        clearInterval(this.timerId);
        this.timerId = undefined;
    }
}
const timer = new Timer();
timer.start();
const button = new wretched_1.Button({
    text: 'Pause',
    onClick() {
        timer.toggle();
    },
});
(0, demo_1.demo)(wretched_1.Stack.down([
    ...progressViews.slice(0, 3),
    wretched_1.Stack.right(progressViews.slice(3)),
    button,
]));
//# sourceMappingURL=progress.js.map