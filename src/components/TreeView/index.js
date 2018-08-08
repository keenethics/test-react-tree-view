import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'

const ListItem = ({
  item: { id, name, items = [] },
  expanded,
  selected,
  toggleView,
  toggleSelection,
}) => {
  const isExpanded = expanded.includes(id)
  return (
    <li className={`sector ${isExpanded ? 'expanded' : null}`}>
      <input type="checkbox" />
      <span id={id} role="checkbox" aria-checked={isExpanded} onClick={toggleView}>
        {name}
      </span>
      {items
        && isExpanded
        && (
          <TreeView
            sectors={items}
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
