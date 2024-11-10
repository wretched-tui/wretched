import type { Viewport } from '../Viewport';
import { View, type Props as ViewProps } from '../View';
import { Style } from '../Style';
import { Size } from '../geometry';
import { type MouseEvent } from '../events';
import { System } from '../System';
interface Props extends ViewProps {
    text: string;
    style?: Style;
}
export declare class CollapsibleText extends View {
    #private;
    constructor(props: Props);
    update(props: Props): void;
    get text(): string;
    set text(value: string);
    naturalSize(available: Size): Size;
    receiveMouse(event: MouseEvent, system: System): void;
    render(viewport: Viewport): void;
}
export {};
