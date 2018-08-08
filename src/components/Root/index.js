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

  toggleSector = () => null

  selectSector = () => null

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
          toggleSector={this.toggleSector}
          selectSector={this.selectSector}
        />
      </div>
    )
  }
}

export default Root
