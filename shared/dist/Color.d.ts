export type Color = 'default' | 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray' | 'grey' | 'brightRed' | 'brightGreen' | 'brightYellow' | 'brightBlue' | 'brightMagenta' | 'brightCyan' | 'brightWhite' | {
    sgr: string | number;
} | {
    grayscale: number;
} | [r: number, g: number, b: number] | `#${string}`;
export declare function colorToHex(color: Color): `#${string}`;
export declare function colorToSGR(color: Color, fgbg: 'fg' | 'bg'): string;
