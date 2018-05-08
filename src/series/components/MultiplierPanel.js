import React from "react";

const MultiplierPanel = ({
  onChange,
  label,
  multiplierLabel,
  multiplier,
  factor
}) => {
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>{multiplierLabel}:&nbsp;</div>
          <div>{multiplier.toFixed(3)}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>
            <button onClick={() => onChange(multiplier * factor)}>{"+"}</button>
          </div>
          <div>
            <button onClick={() => onChange(multiplier / factor)}>{"-"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiplierPanel;
