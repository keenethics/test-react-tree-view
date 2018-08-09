import React, { Component } from 'react'
import './styles.css'
import Header from '../Header'
import Search from '../Search'
import TreeView from '../TreeView'
import { request } from '../../helpers/api'

class Root extends Component {
  state = {
    sectors: [],
    searchQuery: '',
    expandedForSearch: [],
    expanded: [],
    selected: ['956'],
  }

  componentDidMount() {
    request('/sectors')
      .then(({ sectors, selectedSectors }) => {
        this.setState({ sectors, selected: selectedSectors })
        this.traverseSectorsToExpand(sectors)
      })
      .catch(alert)
  }

  /**
   * Recursive method to expand all parents of selected items
   *
   * @param {Array of objects} items -   an array of nested items to traverse
   * @param {String} parentId        -   an id of a parent (those should be expanded…
   *                                     …if any of its ancestors is selected)
   * @returns {Boolean}
   */
  traverseSectorsToExpand = (items, parentId = null) => {
    if (!items) return false
    const { selected } = this.state
    const shouldBeExpanded = items.reduce(($, item) => {
      const becauseOfItem = selected.includes(item.id)
      const becauseOfNestedItems = this.traverseSectorsToExpand(item.items, item.id)
      return $ || becauseOfItem || becauseOfNestedItems
    }, false)
    if (parentId && shouldBeExpanded) {
      this.setState(({ expanded }) => ({ expanded: [...expanded, parentId] }))
    }
    return shouldBeExpanded
  }

  traverseTreeForSearch = (searchQuery, items, parentId = null) => {
    if (!items) return false
    const shouldBeExpanded = items.reduce(($, item) => {
      const becauseOfItem = item.name.match(RegExp(searchQuery, 'i'))
      const becauseOfNestedItems = this.traverseTreeForSearch(searchQuery, item.items, item.id)
      return $ || becauseOfItem || becauseOfNestedItems
    }, false)
    if (parentId && shouldBeExpanded) {
      this.setState(({ expandedForSearch }) => ({
        expandedForSearch: [...expandedForSearch, parentId],
      }))
    }
    return shouldBeExpanded
  }

  changeSearch = ({ target: { value: searchQuery } }) => {
    this.setState({ searchQuery, expandedForSearch: [] })
    if (searchQuery.length >= 3) {
      this.traverseTreeForSearch(searchQuery, this.state.sectors)
    }
  }

  toggleView = ({ target: { id } }) => this.setState(({ expanded }) => ({
    expanded: expanded.includes(id)
      ? expanded.filter(idToExpand => idToExpand !== id)
      : [...expanded, id],
  }))

  findSelectedItem = (id, items) => {
    if (!items) return false
    const target = items.find(item => item.id === id)
    if (target) return target
    return items.reduce(($, item) => $ || this.findSelectedItem(id, item.items), null)
  }

  /**
   * Selects or unselects all nested sectors
   */
  processSelectionOfNestedItems = (nestedItems, shouldSelect) => {
    if (!nestedItems) return false
    return nestedItems.forEach(({ id, items = null }) => {
      this.setState(({ selected, expanded }) => ({
        selected: shouldSelect
          ? [...selected, id]
          : selected.filter(idToSelect => idToSelect !== id),
        expanded: shouldSelect
          ? [...expanded, id]
          : expanded.filter(idToExpand => idToExpand !== id),
      }))
      if (items) {
        this.processSelectionOfNestedItems(items, shouldSelect)
      }
    })
  }

  toggleSelection = ({
    target: { name: id },
  }) => this.setState(({ selected: previouslySelected, expanded }) => {
    const selected = previouslySelected.includes(id)
      ? previouslySelected.filter(idToSelect => idToSelect !== id)
      : [...previouslySelected, id]
    // FIXME:
    return {
      selected,
      expanded: !previouslySelected.includes(id)
        ? [...expanded, id]
        : expanded.filter(idToExpand => idToExpand !== id),
    }
  }, () => {
    const selectedItem = this.findSelectedItem(id, this.state.sectors)
    // FIXME:
    this.processSelectionOfNestedItems(selectedItem.items, this.state.selected.includes(id))
    // TODO: call the server to store current selected state
    // FIXME: store the entire selected array
    request('/save-selectors', 'POST', { ids: this.state.selected })
      .catch(alert)
  })

  render() {
    const {
      sectors,
      searchQuery,
      expandedForSearch,
      expanded,
      selected,
    } = this.state

    return (
      <div>
        <Header />
        <Search searchQuery={searchQuery} changeSearch={this.changeSearch} />
        <TreeView
          sectors={sectors}
          searchQuery={searchQuery}
          expanded={[...expanded, ...expandedForSearch]}
          selected={selected}
          toggleView={this.toggleView}
          toggleSelection={this.toggleSelection}
        />
      </div>
    )
  }
}

export default Root
