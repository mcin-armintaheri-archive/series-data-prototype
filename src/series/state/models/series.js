import R from "ramda";
import { createAction } from "redux-actions";
import { attr, Model } from "redux-orm";

export const CREATE_SERIES = "CREATE_SERIES";
export const createSeries = createAction(CREATE_SERIES);

export const SET_TRACES = "SET_TRACES";
export const setTraces = createAction(SET_TRACES);

export const SET_EPOCH_DOMAIN = "SET_EPOCH_DOMAIN";
export const setEpochDomain = createAction(SET_EPOCH_DOMAIN);

export class Series extends Model {
  static reducer(action, Series) {
    const { type, payload } = action;

    switch (type) {
      case CREATE_SERIES: {
        Series.create(
          Object.assign({ zoom: 1.0, traces: [], epochs: [] }, payload)
        );
        return;
      }
      case SET_EPOCH_DOMAIN: {
        const { seriesId, epochIndex, domain } = payload;
        if (!Series.hasId(seriesId)) {
          return;
        }
        Series.withId(seriesId).epochs[epochIndex] = domain;
        return;
      }
      case SET_TRACES: {
        const { seriesId, traces } = payload;
        if (!(traces instanceof Array)) {
          return;
        }
        Series.withId(seriesId).update({ traces });
        return;
      }
      default:
        return;
    }
  }
}

Series.modelName = "Series";

Series.fields = {
  id: attr(),
  name: attr(),
  traces: attr(),
  epochs: attr(),
  zoom: attr()
};
