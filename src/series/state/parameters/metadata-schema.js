import { createAction } from "redux-actions";
import * as R from "ramda";

export const SET_METADATA_SCHEMA = "SET_METADATA_SCHEMA";
export const setMetadataSchema = createAction(SET_METADATA_SCHEMA);

export const metadataSchemaReducer = (
  metadataSchema = { subjectSchema: {}, seriesSchema: {} },
  action
) => {
  const { type, payload } = action;

  switch (type) {
    case SET_METADATA_SCHEMA:
      return {
        seriesSchema: R.merge(
          metadataSchema.seriesSchema,
          payload.seriesSchema || {}
        ),
        subjectSchema: R.merge(
          metadataSchema.subjectSchema,
          payload.subjectSchema || {}
        )
      };
    default:
      return metadataSchema;
  }
};
