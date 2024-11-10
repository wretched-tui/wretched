import { Viewport } from '../Viewport';
import { type Props as ViewProps, View } from '../View';
import { Size } from '../geometry';
import { type Orientation } from './types';
interface Props extends ViewProps {
    direction?: Orientation;
    min?: number;
    max?: number;
    value?: number;
    showPercent?: boolean;
}
export declare class Progress extends View {
    #private;
    constructor(props: Props);
    update(props: Props): void;
    get value(): number;
    set value(value: number);
    naturalSize(available: Size): Size;
    render(viewport: Viewport): void;
}
export {};
