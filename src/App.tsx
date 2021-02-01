import React, { useEffect, useState } from "react";
import {
  AppBar,
  createStyles,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  makeStyles,
  Theme,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@material-ui/core";

/// User Component Imports
import theme from "./theme";
import "./App.css";
import Grid from "./Components/Grid";
import {
  ConnectSucceed,
  ConnectFailAll,
  ConnectFailNet,
} from "./Components/RouteProgressEntry";

/// User Model Imports
import { Grid as GridModel, GridSize } from "./Models/Grid";
import { RouteMap } from "./Models/RouteMap";
import { routeCircuit } from "./Routers/Router";
import { RouteResult, RouteResultCell } from "./Models/RouteResult";
import { useRouteMapSelector } from "./Components/useRouteMapSelector";
import Connection from "./Models/Connection";
import {
  IntermediateRouteFailAll,
  IntermediateRouteFailNet,
  IntermediateRouteResult,
  IntermediateRouteResultType,
  IntermediateRouteSucceed,
  MapRouteSuccess,
} from "./Routers/RouteResults";

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

const circuitDrawerWidth = 150;
const historyDrawerWidth = 150;
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

  const { routeMapSelector, mapName } = useRouteMapSelector(setRouteMap);

  const [routeHistories, setRouteHistories] = useState(
    [] as Array<IntermediateRouteResult>
  );

  const innerResultCallback = (result: IntermediateRouteResult) => {
    setRouteHistories((prev) => {
      if (prev.length > 100) return prev;
      return [...prev, result];
    });
  };

  const [
    currentHistory,
    setCurrentHistory,
  ] = useState<IntermediateRouteResult>();

  useEffect(() => {
    if (!routeMap) return;

    setCurrentHistory(undefined);
    setRouteHistories([]);

    const routeResult = routeCircuit(routeMap, innerResultCallback);

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

  useEffect(() => {
    if (!routeMap) return;
    if (!currentHistory) return;

    switch (currentHistory.type) {
      case IntermediateRouteResultType.Succeed:
        {
          const succeed = currentHistory as IntermediateRouteSucceed;
          const grid = makeRouteResultGridFromConnections(routeMap.size, [
            ...succeed.connectionHistory,
            succeed.newConnection,
          ]);
          setRouteResult(grid);
        }
        break;
      case IntermediateRouteResultType.FailNet:
        {
          const failNet = currentHistory as IntermediateRouteFailNet;
          const grid = makeRouteResultGridFromConnections(
            routeMap.size,
            failNet.connectionHistory
          );
          setRouteResult(grid);
        }
        break;
      case IntermediateRouteResultType.FailAll:
        break;
      default:
        console.error("should not reach here");
    }
    /// TODO: figure out why adding routeMap leads to problem
  }, [currentHistory]); // eslint-disable-line react-hooks/exhaustive-deps

  const routingHistory = (
    <List>
      {routeHistories.map((result, i) => (
        <ListItem
          button
          key={`history ${i}`}
          onClick={() => setCurrentHistory(result)}
          selected={result === currentHistory}
        >
          {(() => {
            switch (result.type) {
              case IntermediateRouteResultType.Succeed:
                return (
                  <ConnectSucceed
                    result={result as IntermediateRouteSucceed}
                  ></ConnectSucceed>
                );
              case IntermediateRouteResultType.FailNet:
                return (
                  <ConnectFailNet
                    result={result as IntermediateRouteFailNet}
                  ></ConnectFailNet>
                );
              case IntermediateRouteResultType.FailAll:
                return (
                  <ConnectFailAll
                    result={result as IntermediateRouteFailAll}
                  ></ConnectFailAll>
                );
              default:
                return "0";
            }
          })()}
        </ListItem>
      ))}
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
          {routeMapSelector}
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
