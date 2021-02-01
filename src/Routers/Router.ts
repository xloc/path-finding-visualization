import Connection from "../Models/Connection";
import { Grid } from "../Models/Grid";
import { Coors, Net, RouteMap } from "../Models/RouteMap";
import { adjacentCoors, makeObstacleGrid, makeTargetGrid } from "./utils";
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
  NetRouteProgress,
  ExpandProgress,
  BacktrackProgress,
} from "./RouteResults";

export const buildExpandProgress = (progressGrid: Grid<number>) => {
  return new ExpandProgress(
    progressGrid.map((val) => {
      return val >= 0;
    })
  );
};

export async function routeConnection(
  obstacleGrid: Grid<boolean>,
  sources: Array<Coors>,
  targetGrid: Grid<boolean>,
  onExpand?: (arg0: ExpandProgress) => Promise<void>,
  onBacktrack?: (arg0: BacktrackProgress) => Promise<void>
): Promise<ConnectionRoutingResult> {
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
    if (onExpand) await onExpand(buildExpandProgress(progressGrid));
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

export async function routeNet(
  obstacleGrid: Grid<boolean>,
  net: Net,
  onProgress: (arg0: NetRouteProgress) => Promise<void> = async () => {}
): Promise<NetRoutingResult> {
  const [sourcePin, ...targets] = net.pins;
  let sources = [sourcePin];
  const targetGrid = makeTargetGrid(obstacleGrid.size, targets);
  let nTargets = targets.length;

  while (nTargets > 0) {
    const result = await routeConnection(obstacleGrid, sources, targetGrid);
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

export async function routeCircuit(
  routeMap: RouteMap,
  yieldResultCallback: (arg0: IntermediateRouteResult) => void
): Promise<MapRouteResult> {
  async function tryToRoute(
    nets: Array<Net>,
    routedConnections: Array<Connection>
  ): Promise<MapRouteResult> {
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
      const netResult = await routeNet(obstacleGrid, net);
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
      const otherNetResult = await tryToRoute(otherNets, [
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
