import type { Viewport } from '../Viewport';
import { type Props as ContainerProps, Container } from '../Container';
import { Size } from '../geometry';
export type Border = 'none' | 'single' | 'bold' | 'double' | 'rounded' | 'dotted' | 'popout';
export type BorderChars = [string, string, string, string, string, string] | [string, string, string, string, string, string, string] | [string, string, string, string, string, string, string, string];
export type CalculatedBorderChars = [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string
];
export interface BorderSizes {
    maxTop: number;
    maxBottom: number;
    maxRight: number;
    maxLeft: number;
    topLeft: {
        width: number;
        height: number;
    };
    topMiddle: {
        width: number;
        height: number;
    };
    topRight: {
        width: number;
        height: number;
    };
    leftMiddle: {
        width: number;
        height: number;
    };
    rightMiddle: {
        width: number;
        height: number;
    };
    bottomLeft: {
        width: number;
        height: number;
    };
    bottomMiddle: {
        width: number;
        height: number;
    };
    bottomRight: {
        width: number;
        height: number;
    };
}
interface Props extends ContainerProps {
    border?: Border | BorderChars;
    highlight?: boolean;
}
export declare class Box extends Container {
    #private;
    constructor(props: Props);
    get border(): Border | BorderChars;
    set border(value: Border | BorderChars);
    update(props: Props): void;
    naturalSize(available: Size): Size;
    render(viewport: Viewport): void;
}
export {};
