import * as R from "ramda";
import { connect } from "react-redux";
import { combineReducers } from "redux";
import { combineCycles } from "redux-cycles";
import { createReducer } from "redux-orm";

// Reducers
import { toolsReducer, setTool } from "./parameters/tools";
import { tagsReducer, setTag } from "./parameters/tags";
import { domainReducer, setDomain } from "./parameters/domain";
import {
  createSeries,
  removeSeries,
  createEpoch,
  removeEpoch,
  setEpochDomain,
  setZoom,
  setName
} from "./models/series";
import { seriesSelector } from "./models/orm";

// Cycles
import {
  initEditEpochStart,
  initEditEpochEnd,
  continueEditEpoch,
  stopEditEpoch,
  editEpochCycle
} from "./cycles/edit-epoch";

import orm from "./models/orm";

export const cycle = combineCycles(editEpochCycle);

export const reducer = combineReducers({
  domain: domainReducer,
  activeTool: toolsReducer,
  activeTag: tagsReducer,
  entities: createReducer(orm)
});

const mapStateToProps = state => ({
  domain: state.domain,
  activeTool: state.activeTool,
  activeTag: state.activeTag,
  seriesCollection: seriesSelector(state)
});

const mapDispatchToProps = dispatch => ({
  setZoom: R.compose(dispatch, setZoom),
  setName: R.compose(dispatch, setName),
  onDomainChange: R.compose(dispatch, setDomain),
  onEpochChange: R.compose(dispatch, setEpochDomain),
  initEditEpochStart: R.compose(dispatch, initEditEpochStart),
  initEditEpochEnd: R.compose(dispatch, initEditEpochEnd),
  continueEditEpoch: R.compose(dispatch, continueEditEpoch),
  stopEditEpoch: R.compose(dispatch, stopEditEpoch),
  createSeries: R.compose(dispatch, createSeries),
  removeSeries: R.compose(dispatch, removeSeries),
  createEpoch: R.compose(dispatch, createEpoch),
  removeEpoch: R.compose(dispatch, removeEpoch),
  setTool: R.compose(dispatch, setTool),
  setTag: R.compose(dispatch, setTag)
});

export const connectSeriesStore = connect(mapStateToProps, mapDispatchToProps);
