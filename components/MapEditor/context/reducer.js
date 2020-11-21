import {
  UPDATE_STYLE,
  SET_EDITOR_PAGE,
  UPDATE_MAP,
  ADD,
  REORDER,
  UPDATE,
  REMOVE,
  SAVE_MAP,
  SET_SCREENSHOTTING,
  SET_MAP,
} from "./actions";

import {
  reorderArray,
  spliceOutCopy,
  spliceUpdateCopy,
} from "../../../lib/utility";

export default function reducer(state, action) {
  let updatedArray;
  switch (action.type) {
    case SET_MAP:
      return {
        ...state,
        map: action.payload,
      };
    case SET_SCREENSHOTTING:
      return {
        ...state,
        gettingScreenshot: !state.gettingScreenshot,
      };
    case UPDATE_MAP:
      return {
        ...state,
        map: {
          ...state.map,
          ...action.payload,
        },
        updates: { ...state.updates, ...action.payload },
      };
    case UPDATE_STYLE:
      return {
        ...state,
        map: {
          ...state.map,
          styles: {
            ...state.map.styles,
            ...action.payload.update,
          },
        },
        updates: {
          ...state.updates,
          styles: { ...state.map.styles, ...action.payload.update },
        },
      };
    case SET_EDITOR_PAGE:
      return {
        ...state,
        editorPage: action.payload,
      };
    case REORDER:
      updatedArray = reorderArray(
        state.map[action.payload.listName],
        action.payload.oldIndex,
        action.payload.newIndex
      );
      return {
        ...state,
        map: {
          ...state.map,
          [action.payload.listName]: updatedArray,
        },
        updates: {
          ...state.updates,
          [action.payload.listName]: updatedArray,
        },
      };
    case UPDATE:
      updatedArray = spliceUpdateCopy(
        state.map[action.payload.listName],
        action.payload.index,
        {
          ...state.map[action.payload.listName][action.payload.index],
          ...action.payload.newValue,
        }
      );
      return {
        ...state,
        map: {
          ...state.map,
          [action.payload.listName]: updatedArray,
        },
        updates: {
          ...state.updates,
          [action.payload.listName]: updatedArray,
        },
      };
    case REMOVE:
      updatedArray = spliceOutCopy(
        state.map[action.payload.listName],
        action.payload.index
      );
      return {
        ...state,
        map: {
          ...state.map,
          [action.payload.listName]: updatedArray,
        },
        updates: {
          ...state.updates,
          [action.payload.listName]: updatedArray,
        },
      };
    case ADD:
      updatedArray = [
        ...(state.map[action.payload.listName] || []),
        action.payload.newItem,
      ];
      return {
        ...state,
        map: {
          ...state.map,
          [action.payload.listName]: updatedArray,
        },
        updates: {
          ...state.updates,
          [action.payload.listName]: updatedArray,
        },
      };
    case SAVE_MAP:
      return {
        ...state,
        updates: null,
      };
  }
}
