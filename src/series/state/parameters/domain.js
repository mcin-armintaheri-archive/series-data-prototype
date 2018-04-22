import { createAction } from "redux-actions";

export const SET_DOMAIN = "SET_RANGE";
export const setDomain = createAction(SET_DOMAIN);

export const domainReducer = (range = [0, 1], action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_DOMAIN:
      return payload;
    default:
      return range;
  }
};
