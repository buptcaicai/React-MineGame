import { useEffect, useState } from "react";
import styles from "./MineGame.module.css";
import { Board, TileFill } from "./store/Board";
import { observer } from "mobx-react";

type TileContent = number | "" | "M" | "F";

const Tile = observer(({ fill, stepOn, putFlag }: { fill: TileFill, stepOn: () => void, putFlag: () => void }) => {
   console.log('Tile render');
   let className = "";
   let content: TileContent | null = null;

   if (fill.status === "flagged") {
      className = "is-flagged";
      content = "F";
   } else if (fill.status === "uncovered") {
      content = fill.v;
      if (fill.v === "") className = "blank";
      else if (fill.v === "M") className = "has-mine";
      else if (typeof fill.v === "number") className = "has-number";
   }

   return (
      <div
         className={`${styles[className]} ${styles.tile}`}
         onClick={(e) => {
            e.stopPropagation();
            stepOn();
         }}
         onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            putFlag();
         }}
      >
         {content}
      </div>
   );
});

const inBoard = (x: number, y: number, boardX: number, boardY: number) =>
   x >= 0 && x <= boardX - 1 && y >= 0 && y <= boardY - 1;

export const getNeighbor = (x: number, y: number, boardX: number, boardY: number) => {
   return [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x + 1, y + 1],
      [x - 1, y + 1],
      [x, y - 1],
      [x + 1, y - 1],
      [x - 1, y - 1],
   ].filter(([nX, nY]) => inBoard(nX, nY, boardX, boardY));
};

export const MineGame = observer(({ board, reset }: { board: Board; reset: () => void }) => {
   console.log("MineGame render");
   const [result, setResult] = useState<"Finished" | "Dead" | null>(null);

   useEffect(() => {
      let allResolved = true;
      OUTER: for (let row of board.tiles) {
         for (let fill of row) {
            if (fill.status === "covered" || (fill.status === "flagged" && fill.v != "M")) {
               allResolved = false;
               break OUTER;
            }
         }
      }
      if (allResolved) {
         setResult("Finished");
      }
   });

   const stepOn = (x: number, y: number) => {
      console.log("result", result);
      if (result) return;
      console.log("stepOn", x, y);
      console.log("board[y][x]", board.tiles[y][x]);

      if (board.tiles[y][x].status === "uncovered" || board.tiles[y][x]!.status === "flagged") return;
      if (board.tiles[y][x].v === "M") {
         board.tiles[y][x].status = "uncovered";
         setResult("Dead");
         return;
      }

      if (board.tiles[y][x].v === "") {
         const innerStepOn = (ax: number, ay: number) => {
            console.log("innerStepOn");
            if (
               board.tiles[ay][ax].status === "uncovered" ||
               (board.tiles[ay][ax].status === "flagged" && board.tiles[ay][ax].v === "M")
            )
               return;
            board.tiles[ay][ax].status = "uncovered";
            if (board.tiles[ay][ax].v === "") {
               const neighbors = getNeighbor(ax, ay, board.x, board.y);
               neighbors.forEach(([nx, ny]) => innerStepOn(nx, ny));
            }
         };
         innerStepOn(x, y);
      }
      board.tiles[y][x]!.status = "uncovered";
   };

   const putFlag = (x: number, y: number) => {
      if (result) return;
      if (board.tiles[y][x].status === "uncovered") return;

      if (board.tiles[y][x].status === "flagged") {
         board.tiles[y][x].status = "covered";
      } else if (board.tiles[y][x].status === "covered") {
         board.tiles[y][x].status = "flagged";
      }
   };

   return (
      <main>
         <div className={styles.heaer}>
            <span>{result ?? "Mine Game"}</span>
         </div>
         <div className={styles.board} style={{ gridTemplateColumns: `repeat(${board.x}, 1fr)` }}>
            {board.tiles.map((row, y) =>
               row.map((fill, x) => (
                  <Tile
                     key={x + "-" + y}
                     fill={fill}
                     stepOn={stepOn.bind(null, x, y)}
                     putFlag={putFlag.bind(null, x, y)}
                  ></Tile>
               ))
            )}
         </div>
         <div>
            <button onClick={reset}>reset game</button>
         </div>
      </main>
   );
});
