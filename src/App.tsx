import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AppBar,
  Box,
  Container,
  createStyles,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  makeStyles,
  MenuItem,
  Select,
  Theme,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@material-ui/core";

import theme from "./theme";
import "./App.css";
import Grid from "./Components/Grid";
import { parseRoutingMapString, RouteMap } from "./Models/RouteMap";
import {
  route,
  MapRouteSuccess,
  IntermediateRouteResultType,
  IntermediateRouteResult,
  IntermediateRouteSucceed,
  IntermediateRouteFailNet,
  IntermediateRouteFailAll,
  Connection,
} from "./Routers/Router";
import { Grid as GridModel, GridSize } from "./Models/Grid";
import {
  ConnectSucceed,
  ConnectFailAll,
  ConnectFailNet,
} from "./Components/RouteProgressItems";

import {
  CheckCircle as CheckIcon,
  ErrorOutline as ErrorOutlineIcon,
  RemoveCircle as BannedIcon,
} from "@material-ui/icons";

export interface RouteResultCell {
  netId: number;
}
export type RouteResult = GridModel<RouteResultCell>;

const circuitDrawerWidth = 150;
const historyDrawerWidth = 150;

function makeRouteResultGridFromConnections(
  size: GridSize,
  connections: Array<Connection>
) {
  const grid = new GridModel<RouteResultCell>(size, (i, j) => ({
    netId: -1,
  }));
  connections.forEach((conn) => {
    conn.segments.forEach(([i, j]) => {
      grid.grid[i][j].netId = conn.netID;
    });
  });
  return grid;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      width: `calc(100% - ${circuitDrawerWidth}px - ${historyDrawerWidth}px)`,
      left: circuitDrawerWidth,
    },
    circuitDrawer: {
      width: circuitDrawerWidth,
      flexShrink: 0,
    },
    circuitDrawerPaper: {
      width: circuitDrawerWidth,
    },
    historyDrawer: {
      width: historyDrawerWidth,
    },
    historyDrawerPaper: {
      width: historyDrawerWidth,
      flexShrink: 0,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
  })
);

function App() {
  const [routeResult, setRouteResult] = useState<RouteResult>();
  const [routeMap, setRouteMap] = useState<RouteMap>();
  const classes = useStyles();

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

  const [mapName, setMapName] = useState("impossible.infile");
  useEffect(() => {
    if (mapName === "") return;
    axios.get<string>(`benchmarks/${mapName}`).then((res) => {
      setRouteMap(parseRoutingMapString(res.data));
    });

    /// TODO clean up
  }, [mapName]);

  const routingMapList = (
    <List>
      {infiles?.map((filename) => (
        <ListItem
          button
          key={filename}
          onClick={() => setMapName(filename)}
          selected={filename === mapName}
        >
          {filename.split(".")[0]}
        </ListItem>
      ))}
    </List>
  );

  const [routeHistory, setRouteHistory] = useState(
    [] as Array<IntermediateRouteResult>
  );

  const innerResultCallback = (result: IntermediateRouteResult) => {
    setRouteHistory((prev) => {
      if (prev.length > 100) return prev;
      return [...prev, result];
    });
  };

  useEffect(() => {
    if (!routeMap) return;

    setRouteHistory([]);
    const routeResult = route(routeMap, innerResultCallback);

    if (!routeResult.succeed) {
      setRouteResult(undefined);
      return;
    }
    const succeed = routeResult as MapRouteSuccess;
    console.log(succeed);

    const grid = makeRouteResultGridFromConnections(
      routeMap.size,
      succeed.connections
    );
    setRouteResult(grid);
  }, [routeMap]);

  const routingHistory = (
    <List>
      {routeHistory.map((result, i) => {
        switch (result.type) {
          case IntermediateRouteResultType.Succeed:
            const succeedResult = result as IntermediateRouteSucceed;
            return (
              <ListItem
                button
                key={`history ${i}`}
                onClick={() => {
                  if (!routeMap) return;
                  const grid = makeRouteResultGridFromConnections(
                    routeMap.size,
                    [
                      ...succeedResult.connectionHistory,
                      succeedResult.newConnection,
                    ]
                  );
                  setRouteResult(grid);
                }}
              >
                <Box color="success.main" className="icon-alignment">
                  <CheckIcon fontSize="small" />
                </Box>
                <ConnectSucceed
                  result={result as IntermediateRouteSucceed}
                ></ConnectSucceed>
              </ListItem>
            );
          case IntermediateRouteResultType.FailNet:
            const failNetResult = result as IntermediateRouteFailNet;
            return (
              <ListItem
                button
                key={`history ${i}`}
                onClick={() => {
                  if (!routeMap) return;
                  const grid = makeRouteResultGridFromConnections(
                    routeMap.size,
                    failNetResult.connectionHistory
                  );
                  setRouteResult(grid);
                }}
              >
                <Box color="error.main" className="icon-alignment">
                  <ErrorOutlineIcon fontSize="small" />
                </Box>
                <ConnectFailNet
                  result={result as IntermediateRouteFailNet}
                ></ConnectFailNet>
              </ListItem>
            );
          case IntermediateRouteResultType.FailAll:
            return (
              <ListItem button key={`history ${i}`}>
                <Box color="error.main" className="icon-alignment">
                  <BannedIcon fontSize="small" />
                </Box>
                <ConnectFailAll
                  result={result as IntermediateRouteFailAll}
                ></ConnectFailAll>
              </ListItem>
            );
          default:
            return "0";
        }
      })}
    </List>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            {" "}
            <Typography variant="h6" noWrap>
              {mapName}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          open={true}
          variant="permanent"
          className={classes.circuitDrawer}
          classes={{ paper: classes.circuitDrawerPaper }}
        >
          {routingMapList}
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {routeMap ? (
            <Grid routeMap={routeMap} routeResult={routeResult} />
          ) : (
            <></>
          )}
        </main>
        <Drawer
          open={true}
          variant="permanent"
          className={classes.historyDrawer}
          classes={{ paper: classes.historyDrawerPaper }}
          anchor="right"
        >
          {routingHistory}
        </Drawer>
      </ThemeProvider>
    </div>
  );
}

export default App;
