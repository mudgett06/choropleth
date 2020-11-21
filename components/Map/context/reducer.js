import { SET_STATE } from "./actions";

export default function reducer(state, action) {
  switch (action.type) {
    case SET_STATE:
      return {
        ...state,
        ...action.payload,
      };
  }
}
