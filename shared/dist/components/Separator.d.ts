import type { Viewport } from '../Viewport';
import type { Props as ViewProps } from '../View';
import { View } from '../View';
import { Size } from '../geometry';
import { type Orientation } from './types';
type Border = 'single' | 'leading' | 'trailing' | 'bold' | 'dash' | 'dash2' | 'dash3' | 'dash4' | 'double';
interface Props extends ViewProps {
    direction: Orientation;
    padding?: number;
    border?: Border;
}
export declare class Separator extends View {
    #private;
    static horizontal(props?: Omit<Props, 'direction'>): Separator;
    static vertical(props?: Omit<Props, 'direction'>): Separator;
    constructor(props: Props);
    update(props: Props): void;
    naturalSize(available: Size): Size;
    render(viewport: Viewport): void;
}
export {};
