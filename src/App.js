import React, { useState, useEffect } from 'react';
import data from './data'
import Grid from './Grid'

import { CellType } from "./GridModel";

function parseInput(input) {
  const lines = input.split('\n')
  const [n_col, n_row] = lines[0].split(' ').map( a => parseInt(a) )
  // console.log(n_col, n_row);
  const grid = Array(n_row).fill(null)
    .map( 
      a => Array(n_col).fill(null)
        .map( a => ({type: CellType.void}) )
    )

  let i_line = 1
  /// parse obstacles
  const n_wall = parseInt(lines[i_line++])
  lines.slice(i_line, i_line + n_wall).forEach(line => {
    const [j, i]  = line.split(' ').map( a => parseInt(a) )
    // console.log(i, j);
    grid[i][j].type = CellType.wall;
  });
  i_line += n_wall

  /// parse nets
  const n_net = parseInt(lines[i_line++])
  lines.slice(i_line, i_line + n_net).forEach((line, netID) => {
    /// parse pins
    const [, ...coors] = line.trim().split(' ').map( a => parseInt(a) )
    // console.log({n_pins, len:coors.length});
    for (let idx = 0; idx < coors.length; idx += 2) {
      const j = coors[idx], i = coors[idx + 1]
      // console.log({i, j});
      grid[i][j].type = CellType.pin;
      grid[i][j].net = netID;
    }
  })
  

  return grid
}

function App() {
  const [loading, setLoading] = useState(true)
  const [grid, setGrid] = useState()

  useEffect(() => {
    setGrid(parseInput(data))


    setLoading(false)
  }, [])

  if (loading) {
    return "Loading grid..."
  }

  return (
    <div style={{ display:'flex', justifyContent:'center', marginTop:100 }}>
      <Grid grid={ grid } />
    </div>
  );
}

export default App;
