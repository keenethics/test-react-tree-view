import React from 'react'
import TreeView from './index'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

it('renders correctly', () => {
  const tree = renderer
    .create(<TreeView
      sectors={[{ id: 'id', name: 'name', items: [] }]}
      searchQuery=""
      expanded={['one', 'two']}
      selected={['one']}
      toggleView={jest.fn()}
      toggleSelection={jest.fn()}
    />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})


it('handle click correctly', () => {
  Enzyme.configure({ adapter: new Adapter() })
  const toggleView = jest.fn()
  const tree = Enzyme.mount(<TreeView
      sectors={[{ id: 'id', name: 'name', items: [] }]}
      searchQuery=""
      expanded={['one', 'two']}
      selected={['one']}
      toggleView={toggleView}
      toggleSelection={jest.fn()}
    />)
    tree.find('#id').simulate('click')
    expect(toggleView).toHaveBeenCalled()
})
