import React from 'react'
import MapCell from './MapCell'

export default function Grid({gridModel, processingGrid}) {
  return (
    <div>
      {
        Array(gridModel.nRow).fill(null).map( (x, i) => (
          <div key={i} style={{display:'flex', flexDirection:"row", flexWrap:'nowrap'}}>
            {
              Array(gridModel.nCol).fill(null).map( (x, j) => (
                <MapCell 
                  key={`mc ${i} ${j}`} 
                  mapAttr={gridModel.mapGrid[i][j]}
                  processingAttr={processingGrid && processingGrid[i][j]}
                />
              ) )
            } 
          </div>
        ) )
      }
    </div>
  )
}
