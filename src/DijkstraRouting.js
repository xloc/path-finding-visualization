import { MapCellType } from "./GridModel";

export default class DijkstraRouting {
  constructor(gridModel, sources, targets) {
    const { nRow, nCol } = gridModel;

    targets = new Set(targets.map(({ x, y }) => JSON.stringify([x, y])));

    this.isBlocked = (i, j) => {
      if (i < 0 || i >= nRow || j < 0 || j >= nCol) return true;
      if (targets.has(JSON.stringify([i, j]))) return false;
      if (gridModel.mapGrid[i][j].type === MapCellType.void) return false;
      else return true;
    }

    this.isConnected = (i, j) => {
      return targets.has(JSON.stringify([i, j]));
    }

    const processingGrid = Array(nRow).fill(null)
      .map((a, x) => Array(nCol).fill(null)
        .map((a, y) => 0)
      );

    const expansionList = sources.map(({ x, y }) => [x, y])
    this.states = { processingGrid, expansionList, iExpand: 1 }
  }

  next() {
    if (!this.states.expansionFinished)
      this.states = expand(this.isBlocked, this.isConnected, this.states);
    else {
      if (this.states.pathFound) {
        this.states = backTrace(this.states);
      }
    }
  }
}

function backTrace({ connectedCoor, processingGrid }) {

}

function expand(isBlocked, isConnected, states) {
  if (states.expansionFinished) return states;

  const { processingGrid, expansionList, iExpand } = states;
  if (states.expansionList.length === 0) {
    return {
      expansionFinished: true,
      pathFound: false,
      expansionList: [],
      processingGrid: processingGrid,
      iExpand
    }
  }


  const nextExpansionList = new Set();
  for (const [ci, cj] of expansionList) {
    processingGrid[ci][cj] = iExpand;

    if (isConnected(ci, cj)) {
      return {
        expansionFinished: true,
        pathFound: true,
        connectedCoor: [ci, cj],
        expansionList: [],
        processingGrid: processingGrid,
        iExpand
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
    expansionList: [...nextExpansionList].map(JSON.parse),
    iExpand: iExpand + 1
  }
}