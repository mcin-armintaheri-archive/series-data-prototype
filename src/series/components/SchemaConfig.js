import React, { Component } from "react";
import * as R from "ramda";
import { Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import MetadataSchemaConfigForm from "./MetadataSchemaConfigForm";
import SplitView from "./SplitView";
import SchemaView from "./SchemaView";

const FieldConfig = ({ schema, setSchema }) => {
  return (
    <Row>
      <Col xs={12}>
        <MetadataSchemaConfigForm
          labelName={schema.labelName}
          onLabelChange={labelName => setSchema({ labelName })}
          description={schema.description}
          onDescriptionChange={description => setSchema({ description })}
          inputTypes={["TextField", "DatePicker", "Dropdown"]}
          inputType={schema.inputType}
          onInputTypeChange={inputType => setSchema({ inputType })}
        />
      </Col>
    </Row>
  );
};

const SchemaConfigTab = ({
  label,
  schema,
  schemaPath,
  setSchemaPath,
  setSchema,
  saveSchema,
  cancelSchema
}) => {
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
              onFieldSelect={setSchemaPath}
            />
            {activeSchema && (
              <FieldConfig
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
            <Button onClick={() => saveSchema(schema)}>Save</Button>
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
    this.setSchemaPath = this.setSchemaPath.bind(this);
  }
  setSchemaPath(activePath) {
    this.setState({ activePath });
  }
  render() {
    const { activePath } = this.state;
    const schemaPath =
      activePath && R.append("schema", R.intersperse("schema", activePath));
    return (
      <SchemaConfigTab
        schemaPath={schemaPath}
        setSchemaPath={this.setSchemaPath}
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
      seriesSchema: props.seriesSchema || {}
    };
    this.setSubjectSchema = this.setSubjectSchema.bind(this);
    this.setSeriesSchema = this.setSeriesSchema.bind(this);
  }
  componentWillReceiveProps({ subjectSchema, seriesSchema }) {
    this.setSubjectSchema(subjectSchema);
    this.setSeriesSchema(seriesSchema);
  }
  setSubjectSchema(subjectSchema) {
    this.setState({ subjectSchema });
  }
  setSeriesSchema(seriesSchema) {
    this.setState({ seriesSchema });
  }
  render() {
    const { saveSubjectSchema, saveSeriesSchema } = this.props;
    const { subjectSchema, seriesSchema } = this.state;
    return (
      <SchemaConfigTabState
        label={"Subject Metadata Configuration"}
        schema={subjectSchema}
        setSchema={this.setSubjectSchema}
        saveSchema={saveSubjectSchema}
        cancelSchema={() => {
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
                seriesSchema: this.props.seriesSchema
              })
          );
        }}
      />
    );
  }
}
