import type { Viewport } from '../Viewport';
import type { Props as ViewProps } from '../View';
import { View } from '../View';
import { Style } from '../Style';
import { Size } from '../geometry';
interface Props extends ViewProps {
    text: string | number;
    style?: Style;
    bold?: boolean;
}
export declare class Digits extends View {
    #private;
    constructor(props: Props);
    get text(): string;
    set text(value: string);
    update(props: Props): void;
    naturalSize(): Size;
    render(viewport: Viewport): void;
}
export {};
