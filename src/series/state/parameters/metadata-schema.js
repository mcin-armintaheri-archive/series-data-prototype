import { createAction } from "redux-actions";
import * as R from "ramda";

export const SET_METADATA_SCHEMA = "SET_METADATA_SCHEMA";
export const setMetadataSchema = createAction(SET_METADATA_SCHEMA);

export const metadataSchemaReducer = (metadataSchema = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_METADATA_SCHEMA:
      return R.merge(metadataSchema, payload);
    default:
      return metadataSchema;
  }
};
