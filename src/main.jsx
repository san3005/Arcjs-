// ArcGIS CSS MUST be imported before your own styles
import "@arcgis/core/assets/esri/themes/dark/main.css";
import "./styles/app.css";

import esriConfig from "@arcgis/core/config.js";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Tell ArcGIS SDK where its bundled assets live
esriConfig.assetsPath = import.meta.env.BASE_URL + "assets";

ReactDOM.createRoot(document.getElementById("root")).render(
  <App />
);
