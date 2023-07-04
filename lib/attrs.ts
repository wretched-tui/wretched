export type Attr =
  | 'none'
  | 'underline'
  | 'reverse'
  | 'bold'
  | {foreground: Color}
  | {background: Color}

export type Color =
  | 'none'
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'gray'
  | 'brightRed'
  | 'brightGreen'
  | 'brightYellow'
  | 'brightBlue'
  | 'brightMagenta'
  | 'brightCyan'
  | 'brightWhite'
  | {grayscale: number}
  | [r: number, g: number, b: number]
