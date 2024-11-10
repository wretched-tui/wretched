import type { Viewport } from '../Viewport';
import type { Dimension, Props as ViewProps } from '../View';
import type { Color } from '../Color';
import { View } from '../View';
import { Size } from '../geometry';
interface Props extends ViewProps {
    background?: Color;
}
export declare class Space extends View {
    #private;
    background?: Color;
    static horizontal(value: Dimension, extraProps?: Props): Space;
    static vertical(value: Dimension, extraProps?: Props): Space;
    constructor(props?: Props);
    update(props: Props): void;
    naturalSize(): Size;
    render(viewport: Viewport): void;
}
export {};
