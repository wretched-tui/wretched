import {Button, Flex, Separator, Space} from '../components'

import {demo} from './demo'

let foo = false
demo(
  new Button({
    text: 'test',
    onClick() {
      foo = !foo
      if (foo) {
        console.log('=====')
      } else {
        console.log('🧗‍♀️')
      }
    },
  }),
)
