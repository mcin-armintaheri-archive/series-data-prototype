import React, { Component } from "react";
import * as R from "ramda";
import { ControlLabel, Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import SplitView from "./SplitView";
import SchemaView from "./SchemaView";
import MetadataEditForm from "./MetadataEditForm";

const getSchemaPath = path =>
  path && R.append("schema", R.intersperse("schema", path));

const CategoryForm = ({ activePath, schema, metadata, setMetadata }) => {
  const activeSchema = activePath && R.path(getSchemaPath(activePath), schema);
  const activeMetadata = metadata && activePath && R.path(activePath, metadata);
  const setMetadataValue =
    metadata &&
    activePath &&
    (value => setMetadata(R.assocPath(activePath, value, metadata)));
  const pathTitle = R.join(" > ", activePath || []);
  return activeSchema ? (
    <Row>
      <Row>
        <Col xs={12}>
          <ControlLabel>{pathTitle}</ControlLabel>
          <hr />
        </Col>
      </Row>
      <Col xs={12}>
        <MetadataEditForm
          dataComponents={[activeSchema]}
          metaDataValue={activeMetadata}
          setMetadataValue={setMetadataValue}
        />
      </Col>
    </Row>
  ) : null;
};

export default class MetadataEntry extends Component {
  constructor(props) {
    super(props);
    this.state = { editing: false, metadata: props.metadata, activePath: null };
    this.setSchemaPath = this.setSchemaPath.bind(this);
    this.setMetadata = this.setMetadata.bind(this);
    this.saveMetadata = this.saveMetadata.bind(this);
    this.cancelMetadata = this.cancelMetadata.bind(this);
  }
  setSchemaPath(activePath) {
    this.setState({ activePath });
  }
  componentWillReceiveProps({ metadata }) {
    this.setState({ metadata, editing: false });
  }
  setMetadata(metadata) {
    this.setState({ metadata, editing: true });
  }
  saveMetadata() {
    const { saveMetadata } = this.props;
    if (!(saveMetadata instanceof Function)) {
      throw new Error("props.saveMetadata is not a function");
    }
    this.props.saveMetadata(this.state.metadata);
  }
  cancelMetadata() {
    Swal({
      title: "Cancel?",
      text: "Are you sure you want to undo your metadata entry?",
      type: "warning",
      showCancelButton: true
    }).then(
      res =>
        res.value &&
        this.setState({
          metadata: this.props.metadata,
          editing: false
        })
    );
  }
  render() {
    const { title, schema } = this.props;
    const { activePath, metadata, editing } = this.state;
    return (
      <Row>
        <Row>
          <Col xs={12}>
            <SplitView>
              <SchemaView
                label={title}
                schema={schema}
                schemaPath={getSchemaPath(activePath)}
                onFieldSelect={this.setSchemaPath}
              />
              <CategoryForm
                activePath={activePath}
                schema={schema}
                metadata={metadata}
                setMetadata={this.setMetadata}
              />
            </SplitView>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Col xs={1}>
              <Button
                bsStyle={editing ? "primary" : "default"}
                onClick={this.saveMetadata}
              >
                Save
              </Button>
            </Col>
            <Col xs={1}>
              <Button onClick={this.cancelsaveMetadata}>Cancel</Button>
            </Col>
          </Col>
        </Row>
      </Row>
    );
  }
}
