import R from "ramda";
import { createAction } from "redux-actions";

export const ENABLE_SERIES = "ENABLE_SERIES";
export const enableSeries = createAction(ENABLE_SERIES);

export const DISABLE_SERIES = "DISABLE_SERIES";
export const disableSeries = createAction(DISABLE_SERIES);

export const toolsReducer = (enabledSeries = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ENABLE_SERIES: {
      return R.append(payload.id, enabledSeries);
    }
    case DISABLE_SERIES: {
      return R.reject(R.equals(payload.id), enabledSeries);
    }
    default:
      return enabledSeries;
  }
};
