import React from "react";
import * as R from "ramda";
import { DropdownButton, MenuItem, Row, Col } from "react-bootstrap";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";
import EditableText from "./EditableText.js";
import Clickable from "./Clickable";

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
        const deleteKey =
          setSchema &&
          (delKey => {
            const clone = R.clone(schema);
            delete clone[innerLabel];
            setSchema(clone, true);
          });
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
            deleteKey={deleteKey}
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
            deleteKey={deleteKey}
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
  deleteKey,
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
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-right",
              alignItems: "center"
            }}
          >
            <EditableText value={label} onSubmit={setSchemaKey} />
            <Clickable>
              <FontAwesomeIcon
                icon={faTrash}
                onClick={e => {
                  e.stopPropagation();
                  deleteKey(label);
                }}
              />
            </Clickable>
          </div>
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

const LeafField = ({ path = [], label, setSchemaKey, deleteKey, onClick }) => {
  const editable = setSchemaKey instanceof Function;
  return (
    <li style={{ cursor: "pointer" }} onClick={() => onClick(path)}>
      {editable ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-right",
            alignItems: "center"
          }}
        >
          <EditableText value={label} onSubmit={setSchemaKey} />
          <Clickable>
            <FontAwesomeIcon
              icon={faTrash}
              onClick={e => {
                e.stopPropagation();
                deleteKey(label);
              }}
            />
          </Clickable>
        </div>
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
