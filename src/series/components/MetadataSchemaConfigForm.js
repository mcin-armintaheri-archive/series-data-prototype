import React, { Component } from "react";
import * as R from "ramda";
import { withState } from "recompose";
import TextField from "./TextField";
import Dropdown from "./Dropdown";
import { Button, ControlLabel, Row, Col } from "react-bootstrap";

const DropdownTags = ({ tags, onTagsChange }) => {
  const tagStyle = {
    display: "inline-block",
    margin: "5px",
    padding: "6px",
    backgroundColor: "lightgray",
    borderStyle: "solid",
    borderColor: "gray",
    borderRadius: "5px"
  };
  const AddTag = withState("value", "setValue", "")(({ value, setValue }) => (
    <div>
      <input value={value} onChange={e => setValue(e.target.value)} />
      <Button
        onClick={() => {
          onTagsChange(R.append(value, tags));
          setValue("");
        }}
      >
        Add
      </Button>
    </div>
  ));

  const RemoveTag = ({ index }) => (
    <span
      style={{ cursor: "pointer", padding: "5px" }}
      onClick={() => onTagsChange(R.remove(index, 1, tags))}
    >
      x
    </span>
  );
  const Tag = ({ index, tag }) => (
    <div style={tagStyle}>
      {tag} | <RemoveTag index={index} />
    </div>
  );
  return (
    <div>
      <AddTag />
      <div>
        {tags.map((tag, i) => (
          <Tag key={`${tags.length}-${i}`} index={i} tag={tag} />
        ))}
      </div>
    </div>
  );
};

class MetadataSchemaConfigForm extends Component {
  render() {
    const title = R.join(" > ", this.props.path || []);
    return (
      <Row>
        <Row>
          <Col xs={12}>
            <ControlLabel>{title}</ControlLabel>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col xs={3} md={2}>
            <ControlLabel>Label Name: </ControlLabel>
          </Col>
          <Col xs={9} md={10}>
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
        <br />
        {this.props.inputType === "Dropdown" && (
          <div>
            <ControlLabel>Options: </ControlLabel>
            <DropdownTags
              tags={this.props.options || []}
              onTagsChange={this.props.onOptionsChange}
            />
          </div>
        )}
      </Row>
    );
  }
}

export default MetadataSchemaConfigForm;
