/**
 * Tput
 */
export function Tput(options: any): Tput;
export class Tput {
    /**
     * Tput
     */
    constructor(options: any);
    options: any;
    terminal: any;
    debug: any;
    padding: any;
    extended: any;
    printf: any;
    termcap: any;
    error: Error | null;
    terminfoPrefix: any;
    terminfoFile: any;
    termcapFile: any;
    setup(): void;
    term(is: any): boolean;
    _debug(...args: any[]): void;
    /**
     * Fallback
     */
    _useVt102Cap(): void;
    _useXtermCap(): void;
    _useXtermInfo(): void;
    _useInternalInfo(name: any): void;
    _useInternalCap(name: any): void;
    readTerminfo(term: any): {
        header: {
            dataSize: any;
            headerSize: number;
            magicNumber: number;
            namesSize: number;
            boolCount: number;
            numCount: number;
            strCount: number;
            strTableSize: number;
        };
        name: any;
        names: any;
        desc: any;
        dir: string;
        file: any;
        bools: {};
        numbers: {};
        strings: {};
    };
    _terminfo: {
        header: {
            dataSize: any;
            headerSize: number;
            magicNumber: number;
            namesSize: number;
            boolCount: number;
            numCount: number;
            strCount: number;
            strTableSize: number;
        };
        name: any;
        names: any;
        desc: any;
        dir: string;
        file: any;
        bools: {};
        numbers: {};
        strings: {};
    } | undefined;
    _prefix(term: any): any;
    _tprefix(prefix: any, term: any, soft: any): any;
    /**
     * Terminfo Parser
     * All shorts are little-endian
     */
    parseTerminfo(data: any, file: any): {
        header: {
            dataSize: any;
            headerSize: number;
            magicNumber: number;
            namesSize: number;
            boolCount: number;
            numCount: number;
            strCount: number;
            strTableSize: number;
        };
        name: any;
        names: any;
        desc: any;
        dir: string;
        file: any;
        bools: {};
        numbers: {};
        strings: {};
    };
    /**
     * Extended Parsing
     */
    parseExtended(data: any): {
        header: {
            dataSize: any;
            headerSize: number;
            boolCount: number;
            numCount: number;
            strCount: number;
            strTableSize: number;
            lastStrTableOffset: number;
        };
        bools: {};
        numbers: {};
        strings: {};
    };
    compileTerminfo(term: any): any;
    injectTerminfo(term: any): void;
    /**
     * Compiler - terminfo cap->javascript
     */
    compile(info: any): any;
    inject(info: any): void;
    info: any;
    all: any;
    methods: any;
    bools: any;
    numbers: any;
    strings: any;
    features: any;
    _compile(info: any, key: any, str: any): any;
    _print(code: any, print: any, done: any): any;
    readTermcap(term: any): {} | undefined;
    _termcap: any;
    _tryCap(file: any, term: any): any;
    /**
     * Termcap Parser
     *  http://en.wikipedia.org/wiki/Termcap
     *  http://www.gnu.org/software
     *    /termutils/manual/termcap-1.3/html_mono/termcap.html
     *  http://www.gnu.org/software
     *    /termutils/manual/termcap-1.3/html_mono/termcap.html#SEC17
     *  http://tldp.org/HOWTO/Text-Terminal-HOWTO.html#toc16
     *  man termcap
     */
    parseTermcap(data: any, file: any): {};
    /**
     * Termcap Compiler
     *  man termcap
     */
    translateTermcap(info: any): {} | undefined;
    compileTermcap(term: any): any;
    injectTermcap(term: any): void;
    /**
     * _nc_captoinfo - ported to javascript directly from ncurses.
     * Copyright (c) 1998-2009,2010 Free Software Foundation, Inc.
     * See: ~/ncurses/ncurses/tinfo/captoinfo.c
     *
     * Convert a termcap string to terminfo format.
     * 'cap' is the relevant terminfo capability index.
     * 's' is the string value of the capability.
     * 'parameterized' tells what type of translations to do:
     *    % translations if 1
     *    pad translations if >=0
     */
    _captoinfo(cap: any, s: any, parameterized: any): string;
    /**
     * Compile All Terminfo
     */
    getAll(): any[];
    compileAll(start: any): {};
    /**
     * Detect Features / Quirks
     */
    detectFeatures(info: any): any;
    detectUnicode(): any;
    detectBrokenACS(info: any): boolean;
    detectPCRomSet(info: any): boolean;
    detectMagicCookie(): boolean;
    detectPadding(): boolean;
    detectSetbuf(): boolean;
    parseACS(info: any): {
        acsc: {};
        acscr: {};
    };
    GetConsoleCP(): number;
    has(name: any): boolean;
    utoa: {
        '\u25C6': string;
        '\u2592': string;
        '\u00B0': string;
        '\u00B1': string;
        '\u2424': string;
        '\u2518': string;
        '\u2510': string;
        '\u250C': string;
        '\u2514': string;
        '\u253C': string;
        '\u23BA': string;
        '\u23BB': string;
        '\u2500': string;
        '\u23BC': string;
        '\u23BD': string;
        '\u251C': string;
        '\u2524': string;
        '\u2534': string;
        '\u252C': string;
        '\u2502': string;
        '\u2264': string;
        '\u2265': string;
        π: string;
        '\u2260': string;
        '\u00A3': string;
        '\u00B7': string;
    };
}
export namespace Tput {
    export let ipaths: (string | string[])[];
    export function _prefix(term: any): any;
    export function _tprefix(prefix: any, term: any, soft: any): any;
    export function print(...args: any[]): any;
    export let cpaths: (string | string[])[];
    export { alias as _alias };
    let alias_1: {};
    export { alias_1 as alias };
    export let aliasMap: {};
    export let termcap: string;
    export let bools: string[];
    export let numbers: string[];
    export let strings: string[];
    export let acsc: {
        '`': string;
        a: string;
        b: string;
        c: string;
        d: string;
        e: string;
        f: string;
        g: string;
        h: string;
        i: string;
        j: string;
        k: string;
        l: string;
        m: string;
        n: string;
        o: string;
        p: string;
        q: string;
        r: string;
        s: string;
        t: string;
        u: string;
        v: string;
        w: string;
        x: string;
        y: string;
        z: string;
        '{': string;
        '|': string;
        '}': string;
        '~': string;
    };
    export let utoa: {
        '\u25C6': string;
        '\u2592': string;
        '\u00B0': string;
        '\u00B1': string;
        '\u2424': string;
        '\u2518': string;
        '\u2510': string;
        '\u250C': string;
        '\u2514': string;
        '\u253C': string;
        '\u23BA': string;
        '\u23BB': string;
        '\u2500': string;
        '\u23BC': string;
        '\u23BD': string;
        '\u251C': string;
        '\u2524': string;
        '\u2534': string;
        '\u252C': string;
        '\u2502': string;
        '\u2264': string;
        '\u2265': string;
        π: string;
        '\u2260': string;
        '\u00A3': string;
        '\u00B7': string;
    };
}
export function tryRead(file: any, ...args: any[]): any;
/**
 * sprintf
 *  http://www.cplusplus.com/reference/cstdio/printf/
 */
export function sprintf(src: any, ...args: any[]): any;
import * as alias from './alias';
