import DeckGL from "@deck.gl/react/typed";
import { MapView } from "@deck.gl/core/typed";
import StaticMap from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React from "react";

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};
const MAP_VIEW = new MapView({ repeat: true });

// Set your mapbox access token here
const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiYWxleHByb2toIiwiYSI6ImNsN3F2NWltbjA5YW4zdm52aDQ3ajV3Z2wifQ.ZTE4jSsHE9bMwu6uFWpz-w";

/**
 * Geo visualizations panel
 **/
const Maps = () => {
  return (
    <>
      <div className="h-screen w-screen absolute m-0 top-0">
        <div className="absolute text-center bottom-0 w-screen z-50 font-bold backdrop-blur-2xl p-6 saturate-200 bg-black/[0.5]">
          Work in progress
        </div>
        <DeckGL
          views={MAP_VIEW}
          initialViewState={INITIAL_VIEW_STATE}
          controller={{ dragRotate: false }}
        >
          <StaticMap
            reuseMaps
            mapStyle={MAP_STYLE}
            mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          />
        </DeckGL>
      </div>
    </>
  );
};

export default Maps;
