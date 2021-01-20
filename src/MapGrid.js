import React from 'react'
import Cell from './MapCell'

export default function MapGrid({grid}) {
  return (
  <div>
    {grid.map( (row, i) => {
      return (
      <div 
        key={i} 
        style={{display:'flex', flexDirection:"row", flexWrap:'nowrap'}}
      >
        { row.map( (cell, j) => <Cell key={[i, j]} attr={cell} /> ) } 
      </div>
      )
    })}
  </div>
  )
}
