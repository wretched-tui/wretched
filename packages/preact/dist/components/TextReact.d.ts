import { Alignment, Container, FontFamily, Screen, Size, Style, type ViewProps, View, Viewport } from 'wretched';
/**
 * Used in the React reconciler for literal text JSX elements. They don't have any
 * props.
 */
export declare class TextLiteral extends View {
    #private;
    constructor(text: string);
    update({ text, ...props }: ViewProps & {
        text?: string;
    }): void;
    styledText(): string;
    get text(): string;
    set text(value: string);
    naturalSize(): Size;
    render(): void;
}
/**
 * Subsequent TextLiteral nodes are grouped into a TextContainer, which handles the
 * layout of child nodes. It gets its style, font, and alignment from the nearest
 * parent TextProvider.
 */
export declare class TextContainer extends Container {
    #private;
    constructor();
    get nodes(): View[];
    add(child: View, at?: number): void;
    removeChild(child: View): void;
    didMount(screen: Screen): void;
    invalidateText(): void;
    naturalSize(available: Size): Size;
    render(viewport: Viewport): void;
}
interface TextProviderProps {
    style?: Partial<Style>;
    font?: FontFamily;
    alignment?: Alignment;
    wrap?: boolean;
}
type TextProps = Omit<TextProviderProps, 'style'> & {
    style?: Style;
};
type ProviderProps = TextProviderProps & ViewProps & Partial<Style>;
/**
 * Intended to contain a single TextContainer. Provides the styling that is used to
 * create Text views.
 *
 * @example
 *     <Text align='left' bold>text</Text>
 */
export declare class TextProvider extends Container {
    #private;
    wrap: FontFamily;
    font: FontFamily;
    alignment: Alignment;
    constructor(props?: ProviderProps);
    get style(): Style;
    get parentStyle(): Style;
    get textProps(): TextProps;
    update(props: ProviderProps): void;
}
type StyledTextProps = Omit<ProviderProps, 'alignment' | 'wrap' | 'font'>;
/**
 * Provides inline styles - doesn't support wrap or alignment.
 *
 * Also doesn't support 'font' because that's not encoded as an SGR code - but
 * ideally it would be supported.
 */
export declare class TextStyle extends TextProvider {
    constructor(props: StyledTextProps);
}
export {};
