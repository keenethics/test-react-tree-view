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
    {searchQuery.length < 3 && (
      <span>
        put at least 3 letters to start searching
      </span>
    )}
  </div>
)

Search.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  changeSearch: PropTypes.func.isRequired,
}

export default Search
