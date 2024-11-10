import type { Viewport } from '../Viewport';
import { type View } from '../View';
import { type Props as ContainerProps, Container } from '../Container';
import { Size } from '../geometry';
import { type HotKey, type MouseEvent } from '../events';
import { System } from '../System';
interface StyleProps {
    text?: string;
    value: boolean;
    onChange?: (value: boolean) => void;
    hotKey?: HotKey;
}
type Props = StyleProps & ContainerProps;
export declare class Checkbox extends Container {
    #private;
    constructor(props: Props);
    get value(): boolean;
    set value(value: boolean);
    childTheme(view: View): import("..").Theme;
    update(props: Props): void;
    get text(): string | undefined;
    set text(value: string | undefined);
    naturalSize(available: Size): Size;
    receiveMouse(event: MouseEvent, system: System): void;
    render(viewport: Viewport): void;
    boxChars(): Record<'unchecked' | 'checked', string>;
}
export declare class Radio extends Checkbox {
    boxChars(): Record<'unchecked' | 'checked', string>;
}
export {};
