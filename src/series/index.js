import React, { Component } from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";
import { createCycleMiddleware } from "redux-cycles";
import { run } from "@cycle/most-run";
import { reducer, cycle } from "./state";
import { setDomain } from "./state/parameters/domain";
import { setMetadataSchema } from "./state/parameters/metadata-schema";
import { createSeries } from "./state/models/series";
import { connectSeriesStore } from "./state";
import seriesCollectionExtent from "./util/extent.js";
import EEG from "./components/EEG";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.onSave = series => {
      const fileName = prompt("Please enter a file name.", "output.json");
      const json = JSON.stringify(series, null, 2);
      const blob = new Blob([json], { type: "text/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    };
    this.onLoad = () => {
      const input = document.createElement("input");
      input.type = "file";
      input.addEventListener("change", event => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.addEventListener("load", readEvent => {
          if (readEvent.target.readyState !== 2) {
            return;
          }
          if (readEvent.target.error) {
            alert("Error reading file.");
          }
          const parsed = JSON.parse(readEvent.target.result);
          if (!(parsed instanceof Array)) {
            alert("Your file is not formatted properly.");
          }
          var domain = seriesCollectionExtent(parsed);
          this.store.dispatch(setDomain(domain));
          parsed.forEach(series => {
            this.store.dispatch(createSeries(series));
          });
        });
      });
      input.click();
    };
    const cycleMiddleware = createCycleMiddleware();
    const { makeStateDriver, makeActionDriver } = cycleMiddleware;
    const logger = createLogger();
    this.store = createStore(reducer, applyMiddleware(cycleMiddleware, logger));
    this.store.dispatch(setDomain(props.initialDomain));
    const { initialSubjectSchema, initialSeriesSchema } = props;
    props.initialSeriesCollection.forEach(series => {
      this.store.dispatch(createSeries(series));
      this.store.dispatch(
        setMetadataSchema({
          subjectSchema: initialSubjectSchema || {},
          seriesSchema: initialSeriesSchema || {}
        })
      );
    });
    run(cycle, { ACTION: makeActionDriver(), STATE: makeStateDriver() });
  }
  render() {
    const { x, y, onSave, onLoad, component } = this.props;
    const Connected = connectSeriesStore(component || EEG);
    return (
      <Provider store={this.store}>
        <Connected
          x={x}
          y={y}
          onSave={onSave || this.onSave}
          onLoad={onLoad || this.onLoad}
        />
      </Provider>
    );
  }
}
