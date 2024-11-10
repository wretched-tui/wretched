import type { KeyEvent, MouseEvent } from '../events';
import type { Viewport } from '../Viewport';
import type { Props as ViewProps } from '../View';
import { View } from '../View';
import { Size } from '../geometry';
import { System } from '../System';
import type { FontFamily } from './types';
interface TextProps {
    placeholder?: string;
    onChange?: (text: string) => void;
    onSubmit?: (text: string) => void;
}
interface StyleProps {
    text?: string;
    wrap?: boolean;
    multiline?: boolean;
    font?: FontFamily;
}
export type Props = StyleProps & TextProps & ViewProps;
/**
 * Text input. Supports selection, word movement via alt+←→, single and multiline
 * input, and wrapped lines.
 */
export declare class Input extends View {
    #private;
    constructor(props?: Props);
    update(props: Props): void;
    get text(): string;
    set text(text: string);
    get placeholder(): string | undefined;
    set placeholder(placeholder: string | undefined);
    get font(): FontFamily;
    set font(font: FontFamily);
    get wrap(): boolean;
    set wrap(wrap: boolean);
    get multiline(): boolean;
    set multiline(multiline: boolean);
    naturalSize(available: Size): Size;
    minSelected(): number;
    maxSelected(): number;
    receiveKey(event: KeyEvent): void;
    receiveMouse(event: MouseEvent, system: System): void;
    render(viewport: Viewport): void;
}
export {};
