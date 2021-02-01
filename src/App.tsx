import React, { useEffect, useState } from "react";
import {
  AppBar,
  Container,
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
import Slider from "@material-ui/core/Slider";

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
import {
  CircuitRouteHistory,
  ConnectionRouteHistory,
  NetRouteHistory,
  routeCircuit,
  routeCircuitUntilFail,
} from "./Routers/Router";
import { RouteResult, RouteResultCell } from "./Models/RouteResult";
import { useRouteMapSelector } from "./Components/useRouteMapSelector";
import Connection from "./Models/Connection";
import {
  ConnectionProgress,
  IntermediateRouteFailAll,
  IntermediateRouteFailNet,
  IntermediateRouteResult,
  IntermediateRouteResultType,
  IntermediateRouteSucceed,
  MapRouteSuccess,
} from "./Routers/RouteResults";
import { makeRouteResultGridFromConnections } from "./Routers/utils";

const circuitDrawerWidth = 150;
const historyDrawerWidth = 200;
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

const buildRouteProgress = (progress: CircuitRouteHistory) => {
  const currentProgress: Array<[NetRouteHistory, ConnectionProgress]> = [];
  for (const netH of progress.netHistories) {
    for (const connH of netH.connectionHistories) {
      for (const p of connH.progress) {
        currentProgress.push([netH, p]);
      }
    }
  }
  return currentProgress;
};

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
      if (prev.length > 200) return prev;
      if (result.type === IntermediateRouteResultType.Succeed)
        return [...prev, result];
      else return prev;
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

  const [currentProgress, setCurrentProgress] = useState<
    Array<[NetRouteHistory, ConnectionProgress]>
  >();
  useEffect(() => {
    if (!routeMap) return;
    if (!currentHistory) return;

    switch (currentHistory.type) {
      case IntermediateRouteResultType.Succeed:
        {
          const succeed = currentHistory as IntermediateRouteSucceed;

          const progress = new CircuitRouteHistory([]);
          routeCircuitUntilFail(
            routeMap,
            [...succeed.connectionHistory, succeed.newConnection]
              .map((conn) => conn.netID)
              .map((id) => routeMap.nets[id]),
            progress
          );

          setCurrentProgress(buildRouteProgress(progress));
        }
        break;
      case IntermediateRouteResultType.FailNet:
        {
          const failNet = currentHistory as IntermediateRouteFailNet;

          const progress = new CircuitRouteHistory([]);
          routeCircuitUntilFail(
            routeMap,
            [
              ...failNet.connectionHistory
                .map((conn) => conn.netID)
                .map((id) => routeMap.nets[id]),
              failNet.failedNet,
            ],
            progress
          );

          setCurrentProgress(buildRouteProgress(progress));
        }
        break;
      case IntermediateRouteResultType.FailAll:
        break;
      default:
        console.error("should not reach here");
    }
  }, [currentHistory]);

  useEffect(() => {
    if (!currentProgress) return;
    // console.log(currentProgress);
  }, [currentProgress]);

  const [currentProgressIndex, setCurrentProgressIndex] = useState(0);

  useEffect(() => {
    if (!routeMap || !currentProgress || !currentProgressIndex) return;

    const [netHistory, progress] = currentProgress[currentProgressIndex];

    // setRouteResult();
  }, [currentProgressIndex]);

  const progressSlide = currentProgress ? (
    <Slider
      onChange={(e, val) => setCurrentProgressIndex(val as number)}
      min={0}
      max={currentProgress.length - 1}
    />
  ) : (
    <Slider disabled />
  );

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
            <Grid circuit={routeMap} segments={routeResult} />
          ) : (
            <></>
          )}
          <div>{progressSlide}</div>
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
