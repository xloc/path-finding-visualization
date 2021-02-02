import Connection from "../Models/Connection";
import { Grid } from "../Models/Grid";
import { Coors, Net, RouteMap } from "../Models/RouteMap";
import {
  adjacentCoors,
  makeObstacleGrid,
  makeRouteResultGridFromConnections,
  makeTargetGrid,
} from "./utils";
import {
  ConnectionRoutingResult,
  ConnectionRoutingSuccess,
  IntermediateRouteFailAll,
  IntermediateRouteFailNet,
  IntermediateRouteResult,
  IntermediateRouteResultType,
  IntermediateRouteSucceed,
  MapRouteResult,
  MapRouteSuccess,
  NetRoutingResult,
  NetRoutingSuccess,
  ExpandProgress,
  BacktrackProgress,
  ConnectionProgress,
} from "./RouteResults";
import { RouteResultCell } from "../Models/RouteResult";
import aStarRoute from "./aStarRoute";

export const buildExpandProgress = (progressGrid: Grid<number>) => {
  return new ExpandProgress(
    progressGrid.copyNumber(),
    progressGrid.map((val) => {
      return val === -2;
    })
  );
};

export class ConnectionRouteHistory {
  constructor(
    public progress: Array<ConnectionProgress>,
    public sources: Coors[]
  ) {}
}

export type ConnectionRouter = (
  obstacleGrid: Grid<boolean>,
  sources: Array<Coors>,
  targetGrid: Grid<boolean>,
  historyRecord?: ConnectionRouteHistory
) => ConnectionRoutingResult;

export function dijkstraRoute(
  obstacleGrid: Grid<boolean>,
  sources: Array<Coors>,
  targetGrid: Grid<boolean>,
  historyRecord?: ConnectionRouteHistory
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
    if (historyRecord)
      historyRecord.progress.push({
        type: "expand",
        progress: buildExpandProgress(progressGrid),
      });
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

    if (historyRecord)
      historyRecord.progress.push({
        type: "backtrack",
        progress: new BacktrackProgress(progressGrid, [...segments], [i, j]),
      });

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

export class NetRouteHistory {
  constructor(
    public net: Net,
    public segmentGrid: Grid<RouteResultCell>,
    public connectionHistories: Array<ConnectionRouteHistory>
  ) {}
}

export function routeNet(
  obstacleGrid: Grid<boolean>,
  net: Net,
  connectionRouter: ConnectionRouter,
  historyRecord?: NetRouteHistory
): NetRoutingResult {
  const [sourcePin, ...targets] = net.pins;
  let sources = [sourcePin];
  const targetGrid = makeTargetGrid(obstacleGrid.size, targets);
  let nTargets = targets.length;

  const getConnectionHistory = () => {
    if (historyRecord) {
      const ch = new ConnectionRouteHistory([], [...sources]);
      historyRecord.connectionHistories.push(ch);
      return ch;
    } else {
      return undefined;
    }
  };

  while (nTargets > 0) {
    const h = getConnectionHistory();
    const result = connectionRouter(obstacleGrid, sources, targetGrid, h);
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

export class CircuitRouteHistory {
  constructor(public netHistories: Array<NetRouteHistory>) {}
}

export const routeCircuitUntilFail = (
  routeMap: RouteMap,
  netSequence: Array<Net>,
  historyRecord: CircuitRouteHistory,
  connectionRouter: ConnectionRouter
) => {
  const routedConnections: Array<Connection> = [];
  for (const net of netSequence) {
    const wireGrid = makeRouteResultGridFromConnections(
      routeMap.size,
      routedConnections
    );
    const netHistory = new NetRouteHistory(net, wireGrid, []);
    historyRecord.netHistories.push(netHistory);

    const obstacleGrid = makeObstacleGrid(routeMap, net, routedConnections);
    const netResult = routeNet(obstacleGrid, net, connectionRouter, netHistory);
    if (!netResult.succeed) break;
    const succeed = netResult as NetRoutingSuccess;
    routedConnections.push(succeed.connection);
  }
};

export function routeCircuit(
  routeMap: RouteMap,
  yieldResultCallback: (arg0: IntermediateRouteResult) => void,
  connectionRouter: ConnectionRouter
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
      const obstacleGrid = makeObstacleGrid(routeMap, net, routedConnections);
      const netResult = routeNet(obstacleGrid, net, connectionRouter);
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
