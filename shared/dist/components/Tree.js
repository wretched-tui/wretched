"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = void 0;
const Stack_1 = require("./Stack");
const Container_1 = require("../Container");
const geometry_1 = require("../geometry");
const events_1 = require("../events");
const Style_1 = require("../Style");
const TREE_BULLET_WIDTH = 4;
class Tree extends Container_1.Container {
    #titleView;
    #data = [];
    #getChildren = () => [];
    #render = () => null;
    #expanded = new Set();
    #itemViews = new Map();
    #viewPaths = new Map();
    #contentView = Stack_1.Stack.down();
    constructor(props) {
        super(props);
        this.#update(props);
        this.add(this.#contentView);
    }
    update(props) {
        this.#update(props);
        super.update(props);
    }
    #update({ titleView, data, render, getChildren }) {
        if (titleView && titleView !== this.#titleView) {
            this.#titleView?.removeFromParent();
            this.add(titleView);
            this.#titleView = titleView;
        }
        this.#data = data;
        this.#getChildren = getChildren ?? (() => []);
        this.#render = render;
        this.#resetViews();
    }
    #resetViews() {
        const prevChildren = new Set([...this.#itemViews].map(([, child]) => child));
        this.#addViews(this.#data, prevChildren);
        for (const view of prevChildren) {
            view.removeFromParent();
        }
    }
    #addViews(data, prevChildren, count = { current: 0 }, pathPrefix = '', prevData = []) {
        for (let index = 0; index < data.length; index++) {
            const path = `${pathPrefix}.${index}`;
            const datum = data[index];
            const isExpanded = this.#isChildExpanded(path);
            const children = this.#getChildren(datum, path);
            const hasChildren = children ? children.length > 0 : false;
            const isLast = index === data.length - 1;
            const currentPathData = {
                isLast,
                isExpanded,
                hasChildren,
            };
            const pathData = [...prevData, currentPathData];
            let view = this.#itemViews.get(path);
            if (view) {
                view.pathData = pathData;
            }
            else {
                const itemView = this.#render(datum, path);
                view = new TreeChild({
                    view: itemView,
                    pathData,
                    onToggle: () => {
                        if (this.#expanded.has(path)) {
                            this.#expanded.delete(path);
                        }
                        else {
                            this.#expanded.add(path);
                        }
                        this.#resetViews();
                        this.#contentView.invalidateSize();
                    },
                });
                this.#itemViews.set(path, view);
                this.#viewPaths.set(view, path);
            }
            if (!view.parent) {
                this.#contentView.add(view, count.current);
            }
            count.current += 1;
            prevChildren.delete(view);
            if (isExpanded && children) {
                this.#addViews(children, prevChildren, count, path, pathData);
            }
        }
    }
    #isChildExpanded(path) {
        return this.#expanded.has(path);
    }
    naturalSize(available) {
        let titleSize = geometry_1.Size.zero;
        if (this.#titleView) {
            titleSize = this.#titleView.naturalSize(available);
        }
        const remainingSize = available.shrink(0, titleSize.height);
        const contentSize = this.#contentView.naturalSize(remainingSize);
        return new geometry_1.Size(Math.max(titleSize.width, contentSize.width), titleSize.height + contentSize.height);
    }
    render(viewport) {
        if (viewport.isEmpty) {
            return super.render(viewport);
        }
        const titleView = this.#titleView;
        const titleSize = titleView?.naturalSize(viewport.contentSize) ?? geometry_1.Size.zero;
        if (titleView) {
            viewport.clipped(new geometry_1.Rect(geometry_1.Point.zero, titleSize), inside => titleView.render(inside));
        }
        viewport.clipped(viewport.contentRect.inset({ top: titleSize.height }), inside => this.#contentView.render(inside));
    }
}
exports.Tree = Tree;
class TreeChild extends Container_1.Container {
    #pathData = [];
    #hasChildren = false;
    #onToggle = () => { };
    constructor({ pathData, onToggle, ...props }) {
        super({ ...props, child: props.view });
        this.#pathData = pathData;
        this.#hasChildren = pathData.at(-1)?.hasChildren ?? false;
        this.#onToggle = onToggle;
    }
    receiveMouse(event, system) {
        super.receiveMouse(event, system);
        if ((0, events_1.isMouseClicked)(event) && this.#hasChildren) {
            this.#onToggle();
            this.invalidateSize();
        }
    }
    set pathData(value) {
        this.#pathData = value;
        this.invalidateSize();
    }
    naturalSize(available) {
        const size = super.naturalSize(available).mutableCopy();
        size.width += TREE_BULLET_WIDTH * this.#pathData.length;
        return size;
    }
    render(viewport) {
        if (viewport.isEmpty) {
            return super.render(viewport);
        }
        if (this.#hasChildren) {
            viewport.registerMouse(['mouse.move', 'mouse.button.left']);
        }
        const treeSize = this.naturalSize(viewport.contentSize).shrink(TREE_BULLET_WIDTH * this.#pathData.length, 0);
        const treeRect = new geometry_1.Rect(new geometry_1.Point(TREE_BULLET_WIDTH * this.#pathData.length, 0), treeSize);
        let textStyle;
        if (this.isPressed || this.isHover) {
            textStyle = new Style_1.Style({ bold: true });
        }
        else {
            textStyle = Style_1.Style.NONE;
        }
        let firstLine = '', middleLine = '', lastLine = '';
        for (let index = 0; index < this.#pathData.length; index++) {
            const { hasChildren, isExpanded, isLast } = this.#pathData[index];
            if (index === this.#pathData.length - 1) {
                if (hasChildren) {
                    if (isLast) {
                        firstLine += '└';
                    }
                    else {
                        firstLine += '├';
                    }
                    if (isExpanded) {
                        if (this.isHover) {
                            firstLine += '─╴▾';
                        }
                        else if (this.isPressed) {
                            firstLine += '━╸▾';
                        }
                        else {
                            firstLine += '─╴▿';
                        }
                    }
                    else {
                        if (this.isHover) {
                            firstLine += '─╴▸';
                        }
                        else if (this.isPressed) {
                            firstLine += '━╸▸';
                        }
                        else {
                            firstLine += '─╴▹';
                        }
                    }
                }
                else {
                    if (isLast) {
                        firstLine += '└──╴';
                    }
                    else {
                        firstLine += '├──╴';
                    }
                }
                if (isLast) {
                    middleLine += '    ';
                    lastLine += '    ';
                }
                else {
                    middleLine += '│   ';
                    lastLine += '│   ';
                }
            }
            else if (isLast) {
                firstLine += '    ';
                middleLine += '    ';
                lastLine += '    ';
            }
            else {
                firstLine += '│   ';
                middleLine += '│   ';
                lastLine += '│   ';
            }
        }
        const origin = geometry_1.Point.zero;
        viewport.write(firstLine, origin, textStyle);
        for (let offsetY = 1; offsetY < treeSize.height - 1; offsetY++) {
            viewport.write(middleLine, origin.offset(0, offsetY));
        }
        if (treeSize.height > 1) {
            viewport.write(lastLine, origin.offset(0, treeSize.height - 1));
        }
        viewport.clipped(treeRect, inside => super.render(inside));
    }
}
//# sourceMappingURL=Tree.js.map