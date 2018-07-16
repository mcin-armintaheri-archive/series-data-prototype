import React, { Component } from "react";
import TextField from "./TextField";
import Dropdown from "./Dropdown";
import { ControlLabel, Row, Col } from "react-bootstrap";

class MetadataSchemaConfigForm extends Component {
  render() {
    return (
      <Row>
        <Row>
          <Col xs={3} md={2}>
            <ControlLabel>Label Name: </ControlLabel>
          </Col>
          <Col xs={4} md={2}>
            <TextField
              inputVal={this.props.labelName || ""}
              onChange={this.props.onLabelChange}
            />
          </Col>
        </Row>
        <br />
        <ControlLabel>Description: </ControlLabel>
        <TextField
          inputVal={this.props.description || ""}
          onChange={this.props.onDescriptionChange}
        />
        <br />
        <ControlLabel>Input Type: </ControlLabel>
        <Dropdown
          dropItems={this.props.inputTypes || []}
          selectedItem={this.props.inputType || "None"}
          onSelect={this.props.onInputTypeChange}
        />
      </Row>
    );
  }
}

export default MetadataSchemaConfigForm;
