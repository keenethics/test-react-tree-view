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
    selected: [],
  }

  changeSearch = ({ target: { value: searchQuery } }) => this.setState({ searchQuery })

  toggleView = ({ target: { id } }) => this.setState(({ expanded }) => ({
    expanded: expanded.includes(id)
      ? expanded.filter(idToExpand => idToExpand !== id)
      : [...expanded, id],
  }))

  toggleSelection = () => null

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
