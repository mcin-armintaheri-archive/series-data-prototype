import { createSelector } from "redux-orm";
import * as R from "ramda";
import { ORM } from "redux-orm";
import { Series } from "./series";

const orm = new ORM();
orm.register(Series);

const entitiesSelector = state => state.entities;

export const seriesSelector = createSelector(orm, entitiesSelector, session =>
  session.Series.all()
    .toModelArray()
    .map(series => R.merge({ epochs: series.epochs.toRefArray }, series.ref))
);

export default orm;
