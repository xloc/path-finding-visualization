import React from 'react'

import { CellType } from "./GridModel";

const netColors = [
  '#ff6347',
  '#adff2f',
  '#4682b4',
  '#F4A460',
  '#dda0dd',

  '#6a5acd',
  '#00ff7f',
]

export default function Cell({attr}) {
  let color
  switch (attr.type) {
    case CellType.wall: color = 'black'; break;
    case CellType.pin: color = netColors[attr.net]; break;
    default: color = '#ddd'; break;
  }
  
  const dimension = 20
  return (
    <div style={{ width:dimension, height:dimension, backgroundColor:color, margin:2 }}>
    </div>
  )
}
