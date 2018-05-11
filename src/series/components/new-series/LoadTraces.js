import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import FromColumns from "./FromColumns";
import FromRange from "./FromRange";

const XAxisContent = ({ setXType, seriesData, setSeriesData }) => {
  const onSelect = key => {
    if (key === 0) {
      setXType("range");
    } else if (key === 1) {
      setXType("column");
    }
  };
  return (
    <Tabs defaultActiveKey={0} onSelect={onSelect} id="x-content-tabs">
      <Tab eventKey={0} title="From Range">
        <FromRange
          range={seriesData.xRange}
          setRange={xRange => setSeriesData({ xRange })}
        />
      </Tab>
      <Tab eventKey={1} title="From Column">
        <FromColumns
          setColumns={columns => setSeriesData({ xCol: columns[0] })}
        />
      </Tab>
    </Tabs>
  );
};

const YAxisContent = ({ seriesData, setSeriesData }) => (
  <div>
    <FromColumns setColumns={ys => setSeriesData({ ys })} />
  </div>
);

const LoadTraces = ({ setXType, seriesData, setSeriesData }) => (
  <div>
    <Tabs defaultActiveKey={0} id="load-traces-tabs">
      <Tab eventKey={0} title="X Axis">
        <XAxisContent
          setXType={setXType}
          seriesData={seriesData}
          setSeriesData={setSeriesData}
        />
      </Tab>
      <Tab eventKey={1} title="Y Axis">
        <YAxisContent seriesData={seriesData} setSeriesData={setSeriesData} />
      </Tab>
    </Tabs>
  </div>
);

export default LoadTraces;
