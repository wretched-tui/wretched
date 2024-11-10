"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tabs = exports.Drawer = exports.Accordion = exports.Stack = exports.Slider = exports.Separator = void 0;
exports.Br = Br;
exports.Checkbox = Checkbox;
exports.CollapsibleText = CollapsibleText;
exports.ConsoleLog = ConsoleLog;
exports.Digits = Digits;
exports.H1 = H1;
exports.H2 = H2;
exports.H3 = H3;
exports.H4 = H4;
exports.H5 = H5;
exports.H6 = H6;
exports.Input = Input;
exports.Space = Space;
exports.ToggleGroup = ToggleGroup;
exports.Tree = Tree;
exports.Box = Box;
exports.Button = Button;
exports.Collapsible = Collapsible;
exports.Scrollable = Scrollable;
exports.Style = Style;
exports.Text = Text;
exports.Br = Br;
exports.Checkbox = Checkbox;
exports.CollapsibleText = CollapsibleText;
exports.ConsoleLog = ConsoleLog;
exports.Digits = Digits;
exports.ToggleGroup = ToggleGroup;
exports.Input = Input;
exports.Space = Space;
exports.Tree = Tree;
exports.Box = Box;
exports.Button = Button;
exports.Collapsible = Collapsible;
exports.Scrollable = Scrollable;
exports.Style = Style;
exports.Text = Text;
exports.run = run;
const jsx_runtime_1 = require("preact/jsx-runtime");
const preact_1 = require("preact");
const wretched_1 = require("wretched");
const TextReact_1 = require("./components/TextReact");
////
/// Views
//
function Br() {
    return (0, jsx_runtime_1.jsx)("wr-br", {});
}
function Checkbox(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-checkbox", { ...reactProps });
}
function CollapsibleText(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-collapsible-text", { ...reactProps });
}
function ConsoleLog(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-console", { ...reactProps });
}
function Digits(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-digits", { ...reactProps });
}
function H1(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-h1", { ...reactProps });
}
function H2(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-h2", { ...reactProps });
}
function H3(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-h3", { ...reactProps });
}
function H4(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-h4", { ...reactProps });
}
function H5(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-h5", { ...reactProps });
}
function H6(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-h6", { ...reactProps });
}
function Input(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-input", { ...reactProps });
}
const Separator = function Separator(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-separator", { ...reactProps });
};
exports.Separator = Separator;
exports.Separator.horizontal = function SeparatorHorizontal(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-separator", { direction: "horizontal", ...reactProps });
};
exports.Separator.vertical = function SeparatorHorizontal(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-separator", { direction: "vertical", ...reactProps });
};
const Slider = function Slider(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-slider", { ...reactProps });
};
exports.Slider = Slider;
exports.Slider.horizontal = function SliderHorizontal(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-slider", { direction: "horizontal", ...reactProps });
};
exports.Slider.vertical = function SliderHorizontal(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-slider", { direction: "vertical", ...reactProps });
};
function Space(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-space", { ...reactProps });
}
function ToggleGroup(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-toggle-group", { ...reactProps });
}
function Tree(reactProps) {
    const { title, ...props } = reactProps;
    const titleView = useMemo(() => {
        if (typeof title === 'string') {
            return (0, jsx_runtime_1.jsx)("wr-text", { children: title });
        }
        return title;
    }, [title]);
    return (0, jsx_runtime_1.jsx)("wr-tree", { ...props, children: titleView });
}
////
/// "Simple" containers
//
function Box(reactProps) {
    const { children, ...props } = reactProps;
    return (0, jsx_runtime_1.jsx)("wr-box", { ...props, children: children });
}
function Button(reactProps) {
    const { children, ...props } = reactProps;
    return (0, jsx_runtime_1.jsx)("wr-button", { ...props, children: children });
}
function Collapsible(reactProps) {
    const { collapsed, expanded, ...props } = reactProps;
    return ((0, jsx_runtime_1.jsxs)("wr-collapsible", { ...props, children: [collapsed, expanded] }));
}
const Stack = function Stack(reactProps) {
    const { children, ...props } = reactProps;
    return (0, jsx_runtime_1.jsx)("wr-stack", { ...props, children: children });
};
exports.Stack = Stack;
exports.Stack.down = function StackLeft(reactProps) {
    const { children, ...props } = reactProps;
    return ((0, jsx_runtime_1.jsx)("wr-stack", { direction: "down", ...props, children: children }));
};
exports.Stack.up = function StackLeft(reactProps) {
    const { children, ...props } = reactProps;
    return ((0, jsx_runtime_1.jsx)("wr-stack", { direction: "up", ...props, children: children }));
};
exports.Stack.right = function StackLeft(reactProps) {
    const { children, ...props } = reactProps;
    return ((0, jsx_runtime_1.jsx)("wr-stack", { direction: "right", ...props, children: children }));
};
exports.Stack.left = function StackLeft(reactProps) {
    const { children, ...props } = reactProps;
    return ((0, jsx_runtime_1.jsx)("wr-stack", { direction: "left", ...props, children: children }));
};
function Scrollable(reactProps) {
    const { children, ...props } = reactProps;
    return (0, jsx_runtime_1.jsx)("wr-scrollable", { ...props, children: children });
}
/**
 * <Style /> is similar to <Text/> but only allows inline styles (bold, etc).
 * Does not support align or wrap (block styles). Does not support 'font', because
 * font is not encodable via SGR codes (and that's how I'm styling and
 * concatenating the text nodes).
 */
