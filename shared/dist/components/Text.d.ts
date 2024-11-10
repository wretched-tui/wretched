import type { Viewport } from '../Viewport';
import type { Props as ViewProps } from '../View';
import { View } from '../View';
import { Style } from '../Style';
import { Size } from '../geometry';
import { Alignment, FontFamily } from './types';
interface TextProps {
    text?: string;
    lines?: undefined;
}
interface LinesProps {
    text?: undefined;
    lines: string[];
}
interface StyleProps {
    style?: Style;
    alignment: Alignment;
    wrap: boolean;
    font?: FontFamily;
}
type Props = Partial<StyleProps> & (TextProps | LinesProps) & ViewProps;
export declare class Text extends View {
    #private;
    constructor(props?: Props);
    get text(): string;
    set text(value: string);
    get font(): FontFamily;
    set font(value: FontFamily);
    get style(): Style | undefined;
    set style(value: Style | undefined);
    update(props: Props): void;
    naturalSize(available: Size): Size;
    render(viewport: Viewport): void;
}
export {};
