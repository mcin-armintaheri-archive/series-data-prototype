import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import FromColumns from "./FromColumns";

const TagsContent = ({ seriesData, setSeriesData }) => (
  <div>
    <FromColumns setColumns={columns => setSeriesData({ tags: columns[0] })} />
  </div>
);

const DomainsContent = ({ seriesData, setSeriesData }) => (
  <div>
    <FromColumns
      setColumns={columns =>
        setSeriesData({ domains: [columns[0], columns[1]] })
      }
    />
  </div>
);

const LoadEpochs = ({ seriesData, setSeriesData }) => (
  <div>
    <Tabs defaultActiveKey={0} id="load-epochs-tabs">
      <Tab eventKey={0} title="Intervals">
        <TagsContent seriesData={seriesData} setSeriesData={setSeriesData} />
      </Tab>
      <Tab eventKey={1} title="Tags">
        <DomainsContent seriesData={seriesData} setSeriesData={setSeriesData} />
      </Tab>
    </Tabs>
  </div>
);

export default LoadEpochs;
