import React, { useEffect, useRef, useState } from "react";

import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import Basemap from "@arcgis/core/Basemap.js";
import WebTileLayer from "@arcgis/core/layers/WebTileLayer.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
import Legend from "@arcgis/core/widgets/Legend.js";
import ScaleBar from "@arcgis/core/widgets/ScaleBar.js";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer.js";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol.js";
import PopupTemplate from "@arcgis/core/PopupTemplate.js";

// Public EIA natural gas pipeline feature service (no authentication required)
const PIPELINE_FEATURE_LAYER_URL =
  "https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Natural_Gas_Interstate_and_Intrastate_Pipelines/FeatureServer/0";

const pipelineRenderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: [255, 165, 30, 0.85], // vivid orange, semi-transparent
    width: 1.5,
    style: "solid",
  }),
});

const pipelinePopupTemplate = new PopupTemplate({
  title: "{NAME}",
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "OPERATOR", label: "Operator" },
        { fieldName: "TYPE", label: "Pipeline Type" },
        { fieldName: "CAPACITY", label: "Capacity (MMCF/D)" },
        { fieldName: "DIAMETER", label: "Diameter (inches)" },
        { fieldName: "STATE", label: "State(s)" },
      ],
    },
  ],
});

export default function ArcGISMapView() {
  const mapDivRef = useRef(null);
  const viewRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mapDivRef.current || viewRef.current) return;

    const pipelineLayer = new FeatureLayer({
      url: PIPELINE_FEATURE_LAYER_URL,
      title: "Natural Gas Pipelines (EIA)",
      renderer: pipelineRenderer,
      popupTemplate: pipelinePopupTemplate,
      outFields: ["*"],
    });

    const darkBasemap = new Basemap({
      baseLayers: [
        new WebTileLayer({
          urlTemplate: "https://{subDomain}.basemaps.cartocdn.com/dark_all/{level}/{col}/{row}.png",
          subDomains: ["a", "b", "c", "d"],
          copyright: "© OpenStreetMap contributors © CARTO",
        }),
      ],
      title: "Dark",
      id: "dark",
    });

    const map = new Map({
      basemap: darkBasemap,
      layers: [pipelineLayer],
    });

    const view = new MapView({
      container: mapDivRef.current,
      map,
      center: [-96.5, 38.5], // geographic center of contiguous US
      zoom: 4,
      ui: {
        components: ["attribution"],
      },
    });

    viewRef.current = view;

    view.when(() => {
      const legend = new Legend({
        view,
        style: { type: "classic", layout: "stack" },
      });
      view.ui.add(legend, "bottom-left");

      const scaleBar = new ScaleBar({ view, unit: "dual" });
      view.ui.add(scaleBar, "bottom-right");
    });

    // Handle layer load errors — fall back to local GeoJSON sample data
    pipelineLayer.load().catch((err) => {
      console.warn("FeatureLayer failed to load, falling back to GeoJSON:", err);
      setError("Live pipeline service unavailable — showing sample data.");
      map.remove(pipelineLayer);

      const fallbackLayer = new GeoJSONLayer({
        url: "/Arcjs-/pipelines.geojson",
        title: "Natural Gas Pipelines (Sample)",
        renderer: pipelineRenderer,
        popupTemplate: new PopupTemplate({
          title: "{name}",
          content: "{description}",
        }),
      });
      map.add(fallbackLayer);
    });

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, []);

  return (
    <>
      {error && (
        <div
          style={{
            position: "absolute",
            top: 8,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#5c3317",
            color: "#ffd580",
            padding: "6px 14px",
            borderRadius: 6,
            fontSize: 13,
            zIndex: 10,
            border: "1px solid #a0622a",
          }}
        >
          {error}
        </div>
      )}
      <div id="arcgis-map-container" ref={mapDivRef} />
    </>
  );
}
