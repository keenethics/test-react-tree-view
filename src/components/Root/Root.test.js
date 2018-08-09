import React from 'react'
import ReactDOM from 'react-dom'
import Root from './index'
import renderer from 'react-test-renderer'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Root />, div)
  ReactDOM.unmountComponentAtNode(div)
})


it('renders correctly', () => {
  const tree = renderer
    .create(<Root />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
