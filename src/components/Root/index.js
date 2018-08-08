import React, { Component } from 'react'
import './styles.css'
import Header from '../Header'
import Search from '../Search'
import TreeView from '../TreeView'
import predefinedSectors from '../../helpers/sectors'

class Root extends Component {
  state = {
    sectors: predefinedSectors,
    searchQuery: '',
    expanded: [],
    selected: ['2', '4', '20', '21', '2830'],
  }

  componentDidMount() {
    // TODO: fetch data from server
    this.traverseSectors(this.state.sectors)
  }

  /**
   * Recursive method to expand all parents of selected items
   *
   * @param {Array of objects} items -   an array of nested items to traverse
   * @param {String} parentId -          an id of a parent (those should be expanded…
   *                                     …if any of its ancestors is selected)
   * @returns {Boolean}
   */
  traverseSectors = (items, parentId = null) => {
    if (!items) return false
    const { selected } = this.state
    const shouldBeExpanded = items.reduce(($, item) => {
      const becauseOfItem = selected.includes(item.id)
      const becauseOnNestedItems = this.traverseSectors(item.items, item.id)
      return $ || becauseOfItem || becauseOnNestedItems
    }, false)
    if (parentId && shouldBeExpanded) {
      this.setState(({ expanded }) => ({ expanded: [...expanded, parentId] }))
    }
    return shouldBeExpanded
  }

  changeSearch = ({ target: { value: searchQuery } }) => this.setState({ searchQuery })

  toggleView = ({ target: { id } }) => this.setState(({ expanded }) => ({
    expanded: expanded.includes(id)
      ? expanded.filter(idToExpand => idToExpand !== id)
      : [...expanded, id],
  }))

  toggleSelection = ({ target: { id } }) => this.setState(({ selected: previouslySelected }) => {
    const selected = previouslySelected.includes(id)
      ? previouslySelected.filter(idToExpand => idToExpand !== id)
      : [...previouslySelected, id]

    // TODO: call the server to store current expanded state

    return { selected }
  })

  render() {
    const {
      sectors,
      searchQuery,
      expanded,
      selected,
    } = this.state

    return (
      <div>
        <Header />
        <Search searchQuery={searchQuery} changeSearch={this.changeSearch} />
        <TreeView
          sectors={sectors}
          expanded={expanded}
          selected={selected}
          toggleView={this.toggleView}
          toggleSelection={this.toggleSelection}
        />
      </div>
    )
  }
}

export default Root
