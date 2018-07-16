import { createAction } from "redux-actions";
import * as R from "ramda";

export const SET_SUBJECT_METADATA = "SET_SUBJECT_METADATA";
export const setSubjectMetadata = createAction(SET_SUBJECT_METADATA);

export const subjectMetadataReducer = (subjectMetadata = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_SUBJECT_METADATA:
      return R.merge(subjectMetadata, payload);
    default:
      return subjectMetadata;
  }
};
