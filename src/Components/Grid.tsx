import { useState, useEffect } from "react";
import { RouteMap } from "../Models/RouteMap";
import "./Grid.css";

export class RouteMapCellAttr {
  isWall = false;
  isPin = false;
  netID = -1;
}

function makeRouteMapGrid(routeMap: RouteMap): Array<Array<RouteMapCellAttr>> {
  const grid = Array(routeMap.size.row)
    .fill(null)
    .map((nouse, i) => {
      return Array(routeMap.size.col)
        .fill(null)
        .map((nouse, j) => {
          return { isWall: false, isPin: false, netID: -1 };
        });
    });

  routeMap.walls.forEach(([i, j]) => {
    grid[i][j].isWall = true;
  });

  routeMap.nets.forEach((net) => {
    net.pins.forEach(([i, j]) => {
      grid[i][j].isPin = true;
      grid[i][j].netID = net.netID;
    });
  });

  return grid;
}

type GridProps = { routeMap: RouteMap };
export default function Grid({ routeMap }: GridProps) {
  const [routeMapGrid, setRouteMapGrid] = useState(() =>
    makeRouteMapGrid(routeMap)
  );
  useEffect(() => {
    setRouteMapGrid(makeRouteMapGrid(routeMap));
  }, [routeMap]);

  return (
    <div>
      {routeMapGrid.map((row, i) => {
        return (
          <div key={`grid-row ${i}`} className="grid-row">
            {row.map((cell, j) => {
              return <GridCell key={`grid-cell ${i} ${j}`} mapCell={cell} />;
            })}
          </div>
        );
      })}
    </div>
  );
}

const netColors = [
  "#ff6347",
  "#adff2f",
  "#4682b4",
  "#F4A460",
  "#dda0dd",

  "#6a5acd",
  "#00ff7f",
];

type GridCellProps = { mapCell: RouteMapCellAttr };
export function GridCell({ mapCell }: GridCellProps) {
  let color = "#ccc";
  if (mapCell.isWall) {
    color = "black";
  } else if (mapCell.isPin) {
    color = netColors[mapCell.netID];
  }
  return <div className="grid-cell" style={{ backgroundColor: color }}></div>;
}
