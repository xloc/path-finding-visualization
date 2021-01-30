import React, { useEffect, useState } from "react";
import "./App.css";
import Grid from "./Components/Grid";
import { parseRoutingMapString } from "./Models/RouteMap";
import data from "./routeMapData";
import {
  makeObstacleGrid,
  routeNet,
  NetRoutingSuccess,
  route,
  MapRouteSuccess,
} from "./Routers/Router";

import { Grid as GridModel } from "./Models/Grid";

export interface RouteResultCell {
  netId: number;
}
export type RouteResult = GridModel<RouteResultCell>;

function App() {
  const [routeResult, setRouteResult] = useState<RouteResult>();
  const [routeMap, setRouteMap] = useState(() => {
    return parseRoutingMapString(data);
  });

  useEffect(() => {
    setRouteMap(parseRoutingMapString(data));
  }, [data]);

  useEffect(() => {
    if (!routeMap) return;

    const routeResult = route(routeMap);

    if (!routeResult.succeed) return;
    const succeed = routeResult as MapRouteSuccess;
    console.log(succeed);

    const grid = new GridModel<RouteResultCell>(routeMap.size, (i, j) => ({
      netId: -1,
    }));
    succeed.connections.forEach((conn) => {
      conn.segments.forEach(([i, j]) => {
        grid.grid[i][j].netId = conn.netID;
      });
    });
    setRouteResult(grid);
  }, [routeMap]);

  function next() {
    // const grid = new GridModel<RouteResultCell>(routeMap.size, (i, j) => ({
    //   netId: -1,
    // }));
    // grid.grid[0][0].netId = 0;
    // setRouteResult(grid);
  }

  return (
    <div className="App">
      <Grid routeMap={routeMap} routeResult={routeResult} />
      <button onClick={next}> Next </button>
    </div>
  );
}

export default App;
