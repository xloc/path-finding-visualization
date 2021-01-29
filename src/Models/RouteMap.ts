
export enum MapCellType {
  void = 0,
  wall,
  pin,
}

export type Coors = [number, number];
export interface Net {
  netID: number;
  pins: Array<Coors>;
}

export interface RouteMapSize {
  col: number;
  row: number;
}
export interface RouteMap {
  size: RouteMapSize;
  walls: Array<Coors>;
  nets: Array<Net>;
}

export function parseRoutingMapString(input:string) : RouteMap {
  const lines = input.split('\n');
  const [nCol, nRow] = lines[0].split(' ').map( a => parseInt(a) );
  let i_line = 1;

  /// parse obstacles
  const n_wall = parseInt(lines[i_line++]);
  const walls = lines.slice(i_line, i_line + n_wall).map(line => {
    const [j, i]  = line.split(' ').map( a => parseInt(a) );
    return [i, j] as Coors;
  });
  i_line += n_wall;
  
  /// parse nets
  const nets: Array<Net> = [];
  const n_net = parseInt(lines[i_line++]);
  lines.slice(i_line, i_line + n_net).forEach((line, netID) => {
    /// parse pins
    const [, ...coors] = line.trim().split(' ').map( a => parseInt(a) )
    const net: Net = {netID: netID, pins:[]};
    for (let idx = 0; idx < coors.length; idx += 2) {
      const j = coors[idx], i = coors[idx + 1];
      net.pins.push([i, j]);
    }
    nets.push(net);
  })
  
  return {
    size: {col:nCol, row:nRow},
    walls: walls,
    nets: nets,
  }
}
