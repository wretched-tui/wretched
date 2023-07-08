import type {Style} from './ansi'

export interface Terminal {
  cols: number
  rows: number
  writeChar(char: string, x: number, y: number, style: Style): void
  writeMeta(str: string): void
}

export type SGRTerminal = Omit<Terminal, 'writeChar'> & {
  x: number
  y: number
  move(x: number, y: number): void
  write(str: string): void
}
