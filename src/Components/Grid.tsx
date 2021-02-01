import { useState, useEffect } from "react";
import { RouteResult, RouteResultCell } from "../Models/RouteResult";
import { RouteMap } from "../Models/RouteMap";
import { Grid as GridModel } from "../Models/Grid";
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

export interface ProgressCell {
  visited: number;
  active: boolean;
}

type GridProps = {
  circuit: RouteMap;
  segments: RouteResult | undefined;
  progress: GridModel<ProgressCell> | undefined;
};
export default function Grid({ circuit, segments, progress }: GridProps) {
  const [routeMapGrid, setRouteMapGrid] = useState(() =>
    makeRouteMapGrid(circuit)
  );
  useEffect(() => {
    setRouteMapGrid(makeRouteMapGrid(circuit));
  }, [circuit]);

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
                  segment={segments?.grid[i][j]}
                  progress={progress?.grid[i][j]}
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
  segment: RouteResultCell | undefined;
  progress: ProgressCell | undefined;
};
export function GridCell({ mapCell, segment, progress }: GridCellProps) {
  let color = "#ccc";
  if (mapCell.isWall) {
    color = "black";
  } else if (mapCell.isPin) {
    color = NetColors[mapCell.netID];
  }

  if (segment) {
    if (segment.netId !== -1) {
      color = NetColors[segment.netId];
    }
  }

  const shadow =
    segment?.netId === -1 &&
    !mapCell.isPin &&
    progress &&
    progress.visited >= 0;
  return (
    <div className="grid-cell" style={{ backgroundColor: color }}>
      <div className={mapCell.isPin ? "pin cell-overlap" : ""} />
      {/* <div className="cell-overlap mark">
        {progress && (progress.visited >= 0 ? "x" : "")}
      </div> */}
      <div className={shadow ? "visited cell-overlap" : ""}></div>
    </div>
  );
}
