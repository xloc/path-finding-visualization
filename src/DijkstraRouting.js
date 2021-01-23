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
        console.log({ti, tj, i, j});
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
  expansionList.forEach(([i, j]) => {
    processingGrid[i][j] = iExpand;
    const connected = isConnected(i, j);
    if (connected) {
      return {
        finished: true,
        connectedCoor: connected,
        expansionList: [],
        searchHistory: processingGrid, iExpand
      }
    }

    [[i + 1, j], [i - 1, j], [i, j + 1], [i, j - 1]].forEach(([i, j]) => {
      // console.log({i, j, blocked: isBlocked(i, j), pg: processingGrid[i][j] === 0});
      // console.log({i, j});
      if (!isBlocked(i, j) && processingGrid[i][j] === 0) {
        // console.log({i, j, blocked: isBlocked(i, j), pg: processingGrid[i][j] === 0});

        nextExpansionList.add(JSON.stringify([i, j]));
      }
    })
  });

  return {
    processingGrid,
    expansionList: [...nextExpansionList].map(JSON.parse),
    iExpand: iExpand + 1
  }
}