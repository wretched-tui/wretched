# Wretched

```tsx
import {Screen, Box, Flow, Text, interceptConsoleLog} from 'wretched'

Screen.start(
  new Box({
    border: 'single',
    children: [
      new Flow({
        direction: 'topToBottom',
        children: [
          new Text({text: 'First, there was Ncurses'}),
          new Button({text: 'Tell me more!'}),
        ],
      })
    ],
  }),
)

// Recommended:
interceptConsoleLog()
// While the terminal is in full screen mode, you probably don't want to write console.log to
// stdout - it will appear whever the cursor happens to be, and will clobber your output. You can mount the <ConsoleLog /> to view logs, otherwise when you exit (Ctrl-C) the logs will be flushed to stdout.
```

## History

First there was [Ncurses](https://en.wikipedia.org/wiki/Ncurses). Well wait, before Ncurses there was _Curses_, so first there was, ah wait, there was _termcap_, then _curses_, then ~Ncurses~ _pcurses_ and then Ncurses. tput and terminfo were in there somewhere, too.

Then came about twenty years of other stuff.

Then came [blessed](https://github.com/chjj/blessed), and it was really amazing! Look through the source and imagine writing all that by yourself. Mind blown.

Fast-forward a few years and Flexbox and React and declarative UI showed up, and blessed didn't notice or care by then.

And now comes `wretched`. I stripped down _blessed_ to only the tput/program/events/colors/unicode parts, and reimplemented React components and Flow and Flex layouts.

It's got way less "stuff" in it than _blessed_... but then again blessed had a truly mind-blowing amount of "stuff" to it.