function Style(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-style", { ...reactProps });
}
/**
 * <Text /> is a container that sets the text properties of child TextLiterals
 * (font, style) and TextContainers (wrap, alignment)
 */
function Text(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-text", { ...reactProps });
}
const Accordion = function Accordion(reactProps) {
    const { children, ...props } = reactProps;
    return (0, jsx_runtime_1.jsx)("wr-accordion", { ...props, children: children });
};
exports.Accordion = Accordion;
exports.Accordion.Section = function SliderHorizontal(reactProps) {
    const { children, ...props } = reactProps;
    return (0, jsx_runtime_1.jsx)("wr-accordion-section", { ...props, children: children });
};
const Drawer = function Drawer(reactProps) {
    const { children, content, drawer, ...props } = reactProps;
    return ((0, jsx_runtime_1.jsxs)("wr-drawer", { ...props, children: [content, drawer, children] }));
};
exports.Drawer = Drawer;
exports.Drawer.top = function DrawerLeft(reactProps) {
    const { children, content, drawer, ...props } = reactProps;
    return ((0, jsx_runtime_1.jsxs)("wr-drawer", { location: "top", ...props, children: [content, drawer, children] }));
};
exports.Drawer.right = function DrawerLeft(reactProps) {
    const { children, content, drawer, ...props } = reactProps;
    return ((0, jsx_runtime_1.jsxs)("wr-drawer", { location: "right", ...props, children: [content, drawer, children] }));
};
exports.Drawer.bottom = function DrawerLeft(reactProps) {
    const { children, ...props } = reactProps;
    return ((0, jsx_runtime_1.jsx)("wr-drawer", { location: "bottom", ...props, children: children }));
};
exports.Drawer.left = function DrawerLeft(reactProps) {
    const { children, ...props } = reactProps;
    return ((0, jsx_runtime_1.jsx)("wr-drawer", { location: "left", ...props, children: children }));
};
const Tabs = function Tabs(reactProps) {
    const { children, ...props } = reactProps;
    return (0, jsx_runtime_1.jsx)("wr-tabs", { ...props, children: children });
};
exports.Tabs = Tabs;
exports.Tabs.Section = function SliderHorizontal(reactProps) {
    const { children, ...props } = reactProps;
    return (0, jsx_runtime_1.jsx)("wr-tabs-section", { ...props, children: children });
};
function createView(type, props) {
    switch (type) {
        case 'text':
            return new TextReact_1.TextLiteral(String(props.text) ?? '');
        case 'br':
        case 'wr-br':
            return new TextReact_1.TextLiteral('\n');
        case 'wr-checkbox':
            return new wretched_1.Checkbox(props);
        case 'wr-collapsible-text':
            return new wretched_1.CollapsibleText(props);
        case 'wr-console':
            return new wretched_1.ConsoleLog(props);
        case 'wr-digits':
            return new wretched_1.Digits(props);
        case 'wr-toggle-group':
            return new wretched_1.ToggleGroup(props);
        case 'wr-input':
            return new wretched_1.Input(props);
        case 'wr-literal':
            return new TextReact_1.TextLiteral(props.text ?? '');
        case 'wr-separator':
            return new wretched_1.Separator(props);
        case 'wr-slider':
            return new wretched_1.Slider(props);
        case 'wr-space':
            return new wretched_1.Space(props);
        // case 'Tree':
        //   return
        case 'wr-box':
            return new wretched_1.Box(props);
        case 'wr-button':
            return new wretched_1.Button(props);
        case 'wr-collapsible':
            return new wretched_1.Collapsible(props);
        case 'wr-scrollable':
            return new wretched_1.Scrollable(props);
        case 'wr-stack':
            return new wretched_1.Stack(props);
        case 'wr-style':
            return new TextReact_1.TextStyle(props);
        case 'wr-text':
            return new TextReact_1.TextProvider(props);
        case 'wr-accordion':
            return new wretched_1.Accordion(props);
        case 'wr-accordion-section':
            return new wretched_1.Accordion.Section(props);
        case 'wr-drawer':
            return new wretched_1.Drawer(props);
        case 'wr-tabs':
            return new wretched_1.Tabs(props);
        case 'wr-tabs-section':
            return new wretched_1.Tabs.Section(props);
        case 'wr-window':
            return new wretched_1.Window(props);
        default:
            throw Error(`Unknown type ${type}`);
    }
}
////
/// Views
//
function Br() {
    return (0, jsx_runtime_1.jsx)("wr-br", {});
}
function Checkbox(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-checkbox", { ...reactProps });
}
function CollapsibleText(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-collapsible-text", { ...reactProps });
}
function ConsoleLog(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-console", { ...reactProps });
}
function Digits(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-digits", { ...reactProps });
}
function ToggleGroup(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-toggle-group", { ...reactProps });
}
function Input(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-input", { ...reactProps });
}
const Separator = function Separator(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-separator", { ...reactProps });
};
exports.Separator = Separator;
exports.Separator.horizontal = function SeparatorHorizontal(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-separator", { direction: "horizontal", ...reactProps });
};
exports.Separator.vertical = function SeparatorHorizontal(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-separator", { direction: "vertical", ...reactProps });
};
const Slider = function Slider(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-slider", { ...reactProps });
};
exports.Slider = Slider;
exports.Slider.horizontal = function SliderHorizontal(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-slider", { direction: "horizontal", ...reactProps });
};
exports.Slider.vertical = function SliderHorizontal(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-slider", { direction: "vertical", ...reactProps });
};
function Space(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-space", { ...reactProps });
}
function Tree(reactProps) {
    const { title, ...props } = reactProps;
    const titleView = useMemo(() => {
        if (typeof title === 'string') {
            return (0, jsx_runtime_1.jsx)("wr-text", { children: title });
        }
        return title;
    }, [title]);
    return (0, jsx_runtime_1.jsx)("wr-tree", { ...props, children: titleView });
}
////
/// "Simple" containers
//
function Box(reactProps) {
    const { children, ...props } = reactProps;
    return (0, jsx_runtime_1.jsx)("wr-box", { ...props, children: children });
}
function Button(reactProps) {
    const { children, ...props } = reactProps;
    return (0, jsx_runtime_1.jsx)("wr-button", { ...props, children: children });
}
function Collapsible(reactProps) {
    const { collapsed, expanded, ...props } = reactProps;
    return ((0, jsx_runtime_1.jsxs)("wr-collapsible", { ...props, children: [collapsed, expanded] }));
}
const Stack = function Stack(reactProps) {
    const { children, ...props } = reactProps;
    return (0, jsx_runtime_1.jsx)("wr-stack", { ...props, children: children });
};
exports.Stack = Stack;
exports.Stack.down = function StackLeft(reactProps) {
    const { children, ...props } = reactProps;
    return ((0, jsx_runtime_1.jsx)("wr-stack", { direction: "down", ...props, children: children }));
};
exports.Stack.up = function StackLeft(reactProps) {
    const { children, ...props } = reactProps;
    return ((0, jsx_runtime_1.jsx)("wr-stack", { direction: "up", ...props, children: children }));
};
exports.Stack.right = function StackLeft(reactProps) {
    const { children, ...props } = reactProps;
    return ((0, jsx_runtime_1.jsx)("wr-stack", { direction: "right", ...props, children: children }));
};
exports.Stack.left = function StackLeft(reactProps) {
    const { children, ...props } = reactProps;
    return ((0, jsx_runtime_1.jsx)("wr-stack", { direction: "left", ...props, children: children }));
};
function Scrollable(reactProps) {
    const { children, ...props } = reactProps;
    return (0, jsx_runtime_1.jsx)("wr-scrollable", { ...props, children: children });
}
/**
 * <Style /> is similar to <Text/> but only allows inline styles (bold, etc).
 * Does not support align or wrap (block styles). Does not support 'font', because
 * font is not encodable via SGR codes (and that's how I'm styling and
 * concatenating the text nodes).
 */
