import React, { Component } from "react";
import * as R from "ramda";
import { Tabs, Tab, Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import MetadataSchemaConfigForm from "./MetadataSchemaConfigForm";
import SplitView from "./SplitView";
import SchemaView from "./SchemaView";

const getSchemaPath = path =>
  path && R.append("schema", R.intersperse("schema", path));

const FieldConfig = ({ activePath, schema, setSchema }) => {
  return (
    <Row>
      <Col xs={12}>
        <MetadataSchemaConfigForm
          path={activePath}
          labelName={schema.labelName}
          onLabelChange={labelName => setSchema({ labelName })}
          description={schema.description}
          onDescriptionChange={description => setSchema({ description })}
          inputTypes={["TextField", "DatePicker", "Dropdown"]}
          inputType={schema.inputType}
          onInputTypeChange={inputType => setSchema({ inputType })}
          options={schema.options}
          onOptionsChange={options => setSchema({ options })}
        />
      </Col>
    </Row>
  );
};

const SchemaConfigTab = ({
  label,
  schema,
  activePath,
  setActivePath,
  setSchema,
  saveSchema,
  cancelSchema,
  editing = false
}) => {
  const schemaPath = getSchemaPath(activePath);
  const activeSchema = schemaPath && R.path(schemaPath, schema);
  return (
    <Row>
      <Row>
        <Col xs={12}>
          <SplitView>
            <SchemaView
              label={label}
              schema={schema}
              setSchema={setSchema}
              onFieldSelect={setActivePath}
            />
            {activeSchema && (
              <FieldConfig
                activePath={activePath}
                schema={activeSchema}
                setSchema={innerSchema =>
                  setSchema(
                    R.assocPath(
                      schemaPath,
                      R.merge(activeSchema, innerSchema),
                      schema
                    )
                  )
                }
              />
            )}
          </SplitView>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Col xs={1}>
            <Button
              bsStyle={editing ? "primary" : "default"}
              onClick={() => saveSchema(schema)}
            >
              Save
            </Button>
          </Col>
          <Col xs={1}>
            <Button onClick={() => cancelSchema()}>Cancel</Button>
          </Col>
        </Col>
      </Row>
    </Row>
  );
};

class SchemaConfigTabState extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePath: null
    };
    this.setActivePath = this.setActivePath.bind(this);
  }
  setActivePath(activePath) {
    this.setState({ activePath });
  }
  render() {
    const { activePath } = this.state;
    return (
      <SchemaConfigTab
        activePath={activePath}
        setActivePath={this.setActivePath}
        {...this.props}
      />
    );
  }
}

export default class SchemaConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subjectSchema: props.subjectSchema || {},
      seriesSchema: props.seriesSchema || {},
      editing: false
    };
    this.setSubjectSchema = this.setSubjectSchema.bind(this);
    this.setSeriesSchema = this.setSeriesSchema.bind(this);
    this.cancelSchemaConfig = this.cancelSchemaConfig.bind(this);
  }
  componentWillReceiveProps({ subjectSchema, seriesSchema }) {
    this.setSubjectSchema(subjectSchema);
    this.setSeriesSchema(seriesSchema);
    this.setState({ editing: false });
  }
  setSubjectSchema(subjectSchema) {
    this.setState({ editing: true });
    this.setState({ subjectSchema });
  }
  setSeriesSchema(seriesSchema) {
    this.setState({ editing: true });
    this.setState({ seriesSchema });
  }
  cancelSchemaConfig() {
    Swal({
      title: "Cancel?",
      text:
        "Are you sure you want to undo your field additions and schema changes?",
      type: "warning",
      showCancelButton: true
    }).then(
      res =>
        res.value &&
        this.setState({
          subjectSchema: this.props.subjectSchema,
          seriesSchema: this.props.seriesSchema,
          editing: false
        })
    );
  }
  render() {
    const { saveSubjectSchema, saveSeriesSchema } = this.props;
    const { subjectSchema, seriesSchema, editing } = this.state;
    return (
      <Tabs defaultActiveKey={1} id="schema-config-tabs">
        <Tab eventKey={1} title="Subject Metadata">
          <SchemaConfigTabState
            label={"Subject Metadata Configuration"}
            schema={subjectSchema}
            setSchema={this.setSubjectSchema}
            saveSchema={saveSubjectSchema}
            cancelSchema={this.cancelSchemaConfig}
            editing={editing}
          />
        </Tab>
        <Tab eventKey={2} title="Series Metadata">
          <SchemaConfigTabState
            label={"Series Metadata Configuration"}
            schema={seriesSchema}
            setSchema={this.setSeriesSchema}
            saveSchema={saveSeriesSchema}
            cancelSchema={this.cancelSchemaConfig}
            editing={editing}
          />
        </Tab>
      </Tabs>
    );
  }
}
