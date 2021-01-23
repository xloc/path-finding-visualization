import { MapCellType } from "./GridModel";

export default class DijkstraRouting {
  constructor(gridModel, sources, targets) {
    const { nRow, nCol } = gridModel;
    this.isBlocked = (i, j) => {
      if (i < 0 || i >= nRow || j < 0 || j >= nCol) return true;
      if (gridModel.mapGrid[i][j].type === MapCellType.void) return false;
      else return true;
    }

    targets = targets.map(({x, y}) => [x, y])
    this.isConnected = (i, j) => {
      for (const [ti, tj] of targets) {
        console.log({ti, tj, i, j, res: i === ti && j === tj});
        if (i === ti && j === tj) return true;
      }
      return false;
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

    for (const [i, j] of [[ci + 1, cj], [ci - 1, cj], [ci, cj + 1], [ci, cj - 1]]) {
      // console.log({i, j, blocked: isBlocked(i, j), pg: processingGrid[i][j] === 0});
      // console.log({i, j});

      if (isConnected(i, j)) {
        return {
          finished: true,
          connectedCoor: [i, j],
          expansionList: [],
          processingGrid: processingGrid, 
          iExpand
        }
      }

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