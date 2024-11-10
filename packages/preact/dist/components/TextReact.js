"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextStyle = exports.TextProvider = exports.TextContainer = exports.TextLiteral = void 0;
const wretched_1 = require("wretched");
// yeah I don't care about this namespace I just needed something to attach the JSDoc to
const DEFAULTS = {
    alignment: 'left',
    wrap: true,
    font: 'default',
};
/**
 * Used in the React reconciler for literal text JSX elements. They don't have any
 * props.
 */
class TextLiteral extends wretched_1.View {
    #text;
    constructor(text) {
        super({});
        this.#text = text;
        (0, wretched_1.define)(this, 'text', { enumerable: true });
    }
    update({ text, ...props }) {
        super.update(props);
        this.#update({ text });
    }
    #update({ text }) {
        this.#text = text ?? '';
    }
    styledText() {
        let style;
        for (let ancestorView = this.parent; Boolean(ancestorView); ancestorView = ancestorView && ancestorView.parent) {
            if (ancestorView instanceof TextStyle) {
                style = ancestorView.style;
                break;
            }
            if (ancestorView instanceof TextContainer) {
                break;
            }
        }
        if (style) {
            return style.toSGR(wretched_1.Style.NONE, this.#text);
        }
        return this.#text;
    }
    get text() {
        return this.#text;
    }
    set text(value) {
        this.#text = String(value);
        this.#invalidateTextContainer();
        this.invalidateSize();
    }
    #invalidateTextContainer() {
        let textContainer;
        for (let ancestorView = this.parent; Boolean(ancestorView); ancestorView = ancestorView && ancestorView.parent) {
            if (ancestorView instanceof TextContainer) {
                textContainer = ancestorView;
                break;
            }
        }
        textContainer?.invalidateText();
    }
    naturalSize() {
        return wretched_1.Size.zero;
    }
    render() { }
}
exports.TextLiteral = TextLiteral;
/**
 * Subsequent TextLiteral nodes are grouped into a TextContainer, which handles the
 * layout of child nodes. It gets its style, font, and alignment from the nearest
 * parent TextProvider.
 */
class TextContainer extends wretched_1.Container {
    #nodes = [];
    constructor() {
        super({});
    }
    get nodes() {
        return this.#nodes;
    }
    add(child, at) {
        if (child instanceof TextLiteral || child instanceof TextStyle) {
            child.parent = this;
        }
        this.#nodes.splice(at ?? this.#nodes.length, 0, child);
        if (this.screen) {
            this.#invalidateNodes();
        }
    }
    removeChild(child) {
        if (child instanceof TextLiteral) {
            child.parent = undefined;
        }
        const index = this.#nodes.indexOf(child);
        if (~index && index >= 0 && index < this.#nodes.length) {
            this.#nodes.splice(index, 1);
            if (this.screen) {
                this.#invalidateNodes();
            }
        }
    }
    didMount(screen) {
        super.didMount(screen);
        this.#invalidateNodes();
    }
    invalidateText() {
        let childIndex = 0;
        for (const nextChild of this.#nodesToChildren()) {
            const childView = this.children.at(childIndex);
            if (nextChild instanceof wretched_1.View) {
                childIndex += 1;
            }
            else {
                if (!(childView instanceof wretched_1.Text)) {
                    this.#invalidateNodes();
                    return;
                }
                childView.text = nextChild;
            }
        }
    }
    #invalidateNodes() {
        // ideally, we would not remove/add views that are in children and this.#nodes,
        // but in reality that turns out to be tedious, and it's hardly any trouble to
        // remove and re-add those views.
        super.removeAllChildren();
        for (const child of this.#nodesToChildren()) {
            if (child instanceof wretched_1.View) {
                super.add(child);
            }
            else {
                const textView = this.#createTextNode(child);
                super.add(textView);
            }
        }
    }
    #nodesToChildren() {
        const children = [];
        let textBuffer;
        const STOP = null;
        const flattenedNodes = this.#flatten(this.#nodes);
        for (const node of [...flattenedNodes, STOP]) {
            if (node instanceof TextLiteral) {
                textBuffer ??= '';
                textBuffer += node.styledText();
            }
            else {
                if (textBuffer !== undefined) {
                    children.push(textBuffer);
                    textBuffer = undefined;
                }
                if (node) {
                    children.push(node);
                }
            }
        }
        return children;
    }
    naturalSize(available) {
        const size = wretched_1.Size.zero.mutableCopy();
        const remaining = available.mutableCopy();
        for (const child of this.children) {
            const childSize = child.naturalSize(remaining);
            size.width = Math.max(size.width, childSize.width);
            size.height += childSize.height;
            remaining.height = Math.max(0, remaining.height - childSize.height);
        }
        return size;
    }
    render(viewport) {
        const remaining = viewport.contentSize.mutableCopy();
        let y = 0;
        for (const child of this.children) {
            if (!child.isVisible) {
                continue;
            }
            const childSize = child.naturalSize(remaining).mutableCopy();
            childSize.width = viewport.contentSize.width;
            remaining.height -= childSize.height;
            const childViewport = new wretched_1.Rect([0, y], childSize);
            viewport.clipped(childViewport, inner => child.render(inner));
            y += childSize.height;
        }
    }
    #createTextNode(text) {
        let textProvider;
        for (let ancestorView = this.parent; Boolean(ancestorView); ancestorView = ancestorView && ancestorView.parent) {
            if (ancestorView instanceof TextProvider) {
                textProvider = ancestorView;
                break;
            }
        }
        let textProps = DEFAULTS;
        if (textProvider) {
            textProps = { ...textProps, ...textProvider.textProps };
        }
        return new wretched_1.Text({
            text,
            ...textProps,
        });
    }
    #flatten(nodes) {
        return nodes.flatMap(node => {
            if (node instanceof TextContainer) {
                return this.#flatten(node.nodes);
            }
            if (node instanceof TextStyle) {
                return this.#flatten(node.children);
            }
            return [node];
        });
    }
}
exports.TextContainer = TextContainer;
/**
 * Intended to contain a single TextContainer. Provides the styling that is used to
 * create Text views.
 *
 * @example
 *     <Text align='left' bold>text</Text>
 */
