import { useState } from "react";
import { MineGame } from "./MineGame";
import { Board } from "./store/Board";

export default function MineGameWrapper() {
   const [gId, setGId] = useState(0);
   const board = new Board(5, 5, 5);
   return <MineGame key={gId} board={board} reset={() => setGId((oldId) => oldId + 1)}></MineGame>;
}
