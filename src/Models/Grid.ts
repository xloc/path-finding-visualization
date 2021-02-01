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

  map<U>(fn: (val: T, i: number, j: number) => U) {
    return {
      size: { ...this.size },
      grid: this.grid.map((row: Array<T>, i) => {
        return row.map((val: T, j) => {
          return fn(val, i, j);
        });
      }),
    } as Grid<U>;
  }

  copyNumber() {
    return {
      size: { ...this.size },
      grid: this.grid.map((row) => {
        return [...row];
      }),
    } as Grid<T>;
  }
}
