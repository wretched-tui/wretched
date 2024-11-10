import { Container, type Props as ContainerProps } from '../Container';
import { Size } from '../geometry';
import { Style } from '../Style';
import { View } from '../View';
import { Viewport } from '../Viewport';
import { System } from '../System';
import { type MouseEvent } from '../events';
interface Props extends ContainerProps {
    /**
     * Draw a border around the content.
     * @default true
     */
    border?: boolean;
}
interface TabProps extends ContainerProps {
    title?: string;
}
export declare class Tabs extends Container {
    #private;
    static Section: typeof Section;
    static create(tabs: ([string, View] | Section)[], extraProps?: Props): Tabs;
    constructor(props?: Props);
    get tabs(): Section[];
    get tabTitles(): TabTitle[];
    update(props: Props): void;
    addTab(tab: Section): void;
    addTab(title: string, child: View): void;
    add(child: View, at?: number): void;
    removeChild(child: View): void;
    naturalSize(available: Size): Size;
    receiveTick(dt: number): boolean;
    render(viewport: Viewport): void;
}
declare class TabTitle extends Container {
    #private;
    onClick: ((tab: TabTitle) => void) | undefined;
    constructor(title: string);
    get title(): string;
    set title(value: string);
    get titleStyle(): Style;
    naturalSize(available: Size): Size;
    receiveMouse(event: MouseEvent, system: System): void;
    render(viewport: Viewport): void;
}
declare class Section extends Container {
    readonly titleView: TabTitle;
    static create(title: string, child: View, extraProps?: Omit<TabProps, 'title' | 'view'>): Section;
    constructor({ title, ...props }: TabProps);
    get title(): string;
    set title(value: string);
}
export {};
