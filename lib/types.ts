export type FgBg = 'fg' | 'bg'
export type ColorName =
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'grey'
  | 'gray'
export type Color =
  | 'normal'
  | 'default'
  | `default ${FgBg}`
  | `default fg bg`
  | 'bold'
  | 'underline'
  | 'blink'
  | 'inverse'
  | 'invisible'
  | `${ColorName} ${FgBg}`
  | `bright ${ColorName} ${FgBg}`
  | `bright ${ColorName} ${FgBg}`
  | `bright ${ColorName} ${FgBg}`
  | `bright ${ColorName} ${FgBg}`
  | `bright ${ColorName} ${FgBg}`
  | `bright ${ColorName} ${FgBg}`
  | `bright ${ColorName} ${FgBg}`
  | `bright ${ColorName} ${FgBg}`
  | `bright ${ColorName} ${FgBg}`
  | `bright ${ColorName} ${FgBg}`
  | '#${string} ${FgBg}'

export interface Terminal {
  cols: number
  rows: number
  x: number
  y: number
  move(x: number, y: number): void
  write(str: string): void
}
