/**
 * A global function to turn debugging on/off, useful to test things that would
 * otherwise output way too much, ie console in render()
 */
export declare function debug(value?: boolean): boolean;
/**
 * Left pads (with spaces) according to terminal width
 */
export declare function leftPad(str: string, length: number): string;
/**
 * Right pads (with spaces) according to terminal width
 */
export declare function rightPad(str: string, length: number): string;
/**
 * Center pads (with spaces) according to terminal width
 */
export declare function centerPad(str: string, length: number): string;
/**
 * Used to add {enumerable: true} to defined properties on Components, so they
 * are picked up by inspect().
 */
export declare function define<T extends object>(object: T, property: keyof T, attributes: PropertyDescriptor): void;
