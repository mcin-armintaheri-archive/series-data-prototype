import React from "react";
import { Row, Col } from "react-bootstrap";

const SplitView = ({ children }) => {
  if (React.Children.count(children) > 2) {
    throw new Error("Only 2 children can be nested.");
  }
  const [left, right] = React.Children.toArray(children);
  return (
    <Row>
      <Col xs={6}>{left}</Col>
      <Col xs={6}>{right}</Col>
    </Row>
  );
};

export default SplitView;
