import { useEffect, useContext, useState, useRef } from "react";
import filterClosure from "../../lib/map/filter";
import onEachFeatureClosure from "../../lib/map/onEachFeature";
import styles from "./map.module.css";
import ChoroplethBar from "./ChoroplethBar";
import DataDisplayBox from "./DataDisplayBox";
import Sidebar from "./Sidebar";
import SidebarIcons from "./SidebarIcons";
import { styleClosure } from "../../lib/map/style";
import MapContext, { MapProvider } from "./context";
import SideButtons from "./SideButtons";
import domtoimage from "dom-to-image";
import { useUser } from "../../lib/hooks";
if (process.browser) {
  process.env.L = require("leaflet");
  require("leaflet-polygon-gradient");
}
import toBBox from "geojson-bounding-box";
import { DotLoader } from "react-spinners";
import { css } from "@emotion/core";

export default function Map({ map, embed, editor }) {
  const [user, { mutate }] = useUser();
  const owner = user?.username === map.owner;
  return (
    <MapProvider map={map} embed={embed} editor={editor} owner={owner}>
      <MapConsumer editor={editor} embed={embed} />
    </MapProvider>
  );
}

function MapConsumer({ editor, embed }) {
  const mapRef = useRef();
  const {
    setActiveData,
    activeChoropleth,
    activeFilters,
    map,
    setState,
    leafletMap,
    geojson,
    updateMap,
    takingScreenshot,
    setTakingScreenshot,
    mapFullscreen,
    setMapFullscreen,
  } = useContext(MapContext);

  const [tilesLoaded, setTilesLoaded] = useState(false);
  const [featuresLoading, setFeaturesLoading] = useState(true);
  useEffect(() => {
    if (geojson) {
      setFeaturesLoading(false);
    }
  }, [geojson]);
  useEffect(() => {
    if ((editor && !map.thumbnail && tilesLoaded) || takingScreenshot) {
      domtoimage.toPng(mapRef.current).then((thumbnail) => {
        updateMap({ thumbnail });
        setTakingScreenshot(false);
      });
    }
  }, [tilesLoaded, takingScreenshot]);

  //initialize map after DOM loads
  useEffect(() => {
    if (!leafletMap && geojson) {
      const tempLeafletMap = L.map("map", { zoomDelta: 0.1, zoomSnap: 0.1 });
      tempLeafletMap.zoomControl.setPosition("topright");
      let maxBounds;
      if (map.bounds) {
        maxBounds = L.latLngBounds(map.bounds).pad(0.25);
        tempLeafletMap.setMaxBounds(maxBounds);
        tempLeafletMap.fitBounds(maxBounds);
        tempLeafletMap.setMinZoom(tempLeafletMap.getBoundsZoom(maxBounds));
      } else if (editor) {
        const bbox = toBBox(geojson);
        const bounds = [
          [bbox[1], bbox[0]],
          [bbox[3], bbox[2]],
        ];
        maxBounds = L.latLngBounds(bounds).pad(0.5);
        tempLeafletMap.setMaxBounds(maxBounds);
        tempLeafletMap.fitBounds(maxBounds);
        tempLeafletMap.setMinZoom(tempLeafletMap.getBoundsZoom(maxBounds));
        updateMap({
          bounds,
        });
      }
      if (map.tileLayer) {
        L.tileLayer(map.tileLayer.url, {
          subdomains: "abcd",
          ext: "png",
        })
          .on({ load: () => setTimeout(() => setTilesLoaded(true), 500) })
          .addTo(tempLeafletMap);
      } else {
        setTilesLoaded(true);
      }

      const geojsonLayer = L.geoJson(geojson, {
        onEachFeature: onEachFeatureClosure(
          tempLeafletMap,
          activeChoropleth,
          map.styles,
          setActiveData
        ),
        style: styleClosure(activeChoropleth, map.styles),
        filter: filterClosure(map.filters, activeFilters),
      }).addTo(tempLeafletMap);
      if (map.tileLayer?.labels) {
        L.tileLayer(
          "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}",
          {
            subdomains: "abcd",
            ext: "png",
          }
        ).addTo(tempLeafletMap);
      }
      /*
      Remove outlines when zoomed out sufficiently far
      tempLeafletMap.on("zoomend", () => {
        if (tempLeafletMap.getZoom() < 6) {
          geojsonLayer.eachLayer((layer) => layer.setStyle({ opacity: 0 }));
        } else {
          geojsonLayer.eachLayer((layer) => layer.setStyle({ opacity: 1 }));
        }
      });*/
      setState({
        leafletMap: tempLeafletMap,
        mapSize: {
          height: mapRef.current.offsetHeight,
          width: mapRef.current.offsetWidth,
        },
      });
    }
  }, [geojson]);

  const override = css`
    display: block;
    margin: 1rem auto;
    border-color: red;
  `;

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.0.1/dist/leaflet.css"
      />
      <SidebarIcons />
      <div
        className={styles.mapContainer}
        ref={mapRef}
        style={
          embed
            ? {
                width: "100vw",
                height: "100vh",
                margin: 0,
                padding: 0,
                overflow: "hidden",
              }
            : {}
        }
      >
        <Sidebar />
        {featuresLoading ? (
          <div className={styles.loadingOverlay}>
            <DotLoader css={override} size={60} color={"#5A5A5A"} />
            Loading Map Data...
          </div>
        ) : (
          <></>
        )}
        {editor || map.tags || map.description ? (
          <SideButtons
            mapFullscreen={mapFullscreen}
            setMapFullscreen={setMapFullscreen}
          />
        ) : (
          <></>
        )}
        {activeChoropleth ? <ChoroplethBar /> : <></>}
        <div id="map" className={styles.map} />
      </div>
    </>
  );
}
