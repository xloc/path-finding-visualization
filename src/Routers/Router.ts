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

    for (const [i, j] of expansionList) {
      progressGrid.grid[i][j] = iExpand;
    }
    for (const [i, j] of expansionList) {
      for (const [ni, nj] of adjacentCoors(i, j)) {
        if (canExpand(ni, nj)) {
          newExpansionList.push([ni, nj]);
          progressGrid.grid[ni][nj] = -2;
          /// whether found one of the targets
          if (targetGrid.grid[ni][nj]) {
            connectedTargetCoors = [ni, nj];
          }
        }
      }
    }
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
  while (true) {
    /* eslint-disable no-loop-func */
    [i, j] = adjacentCoors(i, j).filter(([ni, nj]) => {
      return inRange(ni, nj) && progressGrid.grid[ni][nj] === iPrevLayer;
    })[0];
    /* eslint-enable no-loop-func */

    if (progressGrid.grid[i][j] === 0) break;
    segments.push([i, j]);
    iPrevLayer--;
  }

  return {
    succeed: true,
    segments,
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

export interface MapRouteResult {
  succeed: boolean;
}

export interface MapRouteSuccess extends MapRouteResult {
  netRouteSequence: Array<Net>;
  connections: Array<Connection>;
}

export interface RouteQueueItem {
  priority: number;
  net: Net;
}

export interface IntermediateRouteSucceed extends IntermediateRouteResult {
  connectionHistory: Array<Connection>;
  newConnection: Connection;
}

export interface IntermediateRouteFailNet extends IntermediateRouteResult {
  connectionHistory: Array<Connection>;
  failedNet: Net;
}

export interface IntermediateRouteFailAll extends IntermediateRouteResult {
  connectionHistory: Array<Connection>;
}

export enum IntermediateRouteResultType {
  Succeed = 0,
  FailNet,
  FailAll,
}

export interface IntermediateRouteResult {
  type: IntermediateRouteResultType;
}

export function route(
  routeMap: RouteMap,
  yieldResultCallback: (arg0: IntermediateRouteResult) => void
): MapRouteResult {
  function tryToRoute(
    nets: Array<Net>,
    routedConnections: Array<Connection>
  ): MapRouteResult {
    if (nets.length === 0) {
      return {
        succeed: true,
        netRouteSequence: [],
        connections: [],
      } as MapRouteSuccess;
    }

    for (let i = 0; i < nets.length; i++) {
      const net = nets[i];

      /// try to route the net
      const obstacleGrid = makeObstacleGrid(routeMap, i, routedConnections);
      const netResult = routeNet(obstacleGrid, net);
      if (!netResult.succeed) {
        yieldResultCallback({
          type: IntermediateRouteResultType.FailNet,
          connectionHistory: routedConnections,
          failedNet: net,
        } as IntermediateRouteFailNet);
        continue;
      }
      const netSucceed = netResult as NetRoutingSuccess;
      yieldResultCallback({
        type: IntermediateRouteResultType.Succeed,
        connectionHistory: routedConnections,
        newConnection: netSucceed.connection,
      } as IntermediateRouteSucceed);

      /// if this net can be connected => try route other nets
      const otherNets = [...nets.slice(0, i), ...nets.slice(i + 1)];
      const otherNetResult = tryToRoute(otherNets, [
        ...routedConnections,
        netSucceed.connection,
      ]);
      if (otherNetResult.succeed) {
        const otherNetSucceed = otherNetResult as MapRouteSuccess;
        return {
          succeed: true,
          netRouteSequence: [net, ...otherNetSucceed.netRouteSequence],
          connections: [netSucceed.connection, ...otherNetSucceed.connections],
        } as MapRouteSuccess;
      }
    }

    yieldResultCallback({
      type: IntermediateRouteResultType.FailAll,
      connectionHistory: routedConnections,
    } as IntermediateRouteFailAll);
    return { succeed: false };
  }

  return tryToRoute(routeMap.nets, []);
}
