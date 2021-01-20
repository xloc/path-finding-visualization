import React from 'react'
import MapCell from './MapCell'

export default function Grid({grid}) {
  return (
  <div>
    {grid.map( (row, i) => {
      return (
      <div 
        key={i} 
        style={{display:'flex', flexDirection:"row", flexWrap:'nowrap'}}
      >
        { row.map( (cell, j) => <MapCell key={[i, j]} attr={cell} /> ) } 
      </div>
      )
    })}
  </div>
  )
}