class TextProvider extends wretched_1.Container {
    #style = wretched_1.Style.NONE;
    #font;
    #alignment;
    #wrap;
    constructor(props = {}) {
        super(props);
        this.#update(props);
    }
    get style() {
        return this.parentStyle.merge(this.#style);
    }
    get parentStyle() {
        let parentStyle;
        for (let ancestorView = this.parent; Boolean(ancestorView); ancestorView = ancestorView && ancestorView.parent) {
            if (ancestorView instanceof TextProvider) {
                parentStyle = ancestorView.style;
                break;
            }
        }
        return parentStyle ?? wretched_1.Style.NONE;
    }
    get textProps() {
        let parentProvider;
        for (let ancestorView = this.parent; Boolean(ancestorView); ancestorView = ancestorView && ancestorView.parent) {
            if (ancestorView instanceof TextProvider) {
                parentProvider = ancestorView;
                break;
            }
        }
        let retVal = {};
        if (parentProvider) {
            retVal = { ...parentProvider.textProps };
        }
        else {
            retVal = {};
        }
        retVal.style = this.#style;
        if (this.#alignment !== undefined) {
            retVal.alignment = this.#alignment;
        }
        if (this.#wrap !== undefined) {
            retVal.wrap = this.#wrap;
        }
        if (this.#font !== undefined) {
            retVal.font = this.#font;
        }
        return retVal;
    }
    update(props) {
        this.#update(props);
        super.update(props);
    }
    #update(props) {
        const { style, alignment, wrap, font, ...styleProps } = props;
        this.#style = new wretched_1.Style(styleProps).merge(style);
        this.#font = font;
        this.#alignment = alignment ?? 'left';
        this.#wrap = wrap ?? false;
    }
}
exports.TextProvider = TextProvider;
/**
 * Provides inline styles - doesn't support wrap or alignment.
 *
 * Also doesn't support 'font' because that's not encoded as an SGR code - but
 * ideally it would be supported.
 */
class TextStyle extends TextProvider {
    constructor(props) {
        super(props);
    }
}
exports.TextStyle = TextStyle;
//# sourceMappingURL=TextReact.js.map