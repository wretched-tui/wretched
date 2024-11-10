import type { Viewport } from '../Viewport';
import { type Props as ViewProps, View } from '../View';
import type { FlexShorthand, FlexSize } from '../View';
import { Container } from '../Container';
import { Size } from '../geometry';
import { type Direction } from './types';
interface Props extends ViewProps {
    children?: ([FlexShorthand, View] | View)[];
    child?: [FlexShorthand, View] | View;
    direction?: Direction;
    fill?: boolean;
    gap?: number;
}
type ShorthandProps = NonNullable<Props['children']> | Omit<Props, 'direction'>;
export declare class Stack extends Container {
    #private;
    static down(props?: ShorthandProps, extraProps?: Omit<Props, 'children' | 'direction'>): Stack;
    static up(props?: ShorthandProps, extraProps?: Omit<Props, 'children' | 'direction'>): Stack;
    static right(props?: ShorthandProps, extraProps?: Omit<Props, 'children' | 'direction'>): Stack;
    static left(props?: ShorthandProps, extraProps?: Omit<Props, 'children' | 'direction'>): Stack;
    constructor({ children, child, direction, fill, gap, ...viewProps }: Props);
    get direction(): Direction;
    set direction(value: Direction);
    get gap(): number;
    set gap(value: number);
    update({ children, child, ...props }: Props): void;
    naturalSize(available: Size): Size;
    add(child: View, at?: number): void;
    addFlex(flexSize: FlexSize, child: View, at?: number): void;
    get isVertical(): boolean;
    render(viewport: Viewport): void;
}
export {};
