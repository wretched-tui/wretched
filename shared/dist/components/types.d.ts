export type Alignment = 'left' | 'right' | 'center';
export declare const FontFamilies: readonly ["default", "serif-bold", "serif-italic", "serif-italic-bold", "sans", "sans-bold", "sans-italic", "sans-italic-bold", "monospace", "double-struck", "fraktur", "fraktur-bold", "script", "script-bold"];
export type FontFamily = (typeof FontFamilies)[number];
export type Font = Map<string, string>;
export type Orientation = 'horizontal' | 'vertical';
export type Direction = 'right' | 'left' | 'down' | 'up';
