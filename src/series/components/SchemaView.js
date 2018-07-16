import React from "react";
import * as R from "ramda";
import { DropdownButton, MenuItem, Row, Col } from "react-bootstrap";
import EditableText from "./EditableText.js";

const Branch = ({ path = [], schema, setSchema, onClick }) => {
  const keys = R.keys(schema);
  const innerLens = innerLabel =>
    R.compose(R.lensProp(innerLabel), R.lensProp("schema"));
  const setInnerSchema = innerLabel =>
    setSchema &&
    ((innerSchema, forced = false) =>
      setSchema(
        R.over(
          innerLens(innerLabel),
          forced ? () => innerSchema : R.merge(R.__, innerSchema),
          schema
        )
      ));
  return (
    <ul>
      {keys.map((innerLabel, i) => {
        const setSchemaKey =
          setSchema &&
          (newKey => {
            const clone = R.clone(schema);
            const innerSchema = clone[innerLabel];
            delete clone[innerLabel];
            setSchema(R.assoc(newKey, innerSchema, clone), true);
          });
        return schema[innerLabel].nested ? (
          <NestedField
            path={R.concat(path, [innerLabel])}
            onClick={onClick}
            key={`${i}-${keys.length}`}
            label={innerLabel}
            schema={schema[innerLabel].schema}
            setSchema={setInnerSchema(innerLabel)}
            setSchemaKey={setSchemaKey}
          />
        ) : (
          <LeafField
            path={R.concat(path, [innerLabel])}
            onClick={onClick}
            key={`${i}-${keys.length}`}
            label={innerLabel}
            schema={schema[innerLabel].schema}
            setSchema={setInnerSchema(innerLabel)}
            setSchemaKey={setSchemaKey}
          />
        );
      })}
    </ul>
  );
};

const NestedField = ({
  path = [],
  label,
  setSchemaKey,
  schema,
  setSchema,
  onClick
}) => {
  const editable = setSchemaKey instanceof Function;
  return (
    <li>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "10px"
        }}
      >
        {editable ? (
          <EditableText value={label} onSubmit={setSchemaKey} />
        ) : (
          label
        )}
        <div>
          {setSchema && <AddField schema={schema} setSchema={setSchema} />}
        </div>
      </div>
      <Branch
        path={path}
        schema={schema}
        setSchema={setSchema}
        onClick={onClick}
      />
    </li>
  );
};

const LeafField = ({ path = [], label, setSchemaKey, onClick }) => {
  const editable = setSchemaKey instanceof Function;
  return (
    <li style={{ cursor: "pointer" }} onClick={() => onClick(path)}>
      {editable ? (
        <EditableText value={label} onSubmit={setSchemaKey} />
      ) : (
        label
      )}
    </li>
  );
};

const AddField = ({ key, schema, setSchema }) => {
  const makeName = schema => {
    let i = 1;
    let key = `new-field-${i}`;
    while (!!schema[key]) {
      i++;
      key = `new-field-${i}`;
      continue;
    }
    return key;
  };
  return (
    <DropdownButton
      style={{ marginLeft: "10px" }}
      bsSize="xsmall"
      title={"Add"}
      id={`addFieldDropdown-${key}`}
    >
      <MenuItem
        onClick={() =>
          setSchema(R.assoc(makeName(schema), { schema: {} }, schema))
        }
      >
        Add Field
      </MenuItem>
      <MenuItem divider />
      <MenuItem
        onClick={() =>
          setSchema(
            R.assoc(makeName(schema), { nested: true, schema: {} }, schema)
          )
        }
      >
        Add Category
      </MenuItem>
    </DropdownButton>
  );
};

const SchemaView = ({ label = "", schema = {}, setSchema, onFieldSelect }) => {
  return (
    <Row>
      <Col xs={12}>
        <Row>
          <Col xs={12}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 0 20px" }}>{label}</h3>
              </div>
              <div>
                {setSchema && (
                  <AddField schema={schema} setSchema={setSchema} />
                )}
              </div>
            </div>
          </Col>
        </Row>
        <Branch schema={schema} setSchema={setSchema} onClick={onFieldSelect} />
      </Col>
    </Row>
  );
};

export default SchemaView;
