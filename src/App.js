import React, { useState, useEffect, useRef } from 'react';
import data from './data';
import DijkstraRouting from './DijkstraRouting';
import Grid from './Grid';

import GridModel, { parseGridString } from "./GridModel";

function App() {
  const [loading, setLoading] = useState(true)
  const [gridModel, setGridModel] = useState()
  const [processingGrid, setProcessingGrid] = useState()

  useEffect(() => {
    const model = new GridModel(parseGridString(data))
    setGridModel(model)

    setLoading(false)
  }, [])


  const router = useRef(null)
  useEffect(() => {
    if (!gridModel) return;

    router.current = new DijkstraRouting(
      gridModel,
      gridModel.nets[0].slice(0, 1),
      gridModel.nets[0].slice(1),
    );

    console.log(router.current.states.processingGrid);
    setProcessingGrid(router.current.states.processingGrid);
  }, [gridModel])

  if (loading) {
    return "Loading grid..."
  }

  function nextExpansion() {
    if (!router) return;

    console.log(router.current.next());
    setProcessingGrid(router.current.states.processingGrid.slice());
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
      <Grid gridModel={gridModel} processingGrid={processingGrid} />
      <button onClick={nextExpansion}>Next Expansion</button>
    </div>
  );
}

export default App;
