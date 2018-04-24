import * as R from "ramda";
import { createAction } from "redux-actions";
import { setEpochDomain } from "../models/series";

export const INIT_EDIT_EPOCH_START = "INIT_EDIT_EPOCH_START";
export const initEditEpochStart = createAction(INIT_EDIT_EPOCH_START);

export const INIT_EDIT_EPOCH_END = "INIT_EDIT_EPOCH_END";
export const initEditEpochEnd = createAction(INIT_EDIT_EPOCH_END);

export const CONTINUE_EDIT_EPOCH = "CONTINUE_EDIT_EPOCH";
export const continueEditEpoch = createAction(CONTINUE_EDIT_EPOCH);

export const STOP_EDIT_EPOCH_START = "STOP_EDIT_EPOCH_START";
export const stopEditEpochStart = createAction(STOP_EDIT_EPOCH_START);

export const STOP_EDIT_EPOCH_END = "STOP_EDIT_EPOCH_END";
export const stopEditEpochEnd = createAction(STOP_EDIT_EPOCH_END);

export const editEpochCycle = sources => {
  const initEditStart$ = sources.ACTION.filter(
    ({ type }) => type === INIT_EDIT_EPOCH_START
  );
  const initEditEnd$ = sources.ACTION.filter(
    ({ type }) => type === INIT_EDIT_EPOCH_END
  );
  const stopEditStart$ = sources.ACTION.filter(
    ({ type }) => type === STOP_EDIT_EPOCH_END
  );
  const stopEditEnd$ = sources.ACTION.filter(
    ({ type }) => type === STOP_EDIT_EPOCH_END
  );
  const editStart = (current, init) => ({
    seriesId: init.payload.seriesId,
    epochIndex: init.payload.epochIndex,
    domain: R.sort([
      init.payload.domain[0] + current.payload.x - init.payload.x,
      init.payload.domain[1]
    ])
  });
  const editEnd = (current, init) => ({
    seriesId: init.payload.seriesId,
    epochIndex: init.payload.epochIndex,
    domain: R.sort([
      init.payload.domain[0],
      init.payload.domain[1] + current.payload.x - init.payload.x
    ])
  });
  const updateEditStart$ = sources.ACTION.filter(
    ({ type }) => type === CONTINUE_EDIT_EPOCH
  )
    .combine(editStart, initEditStart$)
    .skipUntil(initEditStart$)
    .takeUntil(stopEditStart$)
    .map(setEpochDomain);
  const updateEditEnd$ = sources.ACTION.filter(
    ({ type }) => type === CONTINUE_EDIT_EPOCH
  )
    .combine(editEnd, initEditStart$)
    .skipUntil(initEditEnd$)
    .takeUntil(stopEditEnd$)
    .map(setEpochDomain);
  return {
    ACTION: updateEditStart$.join(updateEditEnd$)
  };
};

export const addRemoveEpochCycle = sources => {
  return {};
};
