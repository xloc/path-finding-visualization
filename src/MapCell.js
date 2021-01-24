import React from 'react'

import './cell.css'
import { MapCellType } from "./GridModel";

const netColors = [
  '#ff6347',
  '#adff2f',
  '#4682b4',
  '#F4A460',
  '#dda0dd',

  '#6a5acd',
  '#00ff7f',
]

export default function MapCell({ mapAttr, routingMark }) {
  let color;
  switch (mapAttr.type) {
    case MapCellType.wall: color = 'black'; break;
    case MapCellType.pin: color = netColors[mapAttr.net]; break;
    default: color = '#ddd'; break;
  }

  return (
    <div className="cell" style={{ backgroundColor: color }}>
      {/* {routingMark && (routingMark.active ? "o" : (routingMark.visited ? "x" : ""))} */}
      {routingMark && (routingMark.value)}
    </div>
  )
}
