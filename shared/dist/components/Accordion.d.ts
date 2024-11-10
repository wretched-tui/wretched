import { Container, type Props as ContainerProps } from '../Container';
import { Size } from '../geometry';
import { View } from '../View';
import { Viewport } from '../Viewport';
import { System } from '../System';
import { type MouseEvent } from '../events';
import { Style } from '../Style';
interface Props extends ContainerProps {
    multiple?: boolean;
}
interface SectionProps extends ContainerProps {
    title?: string;
    isOpen?: boolean;
    onClick?: (section: Section, isOpen: boolean) => void;
}
export declare class Accordion extends Container {
    #private;
    static Section: typeof Section;
    static create(sections: ([string, View] | Section)[], extraProps?: Props): Accordion;
    constructor(props?: Props);
    update(props: Props): void;
    get sections(): Section[];
    addSection(title: string, view: View): void;
    addSection(section: Section): void;
    add(child: View, at?: number): void;
    naturalSize(available: Size): Size;
    render(viewport: Viewport): void;
}
declare class Section extends Container {
    #private;
    onClick: ((section: Section, isOpen: boolean) => void) | undefined;
    static create(title: string, child: View, extraProps?: Omit<SectionProps, 'title' | 'view'>): Section;
    constructor({ title, isOpen, ...props }: SectionProps);
    get title(): string;
    set title(value: string);
    get isOpen(): boolean;
    set isOpen(value: boolean);
    get titleStyle(): Style;
    open(): void;
    close(): void;
    update(props: Omit<SectionProps, 'view'>): void;
    naturalSize(available: Size): Size;
    receiveMouse(event: MouseEvent, system: System): void;
    receiveTick(dt: number): boolean;
    render(viewport: Viewport): void;
}
export {};
