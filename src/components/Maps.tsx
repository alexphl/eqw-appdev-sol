import DeckGL from "@deck.gl/react/typed";
import { LineLayer } from "@deck.gl/layers/typed";
import { Map } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

/**
 * Geo visualizations panel
 **/
const Maps = () => {
  // Viewport settings
  const INITIAL_VIEW_STATE = {
    longitude: -122.41669,
    latitude: 37.7853,
    zoom: 13,
    pitch: 0,
    bearing: 0,
  };

  // Set your mapbox access token here
  const MAPBOX_ACCESS_TOKEN =
    "pk.eyJ1IjoiYWxleHByb2toIiwiYSI6ImNsN3F1bGVkcDA5NXg0MHBwYjU4N2UybXoifQ.9tCQ4zaObKtYp6-lbkZWZw";

  // Data to be used by the LineLayer
  const data = [
    {
      sourcePosition: [-122.41669, 37.7853],
      targetPosition: [-122.41669, 37.781],
    },
  ];

  const layers = [new LineLayer({ id: "line-layer", data })];

  return (
    <>
      <div>Under construction.</div>
      <div className="h-screen w-screen absolute top-0">
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={layers}
        >
          <Map mapboxAccessToken={MAPBOX_ACCESS_TOKEN} />
        </DeckGL>
      </div>
    </>
  );
};

export default Maps;
