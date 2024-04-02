import {Tree, Text} from 'wretched'
import {demo} from './demo'

interface Data {
  title: string
  items: Data[]
}

demo(
  new Tree<Data>({
    titleView: new Text({text: 'Title view'}),
    data: [
      {
        title: 'Item 1',
        items: [
          {
            title: 'Item 1.1',
            items: [
              {title: 'Item 1.1.1', items: []},
              {title: 'Item 1.1.2', items: []},
              {title: 'Item 1.1.3', items: []},
            ],
          },
          {title: 'Item 1.2', items: []},
          {title: 'Item 1.3\n[ ] more lines', items: []},
        ],
      },
      {
        title: 'Item 2',
        items: [
          {title: 'Item 2.1', items: []},
          {
            title: 'Item 2.2',
            items: [
              {title: 'Item 2.2.1', items: []},
              {title: 'Item 2.2.2', items: []},
              {title: 'Item 2.2.3', items: []},
            ],
          },
          {title: 'Item 2.3\n[ ] more lines', items: []},
        ],
      },
      {
        title: 'Item 3',
        items: [
          {title: 'Item 3.1', items: []},
          {title: 'Item 3.2', items: []},
          {
            title: 'Item 3.3\n[ ] more lines',
            items: [
              {title: 'Item 3.3.1', items: []},
              {title: 'Item 3.3.2', items: []},
              {title: 'Item 3.3.3', items: []},
            ],
          },
        ],
      },
    ],
    render({title}) {
      return new Text({text: title})
    },
    getChildren({items}) {
      return items
    },
  }),
)
