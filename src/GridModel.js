export const CellType = Object.freeze({void:0, pin:1, wall:2})

export function parseGridString(input) {
  const lines = input.split('\n')
  const [nCol, nRow] = lines[0].split(' ').map( a => parseInt(a) )
  // console.log(n_col, n_row);
  const grid = Array(nRow).fill(null)
    .map( 
      (a, x) => Array(nCol).fill(null)
      .map( (a, y) => ({x, y, type: CellType.void}) )
    )

  let i_line = 1
  /// parse obstacles
  const n_wall = parseInt(lines[i_line++])
  lines.slice(i_line, i_line + n_wall).forEach(line => {
    const [j, i]  = line.split(' ').map( a => parseInt(a) )
    // console.log(i, j);
    grid[i][j].type = CellType.wall;
  });
  i_line += n_wall;
  
  /// parse nets
  const nets = [];
  const n_net = parseInt(lines[i_line++]);
  lines.slice(i_line, i_line + n_net).forEach((line, netID) => {
    /// parse pins
    const [, ...coors] = line.trim().split(' ').map( a => parseInt(a) )
    const net = [];
    // console.log({n_pins, len:coors.length});
    for (let idx = 0; idx < coors.length; idx += 2) {
      const j = coors[idx], i = coors[idx + 1];
      // console.log({i, j});
      grid[i][j].type = CellType.pin;
      grid[i][j].net = netID;
      net.push(grid[i][j]);
    }
    nets.push(net)
  })
  
  return {grid, nets, nCol, nRow}
}

export default class GridModel {
  constructor({nets, grid, nCol, nRow}) {
    this.nets = nets;
    this.grid = grid;
    this.nCol = nCol;
    this.nRow = nRow;
  }
}