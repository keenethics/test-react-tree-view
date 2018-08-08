import React from 'react'
import './styles.css'

const TreeView = ({
  sectors,
  selectedId,
  selectSector,
}) => (
  <div className="tree-view">
    {sectors.map(({ name }) => (
      <li>
        {name}
      </li>
    ))}
  </div>
)

export default TreeView
