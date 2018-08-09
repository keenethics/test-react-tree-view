import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'

const Search = ({
  searchQuery,
  changeSearch,
}) => (
  <div className="search">
    <input
      type="text"
      name="search"
      className="search"
      value={searchQuery}
      onChange={changeSearch}
      placeholder="Search for sectors"
    />
  </div>
)

Search.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  changeSearch: PropTypes.func.isRequired,
}

export default Search
