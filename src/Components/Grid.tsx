import { useState, useEffect } from "react";
import { RouteResult, RouteResultCell } from "../Models/RouteResult";
import { RouteMap } from "../Models/RouteMap";
import "./Grid.css";
import NetColors from "./NetColorTheme";

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

type GridProps = {
  routeMap: RouteMap;
  routeResult: RouteResult | undefined;
};
export default function Grid({ routeMap, routeResult }: GridProps) {
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
              return (
                <GridCell
                  key={`grid-cell ${i} ${j}`}
                  mapCell={cell}
                  routeResultCell={routeResult?.grid[i][j]}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

type GridCellProps = {
  mapCell: RouteMapCellAttr;
  routeResultCell: RouteResultCell | undefined;
};
export function GridCell({ mapCell, routeResultCell }: GridCellProps) {
  let color = "#ccc";
  if (mapCell.isWall) {
    color = "black";
  } else if (mapCell.isPin) {
    color = NetColors[mapCell.netID];
  }

  if (routeResultCell) {
    if (routeResultCell.netId !== -1) {
      color = NetColors[routeResultCell.netId];
    }
  }
  return (
    <div className="grid-cell" style={{ backgroundColor: color }}>
      <div className={mapCell.isPin ? "pin" : ""} />
    </div>
  );
}
