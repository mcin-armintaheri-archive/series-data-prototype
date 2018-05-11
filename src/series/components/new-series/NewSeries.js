import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import LoadTraces from "./LoadTraces";
import LoadEpochs from "./LoadEpochs";

const NewSeries = ({ setXType, seriesData, setSeriesData }) => (
  <div>
    <Tabs defaultActiveKey={0} id="new-series-tabs">
      <Tab eventKey={0} title="Traces">
        <LoadTraces
          setXType={setXType}
          seriesData={seriesData}
          setSeriesData={setSeriesData}
        />
      </Tab>
      <Tab eventKey={1} title="Epochs">
        <LoadEpochs seriesData={seriesData} setSeriesData={setSeriesData} />
      </Tab>
    </Tabs>
  </div>
);

export default NewSeries;
