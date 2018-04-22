import * as R from "ramda";
import { connect } from "react-redux";
import { combineReducers } from "redux";
import { combineCycles } from "redux-cycles";
import { createReducer, createSelector } from "redux-orm";

// Reducers
import { toolsReducer, setTool } from "./parameters/tools";
import { domainReducer, setDomain } from "./parameters/domain";
import { setEpochDomain } from "./models/series";

// Cycles
import {
  initEditEpochStart,
  initEditEpochEnd,
  continueEditEpoch,
  stopEditEpochStart,
  stopEditEpochEnd,
  editEpochCycle
} from "./cycles/edit-epoch";

import orm from "./models/orm";

export const cycle = combineCycles(editEpochCycle);

export const reducer = combineReducers({
  domain: domainReducer,
  activeTool: toolsReducer,
  entities: createReducer(orm)
});

const entitiesSelector = state => state.entities;

export const seriesSelector = createSelector(orm, entitiesSelector, session =>
  session.Series.all()
    .toModelArray()
    .map(series => R.merge({ epochs: series.epochs.toRefArray }, series.ref))
);

const mapStateToProps = state => ({
  domain: state.domain,
  seriesCollection: seriesSelector(state)
});

const mapDispatchToProps = dispatch => ({
  onDomainChange: R.compose(dispatch, setDomain),
  onEpochChange: R.compose(dispatch, setEpochDomain),
  initEditEpochStart: R.compose(dispatch, initEditEpochStart),
  initEditEpochEnd: R.compose(dispatch, initEditEpochEnd),
  continueEpoch: R.compose(dispatch, continueEditEpoch),
  stopEditEpochStart: R.compose(dispatch, stopEditEpochStart),
  stopEditEpochEnd: R.compose(dispatch, stopEditEpochEnd)
});

export const connectSeriesStore = connect(mapStateToProps, mapDispatchToProps);
