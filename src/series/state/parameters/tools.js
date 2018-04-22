import { createAction } from "redux-actions";

export const Tools = {
  NONE: "NONE",
  ADD_EPOCH: "ADD_EPOCH",
  REMOVE_EPOCH: "REMOVE_EPOCH"
};

export const ToolInfo = {
  NONE: { name: "None" },
  ADD_EPOCH: { name: "Add Epoch" },
  REMOVE_EPOCH: { name: "Remove Epoch" }
};

export const SET_TOOL = "SET_TOOL";
export const setTool = createAction(SET_TOOL);

export const toolsReducer = (activeTool = Tools.NONE, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_TOOL: {
      return !!Tools[payload] ? Tools[payload] : activeTool;
    }
    default:
      return activeTool;
  }
};
