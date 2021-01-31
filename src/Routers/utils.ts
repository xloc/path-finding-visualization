import Connection from "../Models/Connection";
import { Grid, GridSize } from "../Models/Grid";
import { Coors, RouteMap } from "../Models/RouteMap";

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
  routingNetID: number,
  routedConnections: Array<Connection>
) {
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
