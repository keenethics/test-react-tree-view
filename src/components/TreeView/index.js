import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'

const highlight = query => name => {
  if (query.length < 3) return name
  // Splitting name into array of parts…
  // …so each odd part will be a sequence that mathces the query
  const parts = name.split(RegExp(`(${query})`, 'ig'))
  return parts.map((part, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <span key={i} className={i % 2 ? 'highlighted' : ''}>
      {part}
    </span>
  ))
}

const ListItem = ({
  item: { id, name, items = [] },
  searchQuery,
  expanded,
  selected,
  toggleView,
  toggleSelection,
}) => {
  const isExpanded = expanded.includes(id)
  const isSelected = selected.includes(id)
  const highlightSearch = highlight(searchQuery)
  return (
    <li className={`sector ${(!items && 'empty') || (isExpanded && 'expanded') || ''}`}>
      <input
        type="checkbox"
        name={id}
        checked={isSelected}
        onChange={toggleSelection}
      />
      <span id={id} role="checkbox" aria-checked={isExpanded} onClick={toggleView}>
        {highlightSearch(name)}
      </span>
      {items
        && isExpanded
        && (
          <TreeView
            sectors={items}
            searchQuery={searchQuery}
            expanded={expanded}
            selected={selected}
            toggleView={toggleView}
            toggleSelection={toggleSelection}
          />
        )}
    </li>
  )
}

const sectorItemType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  items: PropTypes.array,
}).isRequired

const genericSectorTypes = {
  searchQuery: PropTypes.string.isRequired,
  expanded: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleView: PropTypes.func.isRequired,
  toggleSelection: PropTypes.func.isRequired,
}

ListItem.propTypes = {
  ...genericSectorTypes,
}

const TreeView = ({
  sectors,
  searchQuery,
  expanded,
  selected,
  toggleView,
  toggleSelection,
}) => (
  <ul className="tree-view">
    {sectors.map(item => (
      <ListItem
        key={item.id}
        item={item}
        searchQuery={searchQuery}
        expanded={expanded}
        selected={selected}
        toggleView={toggleView}
        toggleSelection={toggleSelection}
      />
    ))}
  </ul>
)

TreeView.propTypes = {
  sectors: PropTypes.arrayOf(sectorItemType).isRequired,
  ...genericSectorTypes,
}

export default TreeView
