import type { Viewport } from '../Viewport';
import { type Props as ContainerProps, Container } from '../Container';
import { Size } from '../geometry';
import { type MouseEvent, HotKey, KeyEvent } from '../events';
import type { View } from '../View';
import { Alignment } from './types';
import { System } from '../System';
type Border = 'default' | 'arrows' | 'none';
export interface Props extends ContainerProps {
    text?: string;
    align?: Alignment;
    border?: Border;
    onClick?: () => void;
    hotKey?: HotKey;
}
export declare class Button extends Container {
    #private;
    constructor(props: Props);
    update(props: Props): void;
    childTheme(view: View): import("..").Theme;
    naturalSize(available: Size): Size;
    get text(): string | undefined;
    set text(value: string | undefined);
    receiveMouse(event: MouseEvent, system: System): void;
    receiveKey(_: KeyEvent): void;
    render(viewport: Viewport): void;
}
export {};
