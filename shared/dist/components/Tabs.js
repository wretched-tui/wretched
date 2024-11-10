"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tabs = void 0;
const Container_1 = require("../Container");
const geometry_1 = require("../geometry");
const Style_1 = require("../Style");
const Text_1 = require("./Text");
const events_1 = require("../events");
const util_1 = require("../util");
// tabs = new Tabs()
// tabs.addTab('title', tab)
// tabs.addTab(new Text({text: 'title', style: …}), tab)
//
// tabs.add()
class Tabs extends Container_1.Container {
    static Section;
    #selectedTab = 0;
    #separatorLocation;
    #separatorWidths = [];
    #border = false;
    static create(tabs, extraProps = {}) {
        const tabsView = new Tabs(extraProps);
        for (const tab of tabs) {
            if (tab instanceof Section) {
                tabsView.addTab(tab);
            }
            else {
                const [title, view] = tab;
                tabsView.addTab(title, view);
            }
        }
        return tabsView;
    }
    constructor(props = {}) {
        super(props);
        this.#update(props);
    }
    get tabs() {
        return this.children.filter(view => view instanceof Section);
    }
    get tabTitles() {
        return this.children.filter(view => view instanceof TabTitle);
    }
    update(props) {
        super.update(props);
        this.#update(props);
    }
    #update({ border }) {
        this.#border = border ?? true;
    }
    addTab(titleOrTab, child) {
        let tabView;
        if (titleOrTab instanceof Section) {
            tabView = titleOrTab;
        }
        else {
            tabView = Section.create(titleOrTab, child);
        }
        this.add(tabView);
    }
    add(child, at) {
        if (child instanceof Section) {
            child.titleView.onClick = tab => this.#selected(tab);
            super.add(child.titleView);
        }
        super.add(child, at);
    }
    removeChild(child) {
        if (child instanceof Section && child.titleView) {
            super.removeChild(child.titleView);
        }
        super.removeChild(child);
    }
    #selected(tab) {
        const tabTitles = this.tabTitles;
        const index = tabTitles.indexOf(tab);
        if (index === -1) {
            return;
        }
        this.#selectedTab = index;
    }
    naturalSize(available) {
        const remainingSize = available.mutableCopy();
        const tabTitleSize = this.tabTitles.reduce((size, tab, index) => {
            const tabSize = tab.naturalSize(remainingSize).mutableCopy();
            size.width += tabSize.width;
            size.height = Math.max(size.height, tabSize.height);
            remainingSize.width = Math.max(0, remainingSize.width - tabSize.width);
            return size;
        }, geometry_1.Size.zero.mutableCopy());
        const childSize = geometry_1.Size.zero.mutableCopy();
        const availableChildSize = available.shrink(0, tabTitleSize.height);
        for (const tab of this.tabs) {
            const tabSize = tab.naturalSize(availableChildSize);
            childSize.width = Math.max(childSize.width, tabSize.width);
            childSize.height = Math.max(childSize.height, tabSize.height);
        }
        return new geometry_1.Size(Math.max(tabTitleSize.width, childSize.width) + (this.#border ? 3 : 0), tabTitleSize.height + childSize.height + (this.#border ? 1 : 0));
    }
    receiveTick(dt) {
        if (this.#separatorLocation === undefined ||
            this.#selectedTab >= this.#separatorWidths.length) {
            return false;
        }
        const [start, stop] = this.#separatorWidths.reduce(([start, stop, prev], width, index) => index === this.#selectedTab
            ? [start, stop + width, 0]
            : index > this.#selectedTab
                ? [start, stop, 0]
                : [start + width, stop + width, width], [0, 0, 0]);
        const dx = dt / 20;
        if (start < this.#separatorLocation[0]) {
            this.#separatorLocation[0] = Math.max(start, this.#separatorLocation[0] - dx);
        }
        else if (start > this.#separatorLocation[0]) {
            this.#separatorLocation[0] = Math.min(start, this.#separatorLocation[0] + dx);
        }
        if (stop > this.#separatorLocation[1]) {
            this.#separatorLocation[1] = Math.min(stop, this.#separatorLocation[1] + dx);
        }
        else if (stop < this.#separatorLocation[1]) {
            this.#separatorLocation[1] = Math.max(stop, this.#separatorLocation[1] - dx);
        }
        else {
            return false;
        }
        if (this.#separatorLocation[1] <= this.#separatorLocation[0] + 1) {
            this.#separatorLocation[1] = Math.min(stop, this.#separatorLocation[0] + 1);
        }
        return true;
    }
    render(viewport) {
        viewport.registerTick();
        const remainingSize = viewport.contentSize.mutableCopy();
        const tabInfo = [];
        const separatorWidths = [];
        let x = this.#border ? 2 : 0, tabHeight = 0;
        this.tabTitles.forEach((tab, index) => {
            const tabRect = new geometry_1.Rect(new geometry_1.Point(x, 0), tab.naturalSize(remainingSize));
            tabInfo.push([tabRect, tab]);
            remainingSize.width -= tabRect.size.width;
            if (this.#separatorLocation === undefined &&
                this.#selectedTab === index) {
                this.#separatorLocation = [x, x + tabRect.size.width];
            }
            x += tabRect.size.width;
            tabHeight = Math.max(tabHeight, tabRect.size.height - TAB_SEPARATOR_HEIGHT);
            separatorWidths.push(tabRect.size.width);
        });
        this.#selectedTab = Math.min(separatorWidths.length - 1, this.#selectedTab);
        this.#separatorWidths = separatorWidths;
        if (this.#separatorLocation) {
            this.#renderSeparator(viewport, tabHeight, separatorWidths, this.#separatorLocation);
        }
        if (this.#border) {
            const borderRect = viewport.contentRect.inset(tabHeight + TAB_SEPARATOR_HEIGHT - 1, 0, 0);
            viewport.clipped(borderRect, inner => this.#renderBorder(inner, this.#separatorWidths));
        }
        tabInfo.forEach(([tabRect, tab]) => {
            viewport.clipped(tabRect, inner => tab.render(inner));
        });
        const selectedTab = this.tabs.at(this.#selectedTab);
        if (selectedTab) {
            const childRect = viewport.contentRect.inset(tabHeight + TAB_SEPARATOR_HEIGHT, this.#border ? 1 : 0, this.#border ? 1 : 0);
            viewport.clipped(childRect, inner => {
                selectedTab.render(inner);
            });
        }
    }
    #renderBorder(viewport, separatorWidths) {
        const totalWidth = separatorWidths.reduce((a, b) => a + b, 2);
        for (let x = viewport.contentSize.width - 2; x > 0; x--) {
            if (x === totalWidth) {
                viewport.write('╶', new geometry_1.Point(x, 0));
            }
            else if (x > totalWidth) {
                viewport.write('─', new geometry_1.Point(x, 0));
            }
            viewport.write('─', new geometry_1.Point(x, viewport.contentSize.height - 1));
        }
        for (let y = viewport.contentSize.height - 2; y > 0; y--) {
            viewport.write('│', new geometry_1.Point(0, y));
            viewport.write('│', new geometry_1.Point(viewport.contentSize.width - 1, y));
        }
        viewport.write('┌╴', new geometry_1.Point(0, 0));
        viewport.write('┐', new geometry_1.Point(viewport.contentSize.width - 1, 0));
        viewport.write('└', new geometry_1.Point(0, viewport.contentSize.height - 1));
        viewport.write('┘', new geometry_1.Point(viewport.contentSize.width - 1, viewport.contentSize.height - 1));
    }
    #renderSeparator(viewport, tabHeight, separatorWidths, separatorLocation) {
        // separatorLocation is rounded down in this function
        let xLeft = this.#border ? 2 : 0, xRight = 0, didDrawSeparator = false;
        const [separatorStart, separatorStop] = [
            ~~separatorLocation[0] + xLeft,
            ~~separatorLocation[1] + xLeft,
        ];
        separatorWidths.forEach((separatorWidth, index) => {
            const tab = this.tabs.at(index);
            const isHover = tab?.isHover ?? false;
            xRight = xLeft + separatorWidth;
            let underline;
            if (xLeft >= separatorStart && xLeft <= separatorStop) {
                const xMid = Math.min(separatorStop, xRight);
                const u1 = '━'.repeat(xMid - xLeft);
                const u2 = dashesLeft(xRight - separatorStop, isHover);
                underline = u1 + u2;
                didDrawSeparator = false;
            }
            else if (xRight >= separatorStart && xLeft < separatorStop) {
                const xMid = Math.min(separatorStop, xRight);
                const u0 = dashesRight(separatorStart - xLeft, isHover);
                const u1 = '━'.repeat(xMid - separatorStart);
                const u2 = dashesLeft(xRight - separatorStop, isHover);
                underline = u0 + u1 + u2;
                didDrawSeparator = xRight > separatorStop;
            }
            else if (didDrawSeparator) {
                underline = dashesLeft(separatorWidth, isHover);
                didDrawSeparator = false;
            }
            else if (xRight === separatorStart) {
                underline = dashesRight(separatorWidth, isHover);
            }
            else {
                underline = dashes(separatorWidth, isHover);
            }
            viewport.write(underline, new geometry_1.Point(xLeft, tabHeight));
            xLeft += separatorWidth;
        });
    }
}
exports.Tabs = Tabs;
class TabTitle extends Container_1.Container {
    #textView;
    onClick;
    constructor(title) {
        super({});
        this.#textView = new Text_1.Text({
            text: title ?? '',
            style: this.titleStyle,
        });
        this.add(this.#textView);
    }
    get title() {
        return this.#textView.text;
    }
    set title(value) {
        this.#textView.text = value;
    }
    get titleStyle() {
        return new Style_1.Style({ bold: this.isHover });
    }
    naturalSize(available) {
        return this.#textView
            .naturalSize(available)
            .grow(TAB_TITLE_PAD, TAB_SEPARATOR_HEIGHT);
    }
    receiveMouse(event, system) {
        super.receiveMouse(event, system);
        if ((0, events_1.isMouseClicked)(event)) {
            this.onClick?.(this);
        }
        this.#textView.style = this.titleStyle;
    }
    render(viewport) {
        viewport.registerMouse(['mouse.button.left', 'mouse.move']);
        viewport.clipped(new geometry_1.Rect([1, 0], viewport.contentSize.shrink(TAB_TITLE_PAD, 0)), inner => {
            this.#textView.render(inner);
        });
    }
}
class Section extends Container_1.Container {
    titleView = new TabTitle('');
    static create(title, child, extraProps = {}) {
        return new Section({ title, child, ...extraProps });
    }
    constructor({ title, ...props }) {
        super(props);
        this.titleView.title = title ?? '';
        (0, util_1.define)(this, 'title', { enumerable: true });
    }
    get title() {
        return this.titleView.title;
    }
    set title(value) {
        this.titleView.title = value;
    }
}
function dashesLeft(w, isHover) {
    if (w <= 0) {
        return '';
    }
    return (isHover ? '╺' : '╶') + dashes(w - 1, isHover);
}
function dashesRight(w, isHover) {
    if (w <= 0) {
        return '';
    }
    return dashes(w - 1, isHover) + (isHover ? '╸' : '╴');
}
function dashes(w, isHover) {
    if (w <= 0) {
        return '';
    }
    return (isHover ? '━' : '─').repeat(w);
}
Tabs.Section = Section;
const TAB_TITLE_PAD = 2;
const TAB_SEPARATOR_HEIGHT = 1;
//# sourceMappingURL=Tabs.js.map