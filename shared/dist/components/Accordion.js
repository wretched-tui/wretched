"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accordion = void 0;
const Container_1 = require("../Container");
const geometry_1 = require("../geometry");
const Text_1 = require("./Text");
const events_1 = require("../events");
const Style_1 = require("../Style");
const util_1 = require("../util");
// accordion = new Accordion()
// accordion.addSection('title1', section1)
// accordion.addSection(new Text({text: 'title2', style: …}), section2)
//
// accordion = Accordion.create([
//   ['title1', section1],
//   ['title2', section2],
//   Accordion.Section('title3', section3),
// ])
//
// accordion.add(new Section()) // well behaved
// accordion.add(new View()) // undefined behaviour
class Accordion extends Container_1.Container {
    static Section;
    #multiple = false;
    static create(sections, extraProps = {}) {
        const accordion = new Accordion(extraProps);
        for (const section of sections) {
            if (section instanceof Section) {
                accordion.addSection(section);
            }
            else {
                const [title, view] = section;
                accordion.addSection(title, view);
            }
        }
        return accordion;
    }
    constructor(props = {}) {
        super(props);
        this.#update(props);
    }
    update(props) {
        this.#update(props);
        super.update(props);
    }
    #update({ multiple }) {
        this.#multiple = multiple ?? false;
    }
    get sections() {
        return this.children.filter(view => view instanceof Section);
    }
    #sectionDidChange(toggleSection, isOpen) {
        if (this.#multiple || !isOpen) {
            return;
        }
        for (const section of this.sections) {
            if (toggleSection === section) {
                continue;
            }
            section.close();
        }
    }
    addSection(titleOrSection, view) {
        let sectionView;
        if (titleOrSection instanceof Section) {
            sectionView = titleOrSection;
        }
        else {
            sectionView = Section.create(titleOrSection, view);
        }
        this.add(sectionView);
    }
    add(child, at) {
        if (child instanceof Section) {
            child.onClick = this.#sectionDidChange.bind(this);
            if (!this.#multiple && child.isOpen) {
                this.sections.forEach(section => (section.isOpen = false));
            }
        }
        super.add(child, at);
    }
    naturalSize(available) {
        let remainingSize = available.mutableCopy();
        return this.sections.reduce((size, section) => {
            const sectionSize = section.naturalSize(remainingSize);
            remainingSize.height = Math.max(0, remainingSize.height - sectionSize.height);
            return size.growHeight(sectionSize);
        }, geometry_1.Size.zero.mutableCopy());
    }
    render(viewport) {
        const remainingSize = viewport.contentSize.mutableCopy();
        let y = 0;
        for (const section of this.sections) {
            if (y >= viewport.contentSize.height) {
                break;
            }
            const sectionSize = section.naturalSize(remainingSize);
            remainingSize.height -= sectionSize.height;
            viewport.clipped(new geometry_1.Rect([0, y], [remainingSize.width, sectionSize.height]), inner => {
                section.render(inner);
            });
            y += sectionSize.height;
        }
    }
}
exports.Accordion = Accordion;
class Section extends Container_1.Container {
    #isOpen = false;
    onClick;
    #currentViewHeight = 0;
    #actualViewHeight = 0;
    #titleView;
    static create(title, child, extraProps = {}) {
        return new Section({ title, child, ...extraProps });
    }
    constructor({ title, isOpen, ...props }) {
        super(props);
        this.#isOpen = isOpen ?? false;
        this.#titleView = new Text_1.Text({
            text: title ?? '',
            style: this.titleStyle,
        });
        this.#update({ isOpen });
        this.add(this.#titleView);
        (0, util_1.define)(this, 'title', { enumerable: true });
    }
    get title() {
        return this.#titleView.text;
    }
    set title(value) {
        this.#titleView.text = value;
    }
    get isOpen() {
        return this.#isOpen;
    }
    set isOpen(value) {
        if (this.#isOpen === value) {
            return;
        }
        this.#isOpen = value;
        this.#titleView.style = this.titleStyle;
        this.onClick?.(this, value);
    }
    get titleStyle() {
        return new Style_1.Style({ underline: true, bold: this.#isOpen || this.isHover });
    }
    open() {
        this.isOpen = true;
    }
    close() {
        this.isOpen = false;
    }
    update(props) {
        this.#update(props);
        super.update(props);
    }
    #update({ isOpen, onClick }) {
        this.#isOpen = isOpen ?? false;
        this.onClick = onClick;
    }
    naturalSize(available) {
        // 4 => left margin, right space/arrow/space
        // 1 => bottom separator
        const collapsedSize = this.#titleView.naturalSize(available).grow(4, 1);
        const remainingSize = available.shrink(0, collapsedSize.height);
        // 1 => left margin (no right margin)
        let width = 0;
        let height = 0;
        const children = this.children.filter(child => child !== this.#titleView);
        for (const child of children) {
            if (!child.isVisible) {
                continue;
            }
            const naturalSize = child.naturalSize(remainingSize);
            width = Math.max(width, naturalSize.width);
            height = Math.max(height, naturalSize.height);
        }
        width += 1;
        const viewSize = new geometry_1.Size(width, height);
        return this.#currentSize(collapsedSize, viewSize);
    }
    #currentSize(collapsedSize, viewSize) {
        if (this.#actualViewHeight === 0) {
            this.#currentViewHeight = this.#isOpen ? viewSize.height : 0;
        }
        this.#actualViewHeight = viewSize.height;
        return new geometry_1.Size(Math.max(viewSize.width, collapsedSize.width), collapsedSize.height + Math.round(this.#currentViewHeight));
    }
    receiveMouse(event, system) {
        super.receiveMouse(event, system);
        if ((0, events_1.isMouseClicked)(event)) {
            this.#isOpen = !this.#isOpen;
            this.onClick?.(this, this.#isOpen);
        }
        this.#titleView.style = this.titleStyle;
    }
    receiveTick(dt) {
        if (this.#actualViewHeight === 0) {
            this.#currentViewHeight = 0;
            return false;
        }
        const amount = dt / 25;
        let nextHeight;
        if (this.#isOpen) {
            nextHeight = Math.min(this.#actualViewHeight, this.#currentViewHeight + amount);
        }
        else {
            nextHeight = Math.max(0, this.#currentViewHeight - amount);
        }
        this.#currentViewHeight = nextHeight;
        this.invalidateSize();
        return true;
    }
    render(viewport) {
        if (this.#currentViewHeight !== (this.#isOpen ? this.#actualViewHeight : 0)) {
            viewport.registerTick();
        }
        viewport.registerMouse(['mouse.button.left', 'mouse.move']);
        const textStyle = this.theme.text();
        const textSize = this.#titleView
            .naturalSize(viewport.contentSize)
            .mutableCopy();
        textSize.width = Math.max(0, Math.min(viewport.contentSize.width - 4, textSize.width));
        viewport.clipped(geometry_1.Rect.zero.atX(1).withSize(viewport.contentSize.width, textSize.height), inner => {
            this.#titleView.render(inner);
        });
        if (this.#currentViewHeight > 0) {
            viewport.clipped(geometry_1.Rect.zero
                .atY(textSize.height)
                .withSize(viewport.contentSize.width, this.#currentViewHeight), inner => {
                const children = this.children.filter(child => child !== this.#titleView);
                for (const child of children) {
                    if (!child.isVisible) {
                        continue;
                    }
                    child.render(viewport);
                }
            });
        }
        viewport.clipped(geometry_1.Rect.zero
            .at(viewport.contentSize.width - 3, 0)
            .withSize(viewport.contentSize.width, 1), textStyle, inner => {
            if (this.#currentViewHeight !==
                (this.#isOpen ? this.#actualViewHeight : 0)) {
                const arrows = this.isHover ? ARROWS.animateHover : ARROWS.animate;
                const index = Math.round((0, geometry_1.interpolate)(this.#currentViewHeight, [0, this.#actualViewHeight], [0, arrows.length - 1]));
                if (arrows[index]) {
                    inner.write(arrows[index], new geometry_1.Point(1, 0));
                }
            }
            else if (this.#isOpen) {
                inner.write(this.isHover ? ARROWS.openHover : ARROWS.open, new geometry_1.Point(1, 0));
            }
            else {
                inner.write(this.isHover ? ARROWS.closedHover : ARROWS.closed, new geometry_1.Point(1, 0));
            }
        });
        viewport.clipped(geometry_1.Rect.zero
            .at(0, viewport.contentSize.height - 1)
            .withSize(viewport.contentSize.width, 1), textStyle, inner => {
            inner.write(SEPARATOR.left, new geometry_1.Point(0, 0));
            if (inner.contentSize.width > 2) {
                const middle = SEPARATOR.middle.repeat(inner.contentSize.width - 2);
                inner.write(middle, new geometry_1.Point(1, 0));
            }
            inner.write(SEPARATOR.right, new geometry_1.Point(inner.contentSize.width - 1, 0));
        });
    }
}
Accordion.Section = Section;
const ARROWS = {
    open: '△',
    openHover: '▲',
    closed: '▽',
    closedHover: '▼',
    animate: ['▽', '◁', '△'],
    animateHover: ['▼', '◀︎', '▲'],
};
const SEPARATOR = { left: '╶', middle: '─', right: '╴' };
/* ▷▶︎ ◀︎◁ ▼▽ ▲△

 S͟e͟c͟t͟i͟o͟n͟ ͟1   ▽
╶─────────────╴
 S͟e͟c͟t͟i͟o͟n͟ ͟2   ▼  // hover
╶─────────────╴
 S͟e͟c͟t͟i͟o͟n͟ ͟3   △  // open
Content........
goes here......
╶─────────────╴
 S͟e͟c͟t͟i͟o͟n͟ ͟3   ▽   ◺ ◁ ◸ △ // animation
╶─────────────╴

*/
//# sourceMappingURL=Accordion.js.map