import React from 'react'
import Cell from './Cell'

export default function Grid({grid}) {
    return (<div>
        {grid.map( (row, i) => {
            return (<div key={i} style={{display:'flex', flexDirection:"row", flexWrap:'nowrap'}}>
                { row.map( (cell, j) => <Cell key={[i, j]} type={cell} /> ) } 
            </div>)
        })}
    </div>)
}
