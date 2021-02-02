import { Grid, GridSize } from "../Models/Grid";
import { Coors } from "../Models/RouteMap";
import { dijkstraRoute } from "./Router";

test("not able to connect", () => {
  const size: GridSize = { col: 3, row: 3 };
  const obstacleGrid = {
    size,
    grid: [
      [false, false, false],
      [true, true, true],
      [false, false, false],
    ],
  } as Grid<boolean>;

  const source: Coors[] = [[0, 0]];

  const target = {
    size,
    grid: [
      [false, false, false],
      [false, false, false],
      [false, false, true],
    ],
  } as Grid<boolean>;
  const result = dijkstraRoute(obstacleGrid, source, target);

  expect(result.succeed);
});

test("connects a single target", () => {
  const size: GridSize = { col: 3, row: 3 };
  const obstacleGrid = {
    size,
    grid: [
      [false, false, false],
      [false, true, true],
      [false, false, false],
    ],
  } as Grid<boolean>;

  const source: Coors[] = [[0, 0]];

  const target = {
    size,
    grid: [
      [false, false, false],
      [false, false, false],
      [false, false, true],
    ],
  } as Grid<boolean>;
  const result = dijkstraRoute(obstacleGrid, source, target);

  expect(result.succeed);
});
