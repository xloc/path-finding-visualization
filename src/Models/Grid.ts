export interface GridSize {
  col: number;
  row: number;
}

export class Grid<T> {
  grid: Array<Array<T>>;
  size: GridSize;

  constructor(size: GridSize, initializer: (i: number, j: number) => T) {
    this.size = size;
    this.grid = Array(size.row)
      .fill(null)
      .map((nouse, i) =>
        Array(size.col)
          .fill(null)
          .map((nouse, j) => initializer(i, j))
      );
  }
}
