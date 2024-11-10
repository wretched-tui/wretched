import { Container } from '../Container';
import { Size } from '../geometry';
import { Viewport } from '../Viewport';
import { type FontFamily } from './types';
import { type Props as ViewProps } from '../View';
interface Props extends ViewProps {
    text: string;
    border: 'single' | 'bold' | 'double';
    font?: FontFamily;
    bold?: boolean;
    dim?: boolean;
}
export declare class Header extends Container {
    #private;
    constructor({ bold, dim, text, font, ...props }: Props);
    naturalSize(available: Size): Size;
    render(viewport: Viewport): void;
}
export declare function H1(text?: string): Header;
export declare function H2(text?: string): Header;
export declare function H3(text?: string): Header;
export declare function H4(text?: string): Header;
export declare function H5(text?: string): Header;
export declare function H6(text?: string): Header;
export {};
