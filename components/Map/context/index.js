import { createContext, useReducer, useEffect, useContext } from "react";
import { SET_STATE } from "./actions";
import reducer from "./reducer";
import filterClosure, { getDefaultFilters } from "../../../lib/map/filter";
import onEachFeatureClosure from "../../../lib/map/onEachFeature";
import { styleClosure } from "../../../lib/map/style";
import EditorContext from "../../MapEditor/context";
//import * as topojson from "topojson";

const MapContext = createContext();

export const MapProvider = ({ map, embed, editor, children, owner }) => {
  const [state, dispatch] = useReducer(reducer, {
    activeFilters: getDefaultFilters(map.filters) || null,
    activeChoropleth: map.choropleths ? map.choropleths[0] : null,
    activeData: null,
    leafletMap: null,
    mapSize:null
  });

  const {
    properties,
    styles,
    filters,
    choropleths,
    searchFields,
    geography,
    geojson,
    bounds,
    tileLayer,
    tags,
    description,
    _id
  } = map;
  /*const geojson = map.topojson
    ? topojson.feature(map.topojson, map.topojson?.objects.featureCollection)
    : null;*/

  const { leafletMap, activeFilters, activeChoropleth, activeData } = state;

  const leafletMapLayers = Object.values(leafletMap?._layers || {}).filter(
    (layer) => layer.feature
  );

  const {
    useMapView,
    usingMapView,
    updateMap,
    editorChoropleth,
    setEditorChoropleth,
    takingScreenshot,
    setTakingScreenshot,
    mapFullscreen,
    setMapFullscreen,
  } = editor ? useContext(EditorContext) : {};

  useEffect(() => {
    if (leafletMap) {
      refreshMap({
        type: "choropleth",
        update: {
          ...choropleths.find(
            (choropleth) => choropleth.name === activeChoropleth?.name
          ),
        },
      });
      setState({
        activeChoropleth: {
          ...choropleths.find(
            (choropleth) => choropleth.name === activeChoropleth?.name
          ),
        },
      });
    }
  }, [
    styles?.fillColor,
    styles?.color,
    activeChoropleth?.name,
    activeChoropleth?.schemeName,
    editorChoropleth?.schemeName,
  ]);

  if (editor) {
    useEffect(() => {
      if (usingMapView && leafletMap) {
        const bounds = leafletMap.getBounds();
        const southWest = bounds.getSouthWest();
        const northEast = bounds.getNorthEast();
        useMapView([
          [southWest.lat, southWest.lng],
          [northEast.lat, northEast.lng],
        ]);
      }
    }, [usingMapView]);
  }

  useEffect(() => {
    dispatch({
      type: SET_STATE,
      payload: { activeChoropleth: editorChoropleth },
    });
  }, [editorChoropleth?.name]);

  useEffect(() => {
    console.log("effect");
    if (leafletMap) {
      refreshMap({
        type: "tileLayer",
      });
    }
  }, [tileLayer?.url, tileLayer?.labels, mapFullscreen]);

  useEffect(() => {
    if (leafletMap) {
      const tempLeafletMap = leafletMap;
      if (bounds) {
        tempLeafletMap.setMaxBounds(bounds);
        tempLeafletMap.setMinZoom(tempLeafletMap.getBoundsZoom(bounds));
        tempLeafletMap.fitBounds(bounds);
      } else {
        tempLeafletMap.setMaxBounds(null);
        tempLeafletMap.setMinZoom(1);
      }

      setState({ leafletMap: tempLeafletMap });
    }
  }, [!bounds || bounds[0]]);

  const setState = (update) => dispatch({ type: SET_STATE, payload: update });
  const setActiveData = (activeData) => setState({ activeData });

  const refreshMap = (action) => {
    const tempLeafletMap = leafletMap.eachLayer((layer) => {
      if (layer.feature && action.type !== "tileLayer") {
        layer.remove();
      }
      if (layer.className === "tileLayer" && action.type === "tileLayer")
        layer.remove();
    });
    let geoJsonOpts;
    switch (action.type) {
      case "filter":
        geoJsonOpts = {
          onEachFeature: onEachFeatureClosure(
            tempLeafletMap,
            activeChoropleth,
            styles,
            setActiveData
          ),
          style: styleClosure(activeChoropleth, styles),
          filter: filterClosure(filters, action.update),
        };
        break;

      case "choropleth":
        geoJsonOpts = {
          onEachFeature: onEachFeatureClosure(
            tempLeafletMap,
            action.update,
            styles,
            setActiveData
          ),
          style: styleClosure(action.update, styles),
          filter: filterClosure(filters, activeFilters),
        };
        break;

      default:
        geoJsonOpts = {
          onEachFeature: onEachFeatureClosure(
            tempLeafletMap,
            activeChoropleth,
            styles,
            setActiveData
          ),
          style: styleClosure(activeChoropleth, styles),
          filter: filterClosure(filters, activeFilters),
        };
        break;
    }
    if (action.type === "tileLayer" && map.tileLayer) {
      tempLeafletMap.invalidateSize();
      L.tileLayer(map.tileLayer?.url, {
        attribution: map.tileLayer?.attribution,
        ext: map.tileLayer?.ext,
        subdomains: "abcd",
        className: "tileLayer",
      }).addTo(tempLeafletMap);
    }
    if (action.type !== "tileLayer") {
      L.geoJson(geojson, geoJsonOpts).addTo(tempLeafletMap);
    }

    if (tileLayer?.labels) {
      L.tileLayer(
        "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}",
        {
          subdomains: "abcd",
          ext: "png",
        }
      ).addTo(tempLeafletMap);
    }
    dispatch({ type: SET_STATE, payload: { leafletMap: tempLeafletMap } });
  };

  return (
    <MapContext.Provider
      value={{
        embed,
        editor,
        owner,
        map,
        state,
        dispatch,
        activeChoropleth,
        activeFilters,
        setState,
        properties,
        geojson,
        styles,
        filters,
        choropleths,
        searchFields,
        geography,
        leafletMap,
        leafletMapLayers,
        activeData,
        refreshMap,
        setActiveData,
        updateMap,
        takingScreenshot,
        setTakingScreenshot,
        setEditorChoropleth,
        tags,
        description,
        _id,
        mapFullscreen,
        setMapFullscreen,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapContext;
