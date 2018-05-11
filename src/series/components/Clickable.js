import React from "react";

const Clickable = ({ children, ...props }) => (
  <span style={{ margin: "5px 5px", cursor: "pointer" }} {...props}>
    {children}
  </span>
);

export default Clickable;
