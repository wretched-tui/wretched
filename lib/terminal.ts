import type {BlessedProgram} from './sys'
import type {Style} from './ansi'

export interface Terminal {
  cols: number
  rows: number
  writeChar(char: string, x: number, y: number, style: Style): void
  writeMeta(str: string): void
}

export type SGRTerminal = Pick<
  BlessedProgram,
  'cols' | 'rows' | 'move' | 'write' | 'on' | 'once'
>
