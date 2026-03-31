import React from "react";
import MapHeader from "./components/MapHeader.jsx";
import ArcGISMapView from "./components/MapView.jsx";

export default function App() {
  return (
    <div className="app-container">
      <MapHeader />
      <div className="map-wrapper">
        <ArcGISMapView />
      </div>
    </div>
  );
}
