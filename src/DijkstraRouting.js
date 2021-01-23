import { MapCellType } from "./GridModel";

export default class DijkstraRouting {
  constructor(gridModel, sources, targets) {
    const { nRow, nCol } = gridModel;

    targets = new Set(targets.map(({x, y}) => JSON.stringify([x, y])));

    this.isBlocked = (i, j) => {
      if (i < 0 || i >= nRow || j < 0 || j >= nCol) return true;
      if (targets.has(JSON.stringify([i, j]))) return false;
      if (gridModel.mapGrid[i][j].type === MapCellType.void) return false;
      else return true;
    }

    this.isConnected = (i, j) => {
      console.log({i, j});
      return (targets.has(JSON.stringify([i, j])));
    }

    const processingGrid = Array(nRow).fill(null)
      .map((a, x) => Array(nCol).fill(null)
        .map((a, y) => 0)
      );

    const expansionList = sources.map(({x, y}) => [x, y])
    this.states = { processingGrid, expansionList, iExpand: 1 }
  }

  next() {
    if (this.states.finished) return;
    this.states = expand(this.isBlocked, this.isConnected, this.states);
    return this.states;
  }
}

function expand(isBlocked, isConnected, states) {
  if (states.finished) return states;
  const { processingGrid, expansionList, iExpand } = states

  const nextExpansionList = new Set();
  for (const [ci, cj] of expansionList) {
    processingGrid[ci][cj] = iExpand;

    if (isConnected(ci, cj)) {
      return {
        finished: true,
        connectedCoor: [ci, cj],
        expansionList: [],
        processingGrid: processingGrid, 
        iExpand
      }
    }

    for (const [i, j] of [[ci + 1, cj], [ci - 1, cj], [ci, cj + 1], [ci, cj - 1]]) {
      // console.log({i, j, blocked: isBlocked(i, j), pg: processingGrid[i][j] === 0});
      // console.log({i, j});

      if (!isBlocked(i, j) && processingGrid[i][j] === 0) {
        // console.log({i, j, blocked: isBlocked(i, j), pg: processingGrid[i][j] === 0});
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