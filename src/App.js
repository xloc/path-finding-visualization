import React, { useState, useEffect, useRef } from 'react';
import data from './data';
import DijkstraRouting from './DijkstraRouting';
import Grid from './Grid';

import GridModel, { parseGridString } from "./GridModel";

function App() {
  const [loading, setLoading] = useState(true)
  const [gridModel, setGridModel] = useState()
  const [routingMarkGrid, setRoutingMarkGrid] = useState()

  useEffect(() => {
    const model = new GridModel(parseGridString(data))
    setGridModel(model)

    setLoading(false);
  }, [])


  const router = useRef(null)
  useEffect(() => {
    if (!gridModel) return;

    router.current = new DijkstraRouting(
      gridModel,
      gridModel.nets[0].slice(0, 1),
      gridModel.nets[0].slice(1),
    );
    console.log(router.current);
    setRoutingMarkGrid(router.current.getMarkGrid());
  }, [gridModel])

  if (loading) {
    return "Loading grid..."
  }

  function nextExpansion() {
    if (!router) return;
    router.current.next();
    setRoutingMarkGrid(router.current.getMarkGrid());
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
        <Grid gridModel={gridModel} routingMarkGrid={routingMarkGrid} />
        <button onClick={nextExpansion}>Next Expansion</button>
      </div>
      <pre>
        { router.current && router.current.states && 
          JSON.stringify(router.current.states.track) }
      </pre>
    </>
  );
}

export default App;
