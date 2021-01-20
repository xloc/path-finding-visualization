import React, { useState, useEffect } from 'react';
import data from './data';
import MapGrid from './MapGrid';

import GridModel, { parseGridString } from "./MapGridModel";

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
      <MapGrid grid={ grid } />
    </div>
  );
}

export default App;
