import { createContext, useReducer, useEffect, useState } from "react";
import {
  SET_EDITOR_PAGE,
  UPDATE_STYLE,
  UPDATE_MAP,
  ADD,
  REORDER,
  UPDATE,
  REMOVE,
  SET_MAP,
  SAVE_MAP,
} from "./actions";
import reducer from "./reducer";
import axios from "axios";

const EditorContext = createContext();

export const EditorProvider = ({ map, children }) => {
  const [state, dispatch] = useReducer(reducer, {
    map,
    editorPage: "info",
    updates: null,
  });

  const [savingTimeout, setSavingTimeout] = useState(null);
  const [mapFullscreen, setMapFullscreen] = useState(false);

  const { updates } = state;

  useEffect(() => {
    if (map.geojson) {
      setMap(map);
    }
  }, [map.geojson]);

  useEffect(() => {
    if (updates) {
      if (savingTimeout) {
        clearTimeout(savingTimeout);
      }
      setSavingTimeout(
        setTimeout(() => {
          axios
            .patch(`/api/maps/${_id}`, updates)
            .then(() => dispatch({ type: SAVE_MAP }));
          setSavingTimeout(null);
        }, 2000)
      );
    }
  }, [updates]);

  const {
    properties,
    styles,
    filters,
    choropleths,
    searchFields,
    tags,
    description,
    tileLayer,
    bounds,
    name,
    publish,
    geojson,
    _id,
  } = state.map || {};
  function editFunctions(listName) {
    return {
      add: (newItem) => {
        dispatch({
          type: ADD,
          payload: {
            listName,
            newItem,
          },
        });
      },

      reorder: ({ oldIndex, newIndex }) => {
        dispatch({
          type: REORDER,
          payload: {
            listName,
            oldIndex,
            newIndex,
          },
        });
      },

      update: ({ index, newValue }) => {
        dispatch({
          type: UPDATE,
          payload: {
            listName,
            index,
            newValue,
          },
        });
      },

      remove: ({ index }) => {
        dispatch({
          type: REMOVE,
          payload: {
            listName,
            index,
          },
        });
      },
    };
  }

  const updateMap = (update) =>
    dispatch({
      type: UPDATE_MAP,
      payload: update,
    });

  const setMap = (map) => dispatch({ type: SET_MAP, payload: map });

  const updateStyle = (update) =>
    dispatch({ type: UPDATE_STYLE, payload: { update } });

  const editorPage = state.editorPage;

  const setEditorPage = (page) =>
    dispatch({ type: SET_EDITOR_PAGE, payload: page });

  const [usingMapView, setUsingMapView] = useState(false);

  const useMapView = (bounds) => {
    updateMap({ bounds });
    setUsingMapView(false);
  };

  const [takingScreenshot, setTakingScreenshot] = useState(false);

  const takeScreenshot = (thumbnail) => {
    updateMap({ thumbnail });
    setTakingScreenshot(false);
  };

  const [editorChoropleth, setEditorChoropleth] = useState(
    choropleths ? choropleths[0] : null
  );

  return (
    <EditorContext.Provider
      value={{
        editorChoropleth,
        setEditorChoropleth,
        setTakingScreenshot,
        setUsingMapView,
        takeScreenshot,
        takingScreenshot,
        useMapView,
        usingMapView,
        updates,
        state,
        dispatch,
        map,
        tags,
        description,
        editFunctions,
        properties,
        geojson,
        styles,
        filters,
        setMap,
        choropleths,
        searchFields,
        updateMap,
        editorPage,
        setEditorPage,
        updateStyle,
        tileLayer,
        bounds,
        name,
        publish,
        _id,
        mapFullscreen,
        setMapFullscreen,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export default EditorContext;
