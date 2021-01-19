import React, { useState, useEffect } from 'react';
import data from './data';
import Grid from './Grid';

import GridModel, { parseGridString } from "./GridModel";

function App() {
  const [loading, setLoading] = useState(true)
  const [grid, setGrid] = useState()

  useEffect(() => {
    const gridModel = new GridModel(parseGridString(data))
    setGrid(gridModel.grid)


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
