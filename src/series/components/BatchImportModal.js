import * as R from "ramda";
import React, { Component } from "react";
import { compose, withState } from "recompose";
import { Row, Col, Button, Modal, Tabs, Tab } from "react-bootstrap";
import BatchImport from "./BatchImport";
import SplitView from "./SplitView";
import Tables from "./Tables";
import RawDataTraceToColumnMap, {
  X_TYPES,
  INITIAL_COLUMN_MAP
} from "./RawDataTraceToColumnMap";

const getColumnSelector = (selected, columnMap) =>
  selected && !isNaN(selected.traceIndex)
    ? columnMap.traces[selected.traceIndex]
    : selected && selected.epoch
      ? columnMap.epochs[selected.epoch]
      : selected && selected.xAxis
        ? columnMap.xAxis.columnSelector
        : null;

const updateColumnMap = (selected, columnSelector, columnMap) =>
  selected && !isNaN(selected.traceIndex)
    ? R.assoc(
        "traces",
        R.update(selected.traceIndex, columnSelector, columnMap.traces),
        columnMap
      )
    : selected && selected.epoch
      ? R.assoc(
          "epochs",
          R.assoc(selected.epoch, columnSelector, columnMap.epochs),
          columnMap
        )
      : selected && selected.xAxis
        ? R.assocPath(["xAxis", "columnSelector"], columnSelector, columnMap)
        : columnMap;

const withActiveIndex = compose(
  withState("activeTab", "setActiveTab", 0),
  withState("activeIndex", "setActiveIndex", 0)
);

const TransposedBatches = withActiveIndex(
  ({
    batches = [],
    activeTab = 0,
    setActiveTab,
    activeIndex = 0,
    setActiveIndex
  }) => (
    <Tabs
      animation={false}
      activeKey={activeTab}
      onSelect={x => {
        setActiveTab(x);
      }}
      id="transposed-signals-tabs"
    >
      <Tab eventKey={0} title="View Tables">
        <br />
        <br />
        <Tables tables={batches[0]} />
      </Tab>
    </Tabs>
  )
);

const transpose = batches => batches.map(R.reject(R.isNil));

const BatchUploadTab = ({ batches, setBatches }) => {
  return (
    <Row>
      <Col xs={12}>
        <SplitView>
          <BatchImport batches={batches} setBatches={setBatches} />
          <TransposedBatches batches={transpose(batches)} />
        </SplitView>
      </Col>
    </Row>
  );
};

const withColumnSelectState = withState("selected", "setSelected", null);

const ColumnSelectTab = withColumnSelectState(
  ({
    batch,
    columnMap = INITIAL_COLUMN_MAP,
    setColumnMap,
    selected = null,
    setSelected
  }) => {
    const onReset = () => {
      setSelected(null);
    };
    return (
      <Row>
        <Col xs={12}>
          <SplitView>
            <RawDataTraceToColumnMap
              selected={selected}
              setSelected={setSelected}
              columnMap={columnMap}
              setColumnMap={setColumnMap}
              onReset={onReset}
            />
            {batch && (
              <Tables
                tables={batch}
                selectedColumns={[getColumnSelector(selected, columnMap)]}
                onSelect={columnSelector => {
                  const oldSelector = getColumnSelector(selected, columnMap);
                  if (
                    oldSelector &&
                    oldSelector.pageIndex === columnSelector.pageIndex &&
                    oldSelector.column === columnSelector.column
                  ) {
                    setColumnMap(updateColumnMap(selected, null, columnMap));
                    return;
                  }
                  setColumnMap(
                    updateColumnMap(selected, columnSelector, columnMap)
                  );
                  onReset();
                }}
              />
            )}
          </SplitView>
        </Col>
      </Row>
    );
  }
);

const BatchImportModal = ({
  show = false,
  setShow,
  batches = [[]],
  setBatches,
  columnMap = INITIAL_COLUMN_MAP,
  setColumnMap,
  runBatchImport
}) => {
  return (
    <Modal bsSize="large" show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Import CSV Tables</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey={0} id="import-tabs" animation={false}>
          <Tab eventKey={0} title="Upload CSV tables">
            <BatchUploadTab batches={batches} setBatches={setBatches} />
          </Tab>
          <Tab
            eventKey={1}
            title="Assign Raw Data"
            disabled={!(batches && batches[0])}
          >
            {batches && batches[0] ? (
              <ColumnSelectTab
                batch={batches.reduce((a, b) => a.concat(b), [])}
                columnMap={columnMap}
                setColumnMap={setColumnMap}
              />
            ) : (
              <h4>There are no loaded tables to work with.</h4>
            )}
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button
          bsStyle="primary"
          onClick={() => {
            try {
              runBatchImport(batches, columnMap);
            } catch (e) {
              alert(e);
            }
          }}
        >
          Add Series
        </Button>
        <Button onClick={() => setShow(false)}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BatchImportModal;

export class BatchImportModalTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      batches: [[]],
      columnMap: INITIAL_COLUMN_MAP
    };
  }
  render() {
    const { show, setShow, createSeries } = this.props;
    const { batches, columnMap } = this.state;
    const setState = key => value => this.setState({ [key]: value });
    const setColumnMap = setState("columnMap");
    const runBatchImport = (transposedBatches, columnMap) => {
      const getColumn = (columnSelector, batch) => {
        if (!columnSelector) {
          return null;
        }

        const { pageIndex, column } = columnSelector;
        return batch[pageIndex].rows.map(row => Number(row[column]));
      };
      transposedBatches.forEach((batch, i) => {
        const traces = columnMap.traces.map(columnSelector => {
          const colData = getColumn(columnSelector, batch);
          if (!colData) {
            throw new Error("Please set one or more traces to a table column.");
          }
          let xData;
          switch (columnMap.xAxis.type) {
            case X_TYPES.RANGE: {
              const { start, end } = columnMap.xAxis;
              xData = colData.map(
                (_, i) => start + (end - start) * (i / colData.length)
              );
              break;
            }
            case X_TYPES.COLUMN: {
              xData = getColumn(columnMap.xAxis.columnSelector, batch);
              break;
            }
            default: {
              throw new Error(
                `xAxis has an invalid type ${columnMap.xAxis.type}`
              );
            }
          }
          return R.zipWith((x, y) => ({ x, y }), xData, colData);
        });
        const epochs = R.zipWith(
          (start, end) => ({ tag: 0, domain: [start, end] }),
          getColumn(columnMap.epochs.start, batch) || [],
          getColumn(columnMap.epochs.end, batch) || []
        );
        if (traces.length === 0) {
          throw new Error(
            "Please create and assign at least once trace to a table column."
          );
        }
        createSeries({ name: `New Signal`, traces, epochs, zoom: 1 });
        setState("columnMap")(INITIAL_COLUMN_MAP);
      });
      setShow(false);
    };
    return (
      <BatchImportModal
        show={show}
        setShow={setShow}
        batches={batches}
        setBatches={setState("batches")}
        columnMap={columnMap}
        setColumnMap={setColumnMap}
        runBatchImport={runBatchImport}
      />
    );
  }
}
