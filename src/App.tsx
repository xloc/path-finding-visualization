import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AppBar,
  MenuItem,
  Select,
  ThemeProvider,
  Toolbar,
} from "@material-ui/core";

import theme from "./theme";
import "./App.css";
import Grid from "./Components/Grid";
import { parseRoutingMapString, RouteMap } from "./Models/RouteMap";
import { route, MapRouteSuccess } from "./Routers/Router";
import { Grid as GridModel } from "./Models/Grid";

export interface RouteResultCell {
  netId: number;
}
export type RouteResult = GridModel<RouteResultCell>;

function App() {
  const [routeResult, setRouteResult] = useState<RouteResult>();
  const [routeMap, setRouteMap] = useState<RouteMap>();

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

  const [infiles, setInfiles] = useState<Array<string>>();
  useEffect(() => {
    axios.get("benchmarks/infiles.json").then((res) => {
      setInfiles(res.data);
    });
    return () => {};
  }, []);

  const [mapName, setMapName] = useState("example.infile");
  useEffect(() => {
    if (mapName === "") return;
    axios.get<string>(`benchmarks/${mapName}`).then((res) => {
      setRouteMap(parseRoutingMapString(res.data));
    });

    /// TODO clean up
  }, [mapName]);

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Select
            style={{ width: "8em", color: "white" }}
            value={mapName}
            onChange={(event) => setMapName(event.target.value as string)}
          >
            {infiles?.map((filename) => (
              <MenuItem key={filename} value={filename}>
                {" "}
                {filename.split(".")[0]}{" "}
              </MenuItem>
            )) ?? <MenuItem value={""}></MenuItem>}
          </Select>
        </Toolbar>
      </AppBar>
      <div style={{ margin: 20 }}>
        {routeMap ? (
          <Grid routeMap={routeMap} routeResult={routeResult} />
        ) : (
          <></>
        )}

        <button onClick={next}> Next </button>
      </div>
    </ThemeProvider>
  );
}

export default App;
