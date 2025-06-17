import { useState } from "react";
import styles from "./App.module.css";

const winningPattern = [
   [0, 1, 2],
   [3, 4, 5],
   [6, 7, 8], // row
   [0, 3, 6],
   [1, 4, 7],
   [2, 5, 8], // col
   [0, 4, 8],
   [2, 4, 6], // diagnal
];

type Player = "X" | "O";
type BoardFill = Player | null;

const emptyBoard = new Array(9).fill(null);
const firstPlayer: Player = "O";

function nextPlayer(player: Player): Player {
   return player === "X" ? "O" : "X";
}

export default function App() {
   const [board, setBoard] = useState<BoardFill[]>(emptyBoard);
   const [curPlayer, setPlayer] = useState<Player>("O");
   const [winner, setWinner] = useState<Player | null>(null);

   function handleClick(fill: BoardFill, idx: number) {
      const newBoard = [...board];
      if (newBoard[idx] == null) {
         newBoard[idx] = fill;
         setBoard(newBoard);
         const winner = checkWinner(newBoard);
         console.log("winner:", winner);
         if (winner) setWinner(winner);
         setPlayer(nextPlayer(curPlayer));
      }
   }

   function checkWinner(newBoard: BoardFill[]) {
      for (const [a, b, c] of winningPattern) {
         if (newBoard[a] != null && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c])
            return newBoard[a];
      }
      return null;
   }

   function reset() {
      setBoard(emptyBoard);
      setPlayer(firstPlayer);
      setWinner(null);
   }

   return (
      <main className={styles.main}>
         <div className={styles.board}>
            {board.map((fill, idx) => (
               <button
                  key={idx}
                  onClick={(e) => {
                     e.stopPropagation();
                     if (fill != null || winner != null) return;
                     handleClick(curPlayer, idx);
                  }}
                  className={`${styles.button} ${fill != null || winner != null ? styles.filled : ""}`}
               >
                  {fill}
               </button>
            ))}
         </div>
         <div style={{ marginTop: "2rem" }}>
            <button onClick={reset} className={styles.resetButton}>
               reset
            </button>
         </div>
         <div>
            <span className={styles.winnerSpan}>{winner && `Winner ${winner}`}</span>
         </div>
      </main>
   );
}
