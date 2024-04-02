import {Box, Text} from 'wretched'

import {demo} from './demo'

demo(
  new Box({
    border: 'popout',
    width: 10,
    height: 5,
    children: [new Text({text: ''})],
  }),
)
