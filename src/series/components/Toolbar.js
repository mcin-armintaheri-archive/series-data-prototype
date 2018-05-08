import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { Tools, ToolInfo } from "../state/parameters/tools";

const Toolbar = ({ activeTool, setTool, onSave, onLoad, style }) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", ...style }}>
      <ButtonGroup>
        {Object.keys(Tools).map(tool => (
          <Button
            bsStyle={`${tool === activeTool ? "primary" : "default"}`}
            onClick={() => setTool(tool)}
          >
            {ToolInfo[tool].name}
          </Button>
        ))}
      </ButtonGroup>
      <ButtonGroup>
        <Button
          disabled={!onSave}
          onClick={event =>
            event.buttons === 1 && event.button === 1 && !!onSave && onSave()
          }
        >
          Save
        </Button>
        <Button
          disabled={!onLoad}
          onClick={event =>
            event.buttons === 1 && event.button === 1 && !!onLoad && onLoad()
          }
        >
          Load
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default Toolbar;
