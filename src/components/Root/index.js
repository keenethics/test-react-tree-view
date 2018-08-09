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
    selected: [],
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
   * Traverse items to find all nested items id`s
   *
   * @param {Array of objects} nestedItems -   an array of nested items to traverse
   *
   * @returns {Array of strings}           -   id`s of nested items
   */
  static getIdsOfNestedItems = nestedItems => {
    if (!nestedItems) return []
    return nestedItems.reduce(($, item) => [
      ...$,
      item.id,
      ...Root.getIdsOfNestedItems(item.items),
    ], [])
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
    const { sectors } = this.state
    this.setState({ searchQuery, expandedForSearch: [] })
    if (searchQuery.length >= 3) {
      this.traverseTreeForSearch(searchQuery, sectors)
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

  toggleSelection = ({
    target: { name: id },
  }) => this.setState(({ selected: previouslySelected, expanded }) => {
    const selected = previouslySelected.includes(id)
      ? previouslySelected.filter(idToSelect => idToSelect !== id)
      : [...previouslySelected, id]
    return {
      selected,
      expanded: !previouslySelected.includes(id)
        ? [...expanded, id]
        : expanded.filter(idToExpand => idToExpand !== id),
    }
  }, () => {
    const { sectors, selected, expanded } = this.state
    const selectedItem = this.findSelectedItem(id, sectors)
    const nestedIds = Root.getIdsOfNestedItems(selectedItem.items)
    const shouldSelect = selected.includes(id)
    const selectedNew = shouldSelect
      ? [...selected, ...nestedIds]
      : selected.filter(idToSelect => !nestedIds.includes(idToSelect))
    const expandedNew = shouldSelect
      ? [...expanded, ...nestedIds]
      : expanded.filter(idToExpand => !nestedIds.includes(idToExpand))
    this.setState({
      selected: selectedNew,
      expanded: expandedNew,
    })
    request('/save-selectors', 'POST', { ids: selectedNew })
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
