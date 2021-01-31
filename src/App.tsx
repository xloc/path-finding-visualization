import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AppBar,
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
import { route, MapRouteSuccess } from "./Routers/Router";
import { Grid as GridModel } from "./Models/Grid";

export interface RouteResultCell {
  netId: number;
}
export type RouteResult = GridModel<RouteResultCell>;

const drawerWidth = 150;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
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

  useEffect(() => {
    if (!routeMap) return;

    const routeResult = route(routeMap);

    if (!routeResult.succeed) {
      setRouteResult(undefined);
      return;
    }
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
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper,
          }}
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
      </ThemeProvider>
    </div>
  );
}

export default App;
