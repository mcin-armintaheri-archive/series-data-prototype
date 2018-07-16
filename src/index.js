import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Row, Col, Grid, ListGroup, ListGroupItem } from "react-bootstrap";
import SchemaConfig from "./series/components/SchemaConfig.js";
import MetadataEntry from "./series/components/MetadataEntry.js";
import Omics from "./series/components/Omics";
import extent from "./series/util/extent";
import { makeSeriesCollection } from "./series/mockdata";
import SeriesApp from "./series";
import "rc-slider/assets/index.css";
import "./css/bootstrap.min.css";

import { createStore } from "redux";
import { Provider } from "react-redux";
import { connectSeriesStore, reducer } from "./series/state";
import SchemaView from "./series/components/SchemaView";

export { makeSeriesCollection } from "./series/mockdata";

export const seriesCollectionExtent = seriesCollection =>
  extent(seriesCollection, d => d.x);

class Working extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subjectSchema: {},
      seriesSchema: {},
      subjectMetadata: {},
      seriesMetadata: {}
    };
    this.setSubjectSchema = this.setSubjectSchema.bind(this);
    this.setSeriesSchema = this.setSeriesSchema.bind(this);
  }
  setSubjectSchema(subjectSchema) {
    this.setState({ subjectSchema });
  }
  setSeriesSchema(seriesSchema) {
    this.setState({ seriesSchema });
  }
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <SchemaConfig
              subjectSchema={this.state.subjectSchema}
              seriesSchema={this.state.seriesSchema}
              saveSubjectSchema={this.setSubjectSchema}
              saveSeriesSchema={this.setSeriesSchema}
            />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs={12}>
            <MetadataEntry
              title="Subject Metadata Entry"
              schema={this.state.subjectSchema}
              metadata={this.state.subjectMetadata}
              saveMetadata={this.setSubjectMetadata}
            />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs={12}>
            <MetadataEntry
              title="Series Metadata Entry"
              schema={this.state.seriesSchema}
              metadata={this.state.seriesMetadata}
              saveMetadata={this.setSeriesMetadata}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

const Main = ({
  domain,
  seriesCollection = [],
  subjectSchema,
  seriesSchema,
  x = d => d.x,
  y = d => d.y
}) => {
  const EEGRoute = () => (
    <SeriesApp
      initialDomain={domain}
      initialSeriesCollection={seriesCollection}
      initialSubjectSchema={subjectSchema}
      initialSeriesSchema={seriesSchema}
      x={x}
      y={y}
    />
  );
  const OmicsRoute = () => {
    const slicedSeries = seriesCollection.map(series => {
      const traces = series.traces.map(trace => trace.slice(10, 50));
      return { ...series, traces };
    });
    const slicedExtent = seriesCollectionExtent(slicedSeries);
    return (
      <SeriesApp
        component={Omics}
        initialDomain={slicedExtent}
        initialSeriesCollection={slicedSeries}
        initialSubjectSchema={subjectSchema}
        initialSeriesSchema={seriesSchema}
        x={x}
        y={y}
      />
    );
  };
  // const BiosensorsRoute = () => null;
  const Menu = () => (
    <Grid bsClass="container" style={{ marginTop: "10%" }}>
      <ListGroup>
        <ListGroupItem href="/eeg">
          <h3>EEG</h3>
        </ListGroupItem>
        <ListGroupItem href="/omics">
          <h3>Omics</h3>
        </ListGroupItem>
        <ListGroupItem href="/biosensors">
          <h3>Biosensors</h3>
        </ListGroupItem>
      </ListGroup>
    </Grid>
  );
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={EEGRoute} />
        <Route exact path="/working" component={Working} />
      </Switch>
    </BrowserRouter>
  );
};

export const mountSeriesApp = (
  root,
  {
    domain,
    seriesCollection,
    x = d => d.x,
    y = d => d.y,
    subjectSchema = {},
    seriesSchema = {}
  }
) =>
  render(
    <Main
      domain={domain}
      seriesCollection={seriesCollection}
      x={x}
      y={y}
      subjectSchema={subjectSchema}
      seriesSchema={seriesSchema}
    />,
    root
  );

window.mountSeriesApp = mountSeriesApp;
window.makeSeriesCollection = makeSeriesCollection;
window.seriesCollectionExtent = seriesCollectionExtent;

// <script>
var mockData = window.makeSeriesCollection();
var domain = window.seriesCollectionExtent(mockData);
var subjectSchema = {
  recording_information: {
    nested: true,
    schema: {
      participant_id: {
        schema: {
          labelName: "Participant ID",
          inputType: "TextField"
        }
      },
      instituition: {
        schema: {
          labelName: "Institution",
          inputType: "TextField"
        }
      },
      date: {
        schema: {
          labelName: "Date",
          inputType: "DatePicker"
        }
      },
      time_description: {
        schema: {
          labelName: "Time Description",
          inputType: "Dropdown",
          options: ["Eastern Time (US & Canada)", "Central Time (US & Canada)"]
        }
      },
      visit_num: {
        schema: {
          labelName: "Visit Number",
          inputType: "TextField"
        }
      }
    }
  },
  device_information: {
    nested: true,
    schema: {
      name: {
        schema: {
          labelName: "Device Name",
          inputType: "TextField"
        }
      },
      type: {
        schema: {
          labelName: "Type",
          inputType: "TextField"
        }
      },
      company: {
        schema: {
          labelName: "Company",
          inputType: "TextField"
        }
      },
      SIN: {
        schema: {
          labelName: "Social Insurance Number",
          inputType: "TextField"
        }
      }
    }
  }
};
var seriesSchema = {
  name: {
    schema: {
      labelName: "Signal Name",
      inputType: "TextField"
    }
  },
  sensor: {
    schema: {
      labelName: "Sensor",
      inputType: "TextField"
    }
  },
  sensor_location_on_body: {
    schema: {
      labelName: "Sensor Location On Body",
      inputType: "TextField"
    }
  }
};
window.mountSeriesApp(document.getElementById("root"), {
  domain: domain,
  seriesCollection: mockData,
  subjectSchema,
  seriesSchema
});
// </script>
