// main.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import ReactDOM from "react-dom/client";


import App from "./App";
import "./index.css";
import "./darkmode.css"; 
import { DataProvider } from "./context/DataContext";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <DataProvider>
      <App />
    </DataProvider>
  </React.StrictMode>
);
