import { Viewport } from '../Viewport';
import { type Props as ViewProps, View } from '../View';
import { Size } from '../geometry';
import { type MouseEvent } from '../events';
import { type Orientation } from './types';
type ButtonProps = {
    /**
     * Whether to show ◃, ▹ buttons on either side of the slider.
     * Default: false
     */
    buttons?: false;
    /**
     * If provided, values will be in fit the equation `min(range) + N * step`. Also
     * applies to the buttons, if they are visible.
     */
    step?: number;
} | {
    /**
     * Whether to show ◃, ▹ buttons on either side of the slider.
     * Default: false
     */
    buttons: true;
    /**
     * If provided, values will be in fit the equation `min(range) + N * step`. Also
     * applies to the buttons, if they are visible.
     */
    step: number;
};
type Props = ViewProps & ButtonProps & {
    /**
     * What direction to draw the slider.
     * Default: 'horizontal'
     */
    direction?: Orientation;
    /**
     * Whether to show a border around the slider.
     * Default: false
     */
    border?: boolean;
    /**
     * Minimum and maximum values - inclusive.
     */
    range?: [number, number];
    /**
     * Current position of the slider, should be within the range
     */
    value?: number;
    onChange?: (value: number) => void;
};
export declare class Slider extends View {
    #private;
    constructor(props: Props);
    update(props: Props): void;
    get value(): number;
    set value(value: number);
    naturalSize(): Size;
    receiveMouse(event: MouseEvent): void;
    render(viewport: Viewport): void;
}
export {};
