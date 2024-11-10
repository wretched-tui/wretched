import { Accordion as WrAccordion, Box as WrBox, Button as WrButton, Checkbox as WrCheckbox, Collapsible as WrCollapsible, CollapsibleText as WrCollapsibleText, ConsoleLog as WrConsoleLog, Digits as WrDigits, Drawer as WrDrawer, ToggleGroup as WrToggleGroup, Input as WrInput, Scrollable as WrScrollable, Separator as WrSeparator, Slider as WrSlider, Space as WrSpace, Stack as WrStack, Tabs as WrTabs, ViewProps } from 'wretched';
import { TextProvider, TextStyle } from './components/TextReact';
type Children = 'children' | 'child';
type WretchedView<T extends abstract new (arg: any, ...args: any) => any, OmitProps extends keyof ConstructorParameters<T>[0] = Children> = Omit<NonNullable<ConstructorParameters<T>[0]>, OmitProps>;
type WretchedContainer<T extends abstract new (arg: any, ...args: any) => any, ChildrenProps extends keyof NonNullable<ConstructorParameters<T>[0]> = Children> = WretchedView<T, ChildrenProps> & {
    [Key in ChildrenProps]?: React.ReactNode;
};
type CheckboxProps = WretchedView<typeof WrCheckbox>;
type CollapsibleTextProps = WretchedView<typeof WrCollapsibleText>;
type ConsoleProps = WretchedView<typeof WrConsoleLog>;
type DigitsProps = WretchedView<typeof WrDigits>;
type HeaderProps = {
    text?: string;
};
type InputProps = WretchedView<typeof WrInput>;
type SeparatorProps = WretchedView<typeof WrSeparator>;
type SliderProps = WretchedView<typeof WrSlider>;
type SpaceProps = WretchedView<typeof WrSpace>;
type ToggleGroupProps = WretchedView<typeof WrToggleGroup>;
type BoxProps = WretchedContainer<typeof WrBox>;
type ButtonProps = WretchedContainer<typeof WrButton>;
type CollapsibleProps = WretchedContainer<typeof WrCollapsible, 'collapsed' | 'expanded' | 'children'>;
type ScrollableProps = WretchedContainer<typeof WrScrollable>;
type StackProps = WretchedContainer<typeof WrStack>;
type StyleProps = WretchedContainer<typeof TextStyle>;
type TextProps = WretchedContainer<typeof TextProvider>;
type AccordionProps = WretchedContainer<typeof WrAccordion>;
type AccordionSectionProps = WretchedContainer<typeof WrAccordion.Section>;
type DrawerProps = WretchedContainer<typeof WrDrawer, 'content' | 'drawer' | 'children'>;
type TabsProps = WretchedContainer<typeof WrTabs>;
type TabsSectionProps = WretchedContainer<typeof WrTabs.Section>;
declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'wr-br': {};
            'wr-checkbox': CheckboxProps;
            'wr-collapsible-text': CollapsibleTextProps;
            'wr-console': ConsoleProps;
            'wr-digits': DigitsProps;
            'wr-h1': HeaderProps;
            'wr-h2': HeaderProps;
            'wr-h3': HeaderProps;
            'wr-h4': HeaderProps;
            'wr-h5': HeaderProps;
            'wr-h6': HeaderProps;
            'wr-input': InputProps;
            'wr-separator': SeparatorProps;
            'wr-slider': SliderProps;
            'wr-space': SpaceProps;
            'wr-toggle-group': ToggleGroupProps;
            'wr-tree': ViewProps;
            'wr-box': BoxProps;
            'wr-button': ButtonProps;
            'wr-collapsible': CollapsibleProps;
            'wr-scrollable': ScrollableProps;
            'wr-stack': StackProps;
            'wr-style': StyleProps;
            'wr-text': TextProps;
            'wr-accordion': AccordionProps;
            'wr-accordion-section': AccordionSectionProps;
            'wr-drawer': DrawerProps;
            'wr-tabs': TabsProps;
            'wr-tabs-section': TabsSectionProps;
        }
    }
}
export declare function H1(reactProps: HeaderProps): JSX.Element;
export declare function H2(reactProps: HeaderProps): JSX.Element;
export declare function H3(reactProps: HeaderProps): JSX.Element;
export declare function H4(reactProps: HeaderProps): JSX.Element;
export declare function H5(reactProps: HeaderProps): JSX.Element;
export declare function H6(reactProps: HeaderProps): JSX.Element;
interface Separator {
    (reactProps: SeparatorProps): JSX.Element;
    horizontal(reactProps: Omit<SeparatorProps, 'direction'>): JSX.Element;
    vertical(reactProps: Omit<SeparatorProps, 'direction'>): JSX.Element;
}
export declare const Separator: Separator;
interface Slider {
    (reactProps: SliderProps): JSX.Element;
    horizontal(reactProps: Omit<SliderProps, 'direction'>): JSX.Element;
    vertical(reactProps: Omit<SliderProps, 'direction'>): JSX.Element;
}
export declare const Slider: Slider;
interface Stack {
    (reactProps: StackProps): JSX.Element;
    down(reactProps: Omit<StackProps, 'direction'>): JSX.Element;
    up(reactProps: Omit<StackProps, 'direction'>): JSX.Element;
    left(reactProps: Omit<StackProps, 'direction'>): JSX.Element;
    right(reactProps: Omit<StackProps, 'direction'>): JSX.Element;
}
export declare const Stack: Stack;
interface Accordion {
    (reactProps: AccordionProps): JSX.Element;
    Section(reactProps: Omit<AccordionSectionProps, 'direction'>): JSX.Element;
}
export declare const Accordion: Accordion;
interface Drawer {
    (reactProps: DrawerProps): JSX.Element;
    top(reactProps: Omit<DrawerProps, 'location'>): JSX.Element;
    right(reactProps: Omit<DrawerProps, 'location'>): JSX.Element;
    bottom(reactProps: Omit<DrawerProps, 'location'>): JSX.Element;
    left(reactProps: Omit<DrawerProps, 'location'>): JSX.Element;
}
export declare const Drawer: Drawer;
interface Tabs {
    (reactProps: TabsProps): JSX.Element;
    Section(reactProps: Omit<TabsSectionProps, 'direction'>): JSX.Element;
}
export declare const Tabs: Tabs;
interface Separator {
    (reactProps: SeparatorProps): JSX.Element;
    horizontal(reactProps: Omit<SeparatorProps, 'direction'>): JSX.Element;
    vertical(reactProps: Omit<SeparatorProps, 'direction'>): JSX.Element;
}
export declare const Separator: Separator;
interface Slider {
    (reactProps: SliderProps): JSX.Element;
    horizontal(reactProps: Omit<SliderProps, 'direction'>): JSX.Element;
    vertical(reactProps: Omit<SliderProps, 'direction'>): JSX.Element;
}
export declare const Slider: Slider;
interface Stack {
    (reactProps: StackProps): JSX.Element;
    down(reactProps: Omit<StackProps, 'direction'>): JSX.Element;
    up(reactProps: Omit<StackProps, 'direction'>): JSX.Element;
    left(reactProps: Omit<StackProps, 'direction'>): JSX.Element;
    right(reactProps: Omit<StackProps, 'direction'>): JSX.Element;
}
export declare const Stack: Stack;
interface Accordion {
    (reactProps: AccordionProps): JSX.Element;
    Section(reactProps: Omit<AccordionSectionProps, 'direction'>): JSX.Element;
}
export declare const Accordion: Accordion;
interface Drawer {
    (reactProps: DrawerProps): JSX.Element;
    top(reactProps: Omit<DrawerProps, 'location'>): JSX.Element;
    right(reactProps: Omit<DrawerProps, 'location'>): JSX.Element;
    bottom(reactProps: Omit<DrawerProps, 'location'>): JSX.Element;
    left(reactProps: Omit<DrawerProps, 'location'>): JSX.Element;
}
export declare const Drawer: Drawer;
interface Tabs {
    (reactProps: TabsProps): JSX.Element;
    Section(reactProps: Omit<TabsSectionProps, 'direction'>): JSX.Element;
}
export declare const Tabs: Tabs;
export declare function run(component: React.ReactNode): Promise<void>;
export {};
