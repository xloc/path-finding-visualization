import Connection from "../Models/Connection";
import { Grid, GridSize } from "../Models/Grid";
import { Coors, Net, RouteMap } from "../Models/RouteMap";
import { RouteResultCell } from "../Models/RouteResult";

export function makeTargetGrid(size: GridSize, targets: Array<Coors>) {
  const grid = new Grid(size, (i, j) => {
    return false;
  });

  targets.forEach(([i, j]) => {
    grid.grid[i][j] = true;
  });

  return grid;
}

export function adjacentCoors(i: number, j: number): Array<Coors> {
  return [
    [i + 1, j],
    [i - 1, j],
    [i, j + 1],
    [i, j - 1],
  ];
}

export function makeObstacleGrid(
  routeMap: RouteMap,
  net: Net,
  routedConnections: Array<Connection>
) {
  const routingNetID = net.netID;
  const grid = new Grid(routeMap.size, (i, j) => {
    return false;
  });

  /// walls are obstacles
  routeMap.walls.forEach(([i, j]) => {
    grid.grid[i][j] = true;
  });

  /// net pins that are not in the routing net are obstacles
  routeMap.nets
    .filter((net) => net.netID !== routingNetID)
    .forEach((net) => {
      net.pins.forEach(([i, j]) => {
        grid.grid[i][j] = true;
      });
    });

  /// routed connection are obstacles
  routedConnections.forEach((connection) => {
    connection.segments.forEach(([i, j]) => {
      grid.grid[i][j] = true;
    });
  });

  return grid;
}

export function makeRouteResultGridFromConnections(
  size: GridSize,
  connections: Array<Connection>
) {
  const grid = new Grid<RouteResultCell>(size, (i, j) => ({
    netId: -1,
  }));
  connections.forEach((conn) => {
    conn.segments.forEach(([i, j]) => {
      grid.grid[i][j].netId = conn.netID;
    });
  });
  return grid;
}
