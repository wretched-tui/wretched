import React from 'react';
import type { Accordion as WrAccordion, Box as WrBox, Button as WrButton, Checkbox as WrCheckbox, Collapsible as WrCollapsible, CollapsibleText as WrCollapsibleText, ConsoleLog as WrConsoleLog, Digits as WrDigits, Drawer as WrDrawer, Stack as WrStack, Input as WrInput, Scrollable as WrScrollable, Separator as WrSeparator, Slider as WrSlider, Space as WrSpace, Tabs as WrTabs, ToggleGroup as WrToggleGroup, ViewProps } from 'wretched';
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
export declare function Br(): JSX.Element;
export declare function Checkbox(reactProps: CheckboxProps): JSX.Element;
export declare function CollapsibleText(reactProps: CollapsibleTextProps): JSX.Element;
export declare function ConsoleLog(reactProps: ConsoleProps): JSX.Element;
export declare function Digits(reactProps: DigitsProps): JSX.Element;
export declare function H1(reactProps: HeaderProps): JSX.Element;
export declare function H2(reactProps: HeaderProps): JSX.Element;
export declare function H3(reactProps: HeaderProps): JSX.Element;
export declare function H4(reactProps: HeaderProps): JSX.Element;
export declare function H5(reactProps: HeaderProps): JSX.Element;
export declare function H6(reactProps: HeaderProps): JSX.Element;
export declare function Input(reactProps: InputProps): JSX.Element;
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
export declare function Space(reactProps: SpaceProps): JSX.Element;
export declare function ToggleGroup(reactProps: ToggleGroupProps): JSX.Element;
interface TreeProps<T> extends ViewProps {
    data: T[];
    render: (datum: T) => React.ReactNode;
    getChildren?: (datum: T) => T[] | undefined;
    title: React.ReactNode | string;
}
export declare function Tree<T>(reactProps: TreeProps<T>): JSX.Element;
export declare function Box(reactProps: BoxProps): JSX.Element;
export declare function Button(reactProps: ButtonProps): JSX.Element;
export declare function Collapsible(reactProps: CollapsibleProps): JSX.Element;
interface Stack {
    (reactProps: StackProps): JSX.Element;
    down(reactProps: Omit<StackProps, 'direction'>): JSX.Element;
    up(reactProps: Omit<StackProps, 'direction'>): JSX.Element;
    left(reactProps: Omit<StackProps, 'direction'>): JSX.Element;
    right(reactProps: Omit<StackProps, 'direction'>): JSX.Element;
}
export declare const Stack: Stack;
export declare function Scrollable(reactProps: ScrollableProps): JSX.Element;
/**
 * <Style /> is similar to <Text/> but only allows inline styles (bold, etc).
 * Does not support align or wrap (block styles). Does not support 'font', because
 * font is not encodable via SGR codes (and that's how I'm styling and
 * concatenating the text nodes).
 */
export declare function Style(reactProps: StyleProps): JSX.Element;
/**
 * <Text /> is a container that sets the text properties of child TextLiterals
 * (font, style) and TextContainers (wrap, alignment)
 */
export declare function Text(reactProps: TextProps): JSX.Element;
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
export {};
