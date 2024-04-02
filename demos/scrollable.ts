import {Scrollable, Flow, Text} from 'wretched'

import {demo} from './demo'

demo(
  new Scrollable({
    child: Flow.down({
      children: Array(100)
        .fill(0)
        .map(
          (_, index) =>
            new Text({
              text: (index % 2
                ? 'abcdefghijklmnopqrstuvwxyz'
                : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
              ).repeat(12),
            }),
        ),
    }),
  }),
)
