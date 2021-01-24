import { MapCellType } from "./GridModel";

export default class DijkstraRouting {
  constructor(gridModel, sources, targets) {
    const { nRow, nCol } = gridModel;

    targets = new Set(targets.map(({ x, y }) => JSON.stringify([x, y])));

    this.isInBound = (i, j) => (i >= 0 && i < nRow && j >= 0 && j < nCol);

    this.isBlocked = (i, j) => {
      if (!this.isInBound(i, j)) return true;
      if (targets.has(JSON.stringify([i, j]))) return false;
      if (gridModel.mapGrid[i][j].type === MapCellType.void) return false;
      else return true;
    }

    this.isConnected = (i, j) => {
      return targets.has(JSON.stringify([i, j]));
    }

    const sourcesSet = new Set(sources.map(({ x, y }) => [x, y]).map(JSON.stringify));
    this.isSources = (i, j) => {
      return sourcesSet.has(JSON.stringify([i, j]));
    }

    const processingGrid = Array(nRow).fill(null)
      .map((a, x) => Array(nCol).fill(null)
        .map((a, y) => 0)
      );

    const expansionList = new Set(sources.map(({ x, y }) => [x, y]).map(JSON.stringify));
    this.states = { processingGrid, expansionList, iExpand: 1 }
  }

  next() {
    const states = this.states
    if (states.expansionFinished) {
      if (states.pathFound) {
        if (states.trackFound) return false;
        else {
          this.states = backTrace(this.isInBound, this.isSources, this.states);
        }
      } else return false;
    } else {
      this.states = expand(this.isBlocked, this.isConnected, this.states);
    }
    return true;
  }

  getMarkGrid() {
    return this.states.processingGrid.map((row, i) => {
      return row.map((cell, j) => {
        return {
          visited: cell !== 0,
          active: this.states.expansionList.has(JSON.stringify([i, j])),
          value: cell,
        }
      })
    })
  }
}

function backTrace(isInBound, isSources, { track, connectedCoor, processingGrid, iExpand, ...rest }) {
  if (isSources(...connectedCoor)) {
    return { ...rest, track, processingGrid, trackFound: true }
  }

  iExpand--;
  const newTrack = track || [];
  const [ci, cj] = connectedCoor;

  for (const [i, j] of [[ci + 1, cj], [ci - 1, cj], [ci, cj + 1], [ci, cj - 1]]) {
    if (isInBound(i, j) && processingGrid[i][j] === iExpand) {
      return { ...rest, connectedCoor: [i, j], processingGrid, iExpand, track: [[i, j], ...newTrack] };
    }

  }

}

function expand(isBlocked, isConnected, states) {
  if (states.expansionFinished) return states;

  const { processingGrid, expansionList, iExpand } = states;
  console.log({ processingGrid, expansionList });
  if (expansionList.size === 0) {
    return {
      expansionFinished: true,
      pathFound: false,
      expansionList: new Set(),
      processingGrid: processingGrid,
      iExpand
    }
  }


  const nextExpansionList = new Set();
  for (const entry of expansionList) {
    const [ci, cj] = JSON.parse(entry);
    processingGrid[ci][cj] = iExpand;

    if (isConnected(ci, cj)) {
      return {
        expansionFinished: true,
        pathFound: true,
        connectedCoor: [ci, cj],
        expansionList: new Set(),
        processingGrid: processingGrid,
        iExpand,
        nExpand: iExpand,
      }
    }

    for (const [i, j] of [[ci + 1, cj], [ci - 1, cj], [ci, cj + 1], [ci, cj - 1]]) {

      if (!isBlocked(i, j) && processingGrid[i][j] === 0) {
        const jsonCoors = JSON.stringify([i, j])
        if (!nextExpansionList.has(jsonCoors)) {
          nextExpansionList.add(jsonCoors);

        }
      }
    }
  }

  return {
    processingGrid,
    expansionList: nextExpansionList,
    iExpand: iExpand + 1
  }
}