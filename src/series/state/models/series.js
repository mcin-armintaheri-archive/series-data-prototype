import * as R from "ramda";
import { createAction } from "redux-actions";
import { attr, Model } from "redux-orm";

export const CREATE_SERIES = "CREATE_SERIES";
export const createSeries = createAction(CREATE_SERIES);

export const SET_EPOCH_DOMAIN = "SET_EPOCH_DOMAIN";
export const setEpochDomain = createAction(SET_EPOCH_DOMAIN);

export const CREATE_EPOCH = "CREATE_EPOCH";
export const createEpoch = createAction(CREATE_EPOCH);

export const REMOVE_EPOCH = "REMOVE_EPOCH";
export const removeEpoch = createAction(REMOVE_EPOCH);

export const SET_TRACES = "SET_TRACES";
export const setTraces = createAction(SET_TRACES);

export const SET_ZOOM = "SET_ZOOM";
export const setZoom = createAction(SET_ZOOM);

export const SET_NAME = "SET_NAME";
export const setName = createAction(SET_NAME);

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
      case CREATE_EPOCH: {
        const { seriesId, domain, tag } = payload;
        if (!Series.hasId(seriesId)) {
          return;
        }
        const { epochs } = Series.withId(seriesId);
        Series.withId(seriesId).update({
          epochs: epochs.concat({ domain, tag })
        });
        return;
      }
      case REMOVE_EPOCH: {
        const { seriesId, epochIndex } = payload;
        if (!Series.hasId(seriesId)) {
          return;
        }
        const { epochs } = Series.withId(seriesId);
        Series.withId(seriesId).update({
          epochs: R.remove(epochIndex, 1, epochs)
        });
        return;
      }
      case SET_EPOCH_DOMAIN: {
        const { seriesId, epochIndex, domain } = payload;
        if (!Series.hasId(seriesId)) {
          return;
        }
        const { epochs } = Series.withId(seriesId);
        if (!epochs[epochIndex]) {
          return;
        }
        epochs[epochIndex].domain = domain;
        Series.withId(seriesId).update({ epochs });
        return;
      }
      case SET_NAME: {
        const { seriesId, name } = payload;
        Series.withId(seriesId).update({ name });
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
      case SET_ZOOM: {
        const { seriesId, zoom } = payload;
        Series.withId(seriesId).update({ zoom });
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
