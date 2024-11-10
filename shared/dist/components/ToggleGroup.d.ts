import type { Viewport } from '../Viewport';
import { type Props as ViewProps } from '../View';
import { Container } from '../Container';
import { Size } from '../geometry';
import { type MouseEvent } from '../events';
import { System } from '../System';
import { type Orientation } from './types';
interface Props extends ViewProps {
    multiple?: boolean;
    padding?: number;
    direction?: Orientation;
    titles: string[];
    selected: number[];
    onChange?: (changed: number, selected: number[]) => void;
}
export declare class ToggleGroup extends Container {
    #private;
    constructor(props: Props);
    update(props: Props): void;
    get titles(): string[];
    set titles(value: string[]);
    naturalSize(): Size;
    receiveMouse(event: MouseEvent, system: System): void;
    render(viewport: Viewport): void;
}
export {};