function Style(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-style", { ...reactProps });
}
/**
 * <Text /> is a container that sets the text properties of child TextLiterals
 * (font, style) and TextContainers (wrap, alignment)
 */
function Text(reactProps) {
    return (0, jsx_runtime_1.jsx)("wr-text", { ...reactProps });
}
const Accordion = function Accordion(reactProps) {
    const { children, ...props } = reactProps;
    return (0, jsx_runtime_1.jsx)("wr-accordion", { ...props, children: children });
};
exports.Accordion = Accordion;
exports.Accordion.Section = function SliderHorizontal(reactProps) {
    const { children, ...props } = reactProps;
    return (0, jsx_runtime_1.jsx)("wr-accordion-section", { ...props, children: children });
};
const Drawer = function Drawer(reactProps) {
    const { children, content, drawer, ...props } = reactProps;
    return ((0, jsx_runtime_1.jsxs)("wr-drawer", { ...props, children: [content, drawer, children] }));
};
exports.Drawer = Drawer;
exports.Drawer.top = function DrawerLeft(reactProps) {
    const { children, content, drawer, ...props } = reactProps;
    return ((0, jsx_runtime_1.jsxs)("wr-drawer", { location: "top", ...props, children: [content, drawer, children] }));
};
exports.Drawer.right = function DrawerLeft(reactProps) {
    const { children, content, drawer, ...props } = reactProps;
    return ((0, jsx_runtime_1.jsxs)("wr-drawer", { location: "right", ...props, children: [content, drawer, children] }));
};
exports.Drawer.bottom = function DrawerLeft(reactProps) {
    const { children, ...props } = reactProps;
    return ((0, jsx_runtime_1.jsx)("wr-drawer", { location: "bottom", ...props, children: children }));
};
exports.Drawer.left = function DrawerLeft(reactProps) {
    const { children, ...props } = reactProps;
    return ((0, jsx_runtime_1.jsx)("wr-drawer", { location: "left", ...props, children: children }));
};
const Tabs = function Tabs(reactProps) {
    const { children, ...props } = reactProps;
    return (0, jsx_runtime_1.jsx)("wr-tabs", { ...props, children: children });
};
exports.Tabs = Tabs;
exports.Tabs.Section = function SliderHorizontal(reactProps) {
    const { children, ...props } = reactProps;
    return (0, jsx_runtime_1.jsx)("wr-tabs-section", { ...props, children: children });
};
const defer = Promise.prototype.then.bind(Promise.resolve());
function removeFromTextContainer(container, child) {
    // find TextContainer with child in it, and remove
    for (const node of container.children) {
        if (node instanceof TextReact_1.TextContainer && node.children.includes(child)) {
            node.removeChild(child);
            if (node.children.length === 0) {
                container.removeChild(node);
            }
            return;
        }
    }
}
function removeChild(container, child) {
    if (child.parent === container) {
        container.removeChild(child);
    }
    else if (child instanceof TextReact_1.TextLiteral || child instanceof TextReact_1.TextStyle) {
        removeFromTextContainer(container, child);
    }
}
function appendChild(parentInstance, child, before) {
    if (parentInstance instanceof TextReact_1.TextStyle &&
        (child instanceof TextReact_1.TextLiteral || child instanceof TextReact_1.TextStyle)) {
        // do not do the TextContainer song and dance
    }
    else if (child instanceof TextReact_1.TextLiteral || child instanceof TextReact_1.TextStyle) {
        // if last child of parentInstance is TextContainer, use it, otherwise create new one
        const lastChild = parentInstance.children.at(-1);
        let textContainer;
        if (lastChild instanceof TextReact_1.TextContainer) {
            textContainer = lastChild;
        }
        else {
            textContainer = new TextReact_1.TextContainer();
            parentInstance.add(textContainer);
        }
        textContainer.add(child);
        return;
    }
    let index = before
        ? parentInstance.children.indexOf(before)
        : -1;
    if (index === -1) {
        index = undefined;
    }
    parentInstance.add(child, index);
}
class RendererElement {
    renderer;
    localName;
    parentNode = null;
    nextSibling = null;
    previousSibling = null;
    firstChild = null;
    lastChild = null;
    props = {};
    prevProps;
    node;
    nodeType = '';
    constructor(renderer, localName) {
        this.renderer = renderer;
        this.localName = localName;
        this._commit = this._commit.bind(this);
    }
    set data(text) {
        this.setAttribute('text', String(text));
    }
    addEventListener(event, func) {
        this.setAttribute(`on${event}`, (...args) => this.l[event + false](...args));
    }
    setAttribute(name, value) {
        if (this.node && !this.prevProps) {
            this.prevProps = Object.assign({}, this.props);
            defer(this._commit);
        }
        this.props[name] = value;
    }
    removeAttribute(name) {
        delete this.props[name];
    }
    _attach() {
        return (this.node ||= this.renderer.create(this.localName, this.props));
    }
    _commit() {
        const state = this.node;
        const prev = this.prevProps;
        if (!state || !prev)
            return;
        this.prevProps = undefined;
        this.renderer.update(state, this.props);
    }
    insertBefore(child, before) {
        if (child.parentNode === this)
            this.removeChild(child);
        if (before) {
            const prev = before.previousSibling;
            child.previousSibling = prev;
            before.previousSibling = child;
            if (prev) {
                prev.nextSibling = child;
            }
            if (before == this.firstChild) {
                this.firstChild = child;
            }
        }
        else {
            const last = this.lastChild;
            child.previousSibling = last;
            this.lastChild = child;
            if (last)
                last.nextSibling = child;
            if (!this.firstChild)
                this.firstChild = child;
        }
        child.parentNode = this;
        child.nextSibling = before ?? null;
        this.renderer.insert(this._attach(), child._attach(), before && before._attach());
    }
    appendChild(child) {
        this.insertBefore(child);
    }
    removeChild(child) {
        if (this.firstChild === child)
            this.firstChild = child.nextSibling;
        if (this.lastChild === child)
            this.lastChild = child.previousSibling;
        child.parentNode = child.nextSibling = child.previousSibling = null;
        if (this.node && child.node) {
            this.renderer.remove(this.node, child.node);
        }
    }
}
function createRendererDom(renderer) {
    function createElement(type) {
        return new RendererElement(renderer, type);
    }
    function createElementNS(_, type) {
        return new RendererElement(renderer, type);
    }
    function createTextNode(text) {
        const node = createElement('text');
        node.props.text = String(text);
        return node;
    }
    function createRoot() {
        return createElement('wr-window');
    }
    return { createElement, createElementNS, createTextNode, createRoot };
}
const dom = createRendererDom({
    create(type, props) {
        return createView(type, props);
    },
    insert(parent, node, before) {
        if (!(parent instanceof wretched_1.Container)) {
            return;
        }
        appendChild(parent, node, before);
    },
    remove(parent, node) {
        if (!(parent instanceof wretched_1.Container)) {
            return;
        }
        removeChild(parent, node);
    },
    update(node, props) {
        if (node instanceof TextReact_1.TextLiteral) {
            node.update(props);
            node.text = props.text ?? '';
        }
        else {
            node.update(props);
        }
    },
});
Object.assign(global, { document: {} });
Object.assign(document, dom);
async function run(component) {
    const root = dom.createRoot();
    (0, preact_1.render)(component, root);
    const window = root.node;
    const start = await wretched_1.Screen.start(window);
    const [screen, _] = start;
}
//# sourceMappingURL=preact.js.map