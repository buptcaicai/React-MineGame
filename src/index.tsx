import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import MineGameWrapper from "./MineGameWrapper";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
   <React.StrictMode>
      <MineGameWrapper />
   </React.StrictMode>
);

reportWebVitals();
