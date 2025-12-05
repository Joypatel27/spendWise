
// src/main.jsx
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";         // your app global css
import "./darkmode.css";     // global dark-mode rules
import { DataProvider } from "./context/DataContext";

/**
 * Apply theme stored in localStorage to document.body
 */
function applyThemeFromStorage() {
  try {
    const theme = localStorage.getItem("theme") || "light";
    if (theme === "dark") document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  } catch (err) {
    // ignore if localStorage blocked
    console.warn("applyThemeFromStorage error:", err);
  }
}

// Run once at startup so reloads show correct theme
applyThemeFromStorage();

// Listen for cross-tab changes (storage event fires in other tabs)
window.addEventListener("storage", (e) => {
  if (e.key === "theme") applyThemeFromStorage();
});

// Listen for same-tab programmatic change
window.addEventListener("themeChanged", applyThemeFromStorage);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </React.StrictMode>
);
