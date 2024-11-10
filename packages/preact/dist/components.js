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
const jsx_runtime_1 = require("preact/jsx-runtime");
const react_1 = require("react");
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
    const titleView = (0, react_1.useMemo)(() => {
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
//# sourceMappingURL=components.js.map