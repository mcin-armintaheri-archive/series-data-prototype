import React, { Component } from "react";
import PropTypes from "prop-types";
import * as R from "ramda";
import { Button, Row, Col, NavItem, Nav } from "react-bootstrap";

const RawDataTraceToColumnMap = ({
  selected = null,
  columns = {
    traces: [],
    epochs: { start: null, end: null }
  },
  setColumns,
  onSelect,
  onReset
}) => {
  const setTraces = traces => setColumns(R.assoc("traces", traces, columns));
  const selectTrace = traceIndex => onSelect({ traceIndex });
  const selectEpoch = epoch => onSelect({ epoch });
  return (
    <div>
      <h4 style={{ fontWeight: "bold" }}> Series Raw Data Columns </h4>
      <div>
        {" "}
        Note: there is one table per series and one column per trace{" "}
      </div>{" "}
      <br />
      <div>
        <Button
          disabled={!selected}
          bsStyle="default"
          bsSize="small"
          onClick={onReset}
        >
          Reset selection
        </Button>
      </div>
      <br />
      <div>
        <label> X-axis </label> <br />
      </div>
      <div>
        <Row>
          <Col xs={3} md={3}>
            <label> Trace Columns </label>
          </Col>
          <Col>
            <Button
              bsStyle="default"
              bsSize="xsmall"
              onClick={() => setTraces(R.append(null, columns.traces))}
            >
              +
            </Button>
          </Col>
        </Row>
        <Nav
          bsStyle="pills"
          stacked
          activeKey={selected && selected.traceIndex}
        >
          {columns.traces.map((columnName, index) => (
            <NavItem
              key={`${index}-${columns.traces.length}`}
              onSelect={() => selectTrace(index)}
              eventKey={index}
            >
              {" "}
              Trace Column {index} : {columnName}{" "}
            </NavItem>
          ))}
        </Nav>
      </div>
      <div>
        <label> Epoch Columns </label>
        <Nav bsStyle="pills" stacked activeKey={selected && selected.epoch}>
          <NavItem eventKey="start" onSelect={() => selectEpoch("start")}>
            {" "}
            Epoch Start Column: {columns.epochs.start}
          </NavItem>
          <NavItem eventKey="end" onSelect={() => selectEpoch("end")}>
            {" "}
            Epoch End Column: {columns.epochs.end}{" "}
          </NavItem>
        </Nav>
        <br />
      </div>
    </div>
  );
};

RawDataTraceToColumnMap.propTypes = {
  selected: PropTypes.oneOfType([
    PropTypes.shape({ traceIndex: PropTypes.number }),
    PropTypes.shape({ epoch: PropTypes.oneOf(["start", "end"]) })
  ]).isRequired,
  columns: (PropTypes.shape({
    traces: PropTypes.arrayOf(PropTypes.string),
    epochs: PropTypes.shape({ start: PropTypes.any, end: PropTypes.any })
  }).isRequired = {
    traces: [],
    epochs: { start: null, end: null }
  }),
  setColumns: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired
};

export default RawDataTraceToColumnMap;

export class RawDataTraceToColumnMapTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      columns: {
        traces: [null, null],
        epochs: { start: null, end: null }
      }
    };
  }
  render() {
    const setColumns = columns => this.setState({ columns });
    const onSelect = selected => this.setState({ selected });
    const onReset = () => this.setState({ selected: null });
    const { selected, columns } = this.state;
    return (
      <RawDataTraceToColumnMap
        selected={selected}
        columns={columns}
        onSelect={onSelect}
        onReset={onReset}
        setColumns={setColumns}
      />
    );
  }
}
