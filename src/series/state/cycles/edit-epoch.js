import * as R from "ramda";
import { createAction } from "redux-actions";
import { CREATE_EPOCH, setEpochDomain } from "../models/series";
import { seriesSelector } from "../models/orm";

export const INIT_EDIT_EPOCH_START = "INIT_EDIT_EPOCH_START";
export const initEditEpochStart = createAction(INIT_EDIT_EPOCH_START);

export const INIT_EDIT_EPOCH_END = "INIT_EDIT_EPOCH_END";
export const initEditEpochEnd = createAction(INIT_EDIT_EPOCH_END);

export const CONTINUE_EDIT_EPOCH = "CONTINUE_EDIT_EPOCH";
export const continueEditEpoch = createAction(CONTINUE_EDIT_EPOCH);

export const STOP_EDIT_EPOCH = "STOP_EDIT_EPOCH";
export const stopEditEpoch = createAction(STOP_EDIT_EPOCH);

const editStartAction = (current, init) => ({
  seriesId: init.payload.seriesId,
  epochIndex: init.payload.epochIndex,
  domain: R.sort(R.subtract, [
    init.payload.domain[0] + current.payload.x - init.payload.x,
    init.payload.domain[1]
  ])
});

const editEndAction = (current, init) => ({
  seriesId: init.payload.seriesId,
  epochIndex: init.payload.epochIndex,
  domain: R.sort(R.subtract, [
    init.payload.domain[0],
    init.payload.domain[1] + current.payload.x - init.payload.x
  ])
});

export const editEpochCycle = sources => {
  const initEditStart$ = sources.ACTION.filter(
    ({ type }) => type === INIT_EDIT_EPOCH_START
  );
  const initEditEnd$ = sources.ACTION.filter(
    ({ type }) => type === INIT_EDIT_EPOCH_END
  );
  const stopEdit$ = sources.ACTION.filter(
    ({ type }) => type === STOP_EDIT_EPOCH
  );
  const continueEdit$ = sources.ACTION.filter(
    ({ type }) => type === CONTINUE_EDIT_EPOCH
  );
  const editStart$ = initEditStart$.concatMap(init =>
    continueEdit$
      .map(current => editStartAction(current, init))
      .map(setEpochDomain)
      .takeUntil(stopEdit$)
  );
  const editEnd$ = initEditEnd$.concatMap(init =>
    continueEdit$
      .map(current => editEndAction(current, init))
      .map(setEpochDomain)
      .takeUntil(stopEdit$)
  );
  const action$ = editStart$.merge(editEnd$);
  return {
    ACTION: action$
  };
};
