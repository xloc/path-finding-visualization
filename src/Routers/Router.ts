import { Grid, GridSize } from "../Models/Grid";
import { Coors, Net, RouteMap } from "../Models/RouteMap";

export interface Connection {
  netID: number;
  segments: Array<Coors>;
}

interface ConnectionRoutingResult {
  succeed: boolean;
}

interface ConnectionRoutingSuccess extends ConnectionRoutingResult {
  connectedPin: Coors;
  segments: Array<Coors>;
}

function adjacentCoors(i: number, j: number): Array<Coors> {
  return [
    [i + 1, j],
    [i - 1, j],
    [i, j + 1],
    [i, j - 1],
  ];
}

export function routeConnection(
  obstacleGrid: Grid<boolean>,
  sources: Array<Coors>,
  targetGrid: Grid<boolean>
): ConnectionRoutingResult {
  const { col, row } = obstacleGrid.size;
  const progressGrid = new Grid<number>(obstacleGrid.size, (i, j) => -1);
  const inRange = (i: number, j: number) =>
    i >= 0 && i < row && j >= 0 && j < col;
  const canExpand = (i: number, j: number) =>
    inRange(i, j) && !obstacleGrid.grid[i][j] && progressGrid.grid[i][j] === -1;

  /// expansion
  let expansionList = sources;
  let iExpand = 0;
  let connectedTargetCoors: Coors | null = null;
  while (expansionList.length > 0) {
    const newExpansionList = [] as Array<Coors>;

    expansionList.forEach(([i, j]) => {
      adjacentCoors(i, j).forEach(([ni, nj]) => {
        progressGrid.grid[i][j] = iExpand;
        if (canExpand(ni, nj)) {
          newExpansionList.push([ni, nj]);
          progressGrid.grid[ni][nj] = -2;
          /// whether found one of the targets
          if (targetGrid.grid[ni][nj]) {
            connectedTargetCoors = [ni, nj];
          }
        }
      });
    });
    /// whether found target
    if (connectedTargetCoors) {
      expansionList = [];
    } else {
      expansionList = newExpansionList;
      iExpand++;
    }
  }

  if (!connectedTargetCoors) {
    return { succeed: false };
  }

  /// backtrack
  const nExpand = iExpand;
  let [i, j]: Coors = connectedTargetCoors;
  let iPrevLayer = nExpand;
  const segments: Array<Coors> = [];
  const condition = progressGrid.grid[i][j] !== 0;
  while (progressGrid.grid[i][j] !== 0) {
    [i, j] = adjacentCoors(i, j).filter(([ni, nj]) => {
      return inRange(ni, nj) && progressGrid.grid[ni][nj] === iPrevLayer;
    })[0];

    segments.push([i, j]);
    iPrevLayer--;
  }

  return {
    segments,
    succeed: true,
    connectedPin: connectedTargetCoors,
  } as ConnectionRoutingSuccess;
}

function makeTargetGrid(size: GridSize, targets: Array<Coors>) {
  const grid = new Grid(size, (i, j) => {
    return false;
  });

  targets.forEach(([i, j]) => {
    grid.grid[i][j] = true;
  });

  return grid;
}

export interface NetRoutingResult {
  succeed: boolean;
}
export interface NetRoutingSuccess extends NetRoutingResult {
  connection: Connection;
}
export function routeNet(
  obstacleGrid: Grid<boolean>,
  net: Net
): NetRoutingResult {
  const [sourcePin, ...targets] = net.pins;
  let sources = [sourcePin];
  const targetGrid = makeTargetGrid(obstacleGrid.size, targets);
  let nTargets = targets.length;

  while (nTargets > 0) {
    const result = routeConnection(obstacleGrid, sources, targetGrid);
    /// fail to route this net if connection route is fail
    if (!result.succeed) break;
    const success = result as ConnectionRoutingSuccess;

    /// update sources and targets
    nTargets -= 1;
    sources = [...sources, ...success.segments, success.connectedPin];
    const [ci, cj] = success.connectedPin; // connected pin coor
    targetGrid.grid[ci][cj] = false;
  }

  if (nTargets > 0) {
    return { succeed: false };
  } else {
    return {
      succeed: true,
      connection: {
        netID: net.netID,
        segments: sources,
      },
    } as NetRoutingSuccess;
  }
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

export function route(routeMap: RouteMap) {
  const routedConnections: Array<Connection> = [];

  function tryToRoute(nets: Array<Net>) {
    for (let i = 0; i < nets.length; i++) {
      const net = nets[i];
      const obstacleGrid = makeObstacleGrid(routeMap, i, routedConnections);
      const result = routeNet(obstacleGrid, net);
      if (result.succeed) {
        return;
      }
    }
  }

  tryToRoute(routeMap.nets);
}
