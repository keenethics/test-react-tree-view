import React from 'react'
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

export default Search
