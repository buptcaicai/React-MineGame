import { makeAutoObservable, observable } from "mobx";
import { getNeighbor } from "../MineGame";

export type TileStatus = "covered" | "uncovered" | "flagged";
export type TileContent = number | "" | "M" | "F";    // M for mine, F for flag

function randInt(min: number, max: number) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMineXY(maxX: number, maxY: number) {
   return [randInt(0, maxX), randInt(0, maxY)];
}

export class TileFill {
   v: TileContent;
   status: TileStatus;

   constructor(v: TileContent, status: TileStatus) {
      this.v = v;
      this.status = status;
      makeAutoObservable(this);
   }
}

export class Board {
   tiles: TileFill[][];
   x: number;
   y: number;

   constructor(boardX: number, boardY: number, mineCount: number) {
      this.x = boardX;
      this.y = boardY;

      const initBoard: (TileFill | null)[][] = Array.from({ length: boardY }, () =>
         Array.from({ length: boardX }, () => null)
      );

      const mines: number[][] = [];
      for (let i = 0; i < mineCount; i++) {
         let mineX: number, mineY: number;
         while (true) {
            [mineX, mineY] = generateMineXY(boardX - 1, boardY - 1); // TODO: deal with same output here
            if (!mines.some(([x, y]) => mineX === x && mineY === y)) break;
         }
         console.log("mineX, mineY", mineX, mineY);
         initBoard[mineY][mineX] = { v: "M", status: "covered" };
         mines.push([mineX, mineY]);
      }

      mines.forEach(([mineX, mineY]) => {
         const neighbors = getNeighbor(mineX, mineY, boardX, boardY);
         neighbors.forEach(([x, y]) => {
            if (initBoard[y][x] === null) initBoard[y][x] = { v: 1, status: "covered" };
            else if (typeof initBoard[y][x]!.v === "number") (initBoard[y][x]!.v as number)++;
         });
      });

      initBoard.forEach((row, y) => {
         row.forEach((v, x) => {
            if (v == null) initBoard[y][x] = { v: "", status: "covered" };
         });
      });

      this.tiles = initBoard.map(row =>
         observable.array(row.map(tile => new TileFill(tile!.v, tile!.status)))
      );

      makeAutoObservable(this, {}, { deep: true }); 
   }

   getTile(x: number, y: number): TileFill | null {
      if (x < 0 || x >= this.x || y < 0 || y >= this.y) return null;
      return this.tiles[y][x];
   }
}
