import { createAction } from "redux-actions";

export const SET_TAG = "SET_TAG";
export const setTag = createAction(SET_TAG);

export const tagsReducer = (tag = 0, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_TAG: {
      return payload;
    }
    default:
      return tag;
  }
};
