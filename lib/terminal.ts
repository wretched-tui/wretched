import type {Style} from './ansi'

export interface Terminal {
  cols: number
  rows: number
  x: number
  y: number
  move(x: number, y: number): void
  write(str: string, style: Style): void
}

export type SGRTerminal = Omit<Terminal, 'write'> & {
  write(str: string): void
}
