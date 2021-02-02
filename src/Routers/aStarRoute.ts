import { Grid } from "../Models/Grid";
import { Coors } from "../Models/RouteMap";
import { ConnectionRouteHistory } from "./Router";
import {
  BacktrackProgress,
  ConnectionProgress,
  ConnectionRoutingResult,
  ConnectionRoutingSuccess,
  ExpandProgress,
} from "./RouteResults";
import { adjacentCoors } from "./utils";
import PriorityQueue from "js-priority-queue";
import { GridCell } from "../Components/Grid";

const coorsDist = (a: Coors, b: Coors) => {
  return a[0] - b[0] + (a[1] - b[1]);
};

class QueueItem {
  dist: number;
  constructor(public coors: Coors, targets: Coors[]) {
    let [closest, ...others] = targets;
    let minDist = coorsDist(closest, coors);
    for (const c of others) {
      const d = coorsDist(c, coors);
      if (minDist > d) {
        minDist = d;
        closest = c;
      }
    }
    this.dist = minDist;
  }
}

const buildExpandProgress = (
  progressGrid: Grid<number>,
  queue: any
): ConnectionProgress => {
  const active = new Grid<boolean>(progressGrid.size, (i, j) => false);

  return {
    type: "expand",
    progress: new ExpandProgress(
      progressGrid.map((a) => a),
      active
    ),
  };
};

const compareItem = (a: QueueItem, b: QueueItem) => {
  return a.dist - b.dist;
};

const buildQueue = (sources: Coors[], targets: Coors[]) => {
  let queue = new PriorityQueue<QueueItem>({ comparator: compareItem });
  for (const s of sources) {
    queue.queue(new QueueItem(s, targets));
  }
  return queue;
};

const popAllEqualDist = (queue: PriorityQueue<QueueItem>) => {
  const coorsList: Coors[] = [];
  if (queue.length === 0) return coorsList;

  const minDist = queue.peek().dist;
  while (queue.length > 0 && queue.peek().dist === minDist) {
    coorsList.push(queue.dequeue().coors);
  }
  return coorsList;
};

const convertTargetGridToList = (targetGrid: Grid<boolean>) => {
  const list: Coors[] = [];
  targetGrid.grid.forEach((row, i) => {
    row.forEach((isTarget, j) => {
      if (isTarget) list.push([i, j]);
    });
  });
  return list;
};

export default function aStarRoute(
  obstacleGrid: Grid<boolean>,
  sources: Coors[],
  targetGrid: Grid<boolean>,
  historyRecord?: ConnectionRouteHistory
): ConnectionRoutingResult {
  const { col, row } = obstacleGrid.size;
  const progressGrid = new Grid(obstacleGrid.size, (i, j) => -1);
  const expandFromGrid = new Grid(
    obstacleGrid.size,
    (i, j): Coors | null => null
  );
  const inRange = (i: number, j: number) =>
    i >= 0 && i < row && j >= 0 && j < col;
  const canExpand = (i: number, j: number) =>
    inRange(i, j) && !obstacleGrid.grid[i][j] && progressGrid.grid[i][j] === -1;
  const targets = convertTargetGridToList(targetGrid);

  /// expansion
  let isStart = true;
  const queue = buildQueue(sources, targets);

  // let iExpand = 0;
  let connectedTargetCoors: Coors | null = null;
  while (queue.length > 0) {
    const expansionList = popAllEqualDist(queue);

    for (const [i, j] of expansionList) {
      progressGrid.grid[i][j] = isStart ? 0 : 1;
      isStart = false;
    }
    for (const [i, j] of expansionList) {
      for (const [ni, nj] of adjacentCoors(i, j)) {
        if (canExpand(ni, nj)) {
          queue.queue(new QueueItem([ni, nj], targets));
          expandFromGrid.grid[ni][nj] = [i, j];

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
      queue.clear();
    }

    if (historyRecord)
      historyRecord.progress.push(buildExpandProgress(progressGrid, queue));
  }

  if (!connectedTargetCoors) {
    return { succeed: false };
  }

  /// backtrack
  let [i, j]: Coors = connectedTargetCoors;
  const segments: Array<Coors> = [];
  while (true) {
    [i, j] = expandFromGrid.grid[i][j] as Coors;

    if (historyRecord)
      historyRecord.progress.push({
        type: "backtrack",
        progress: new BacktrackProgress(progressGrid, [...segments], [i, j]),
      });

    if (progressGrid.grid[i][j] === 0) break;
    segments.push([i, j]);
  }

  return {
    succeed: true,
    segments,
    connectedPin: connectedTargetCoors,
  } as ConnectionRoutingSuccess;
}
