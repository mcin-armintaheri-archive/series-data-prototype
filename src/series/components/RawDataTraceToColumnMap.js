import React, { Component } from "react";
import PropTypes from "prop-types";
import * as R from "ramda";
import {
  DropdownButton,
  MenuItem,
  Button,
  Row,
  Col,
  NavItem,
  Nav
} from "react-bootstrap";

export const X_TYPES = {
  RANGE: "Range",
  COLUMN: "Column"
};

export const INITIAL_COLUMN_MAP = {
  xAxis: { type: X_TYPES.RANGE, start: 0, end: 100 },
  traces: [],
  epochs: { start: null, end: null }
};

const Range = ({ range, setRange }) => (
  <div>
    <label>start:</label>
    <input
      style={{ maxWidth: "75px" }}
      type="number"
      value={range[0]}
      onChange={e => setRange([Number(e.target.value), range[1]])}
    />{" "}
    <label>end:</label>
    <input
      style={{ maxWidth: "75px" }}
      type="number"
      value={range[1]}
      onChange={e => setRange([range[0], Number(e.target.value)])}
    />
  </div>
);

const RawDataTraceToColumnMap = ({
  selected = null,
  columnMap = INITIAL_COLUMN_MAP,
  setColumnMap,
  setSelected,
  onReset
}) => {
  const setTraces = traces =>
    setColumnMap(R.assoc("traces", traces, columnMap));
  const selectTrace = traceIndex => setSelected({ traceIndex });
  const selectEpoch = epoch => setSelected({ epoch });
  const selectXAxis = () => setSelected({ xAxis: "xAxis" });
  const setRange = ([start, end]) =>
    setColumnMap(
      R.assocPath(
        ["xAxis", "start"],
        start,
        R.assocPath(["xAxis", "end"], end, columnMap)
      )
    );
  const setXAxisType = type =>
    setColumnMap(R.assocPath(["xAxis", "type"], type, columnMap));
  return (
    <div>
      <h4 style={{ fontWeight: "bold" }}> Series Raw Data Columns </h4>
      <div>
        {" "}
        Note: there is one table per series and one column per trace{" "}
      </div>{" "}
      <br />
      <Row>
        <Col xs={12}>
          <Button
            disabled={!selected}
            bsStyle="default"
            bsSize="small"
            onClick={onReset}
          >
            Reset selection
          </Button>
        </Col>
      </Row>
      <br />
      <Row>
        <Col xs={12}>
          <label>X Axis Type:</label>{" "}
          <DropdownButton
            bsStyle="default"
            title={columnMap.xAxis.type}
            id="x-axis-type-selection"
          >
            <MenuItem
              eventKey="range"
              onSelect={() => setXAxisType(X_TYPES.RANGE)}
            >
              {X_TYPES.RANGE}
            </MenuItem>
            <MenuItem
              eventKey="column"
              onSelect={() => setXAxisType(X_TYPES.COLUMN)}
            >
              {X_TYPES.COLUMN}
            </MenuItem>
          </DropdownButton>
          <Nav
            bsStyle="pills"
            stacked
            activeKey={selected && selected.traceIndex}
          >
            <NavItem
              onSelect={() =>
                columnMap.xAxis.type === X_TYPES.COLUMN && selectXAxis()
              }
              eventKey="x-axis-column"
            >
              {" "}
              X Axis {columnMap.xAxis.type}:{" "}
              {columnMap.xAxis.type === X_TYPES.COLUMN ? (
                columnMap.xAxis.columnSelector &&
                columnMap.xAxis.columnSelector.column
              ) : (
                <Range
                  range={R.props(["start", "end"], columnMap.xAxis)}
                  setRange={setRange}
                />
              )}{" "}
            </NavItem>
          </Nav>
        </Col>
      </Row>
      <div>
        <Row>
          <Col xs={9}>
            <label> Trace Columns </label>
          </Col>
          <Col xs={3}>
            <Button
              bsStyle="default"
              bsSize="xsmall"
              onClick={() => setTraces(R.append(null, columnMap.traces))}
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
          {columnMap.traces.map((columnSelector, index) => (
            <NavItem
              key={`${index}-${columnMap.traces.length}`}
              onSelect={() => selectTrace(index)}
              eventKey={index}
            >
              {" "}
              Trace Column {index} : {columnSelector && columnSelector.column}{" "}
            </NavItem>
          ))}
        </Nav>
      </div>
      <div>
        <label> Epoch Columns </label>
        <Nav bsStyle="pills" stacked activeKey={selected && selected.epoch}>
          <NavItem eventKey="start" onSelect={() => selectEpoch("start")}>
            {" "}
            Epoch Start Column:{" "}
            {columnMap.epochs.start && columnMap.epochs.start.column}
          </NavItem>
          <NavItem eventKey="end" onSelect={() => selectEpoch("end")}>
            {" "}
            Epoch End Column:{" "}
            {columnMap.epochs.end && columnMap.epochs.end.column}{" "}
          </NavItem>
        </Nav>
        <br />
      </div>
    </div>
  );
};

RawDataTraceToColumnMap.propTypes = {
  selected: PropTypes.oneOfType([
    PropTypes.oneOf(["xAxis"]),
    PropTypes.shape({ traceIndex: PropTypes.number }),
    PropTypes.shape({ epoch: PropTypes.oneOf(["start", "end"]) })
  ]),
  columnMap: PropTypes.shape({
    xAxis: PropTypes.oneOfType([
      PropTypes.shape({
        type: PropTypes.oneOf([X_TYPES.RANGE, X_TYPES.COLUMN]),
        start: PropTypes.number,
        end: PropTypes.number,
        columnSelector: PropTypes.shape({
          pageIndex: PropTypes.number,
          column: PropTypes.string
        })
      })
    ]),
    traces: PropTypes.arrayOf(
      PropTypes.shape({ pageIndex: PropTypes.number, column: PropTypes.string })
    ),
    epochs: PropTypes.shape({ start: PropTypes.any, end: PropTypes.any })
  }).isRequired,
  setColumnMap: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired
};

export default RawDataTraceToColumnMap;

export class RawDataTraceToColumnMapTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      columnMap: INITIAL_COLUMN_MAP
    };
  }
  render() {
    const setColumnMap = columnMap => this.setState({ columnMap });
    const setSelected = selected => this.setState({ selected });
    const onReset = () => this.setState({ selected: null });
    const { selected, columnMap } = this.state;
    return (
      <RawDataTraceToColumnMap
        columnMap={columnMap}
        setColumnMap={setColumnMap}
        selected={selected}
        setSelected={setSelected}
        onReset={onReset}
      />
    );
  }
}
