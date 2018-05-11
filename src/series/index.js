import React, { Component } from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";
import { createCycleMiddleware } from "redux-cycles";
import { run } from "@cycle/most-run";
import { reducer, cycle } from "./state";
import { setDomain } from "./state/parameters/domain";
import { createSeries } from "./state/models/series";
import { connectSeriesStore } from "./state";
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
        reader.onLoad = readEvent => {
          if (readEvent.target.readyState !== 2) {
            return;
          }
          if (readEvent.target.error) {
            alert("Error reading file.");
          }
          const parsed = JSON.parse(event.target.result);
          if (!(parsed instanceof Array)) {
            alert("Your file is not formatted properly.");
          }
          parsed.forEach(series => {
            this.store.dispatch(createSeries(series));
          });
        };
      });
    };
    const cycleMiddleware = createCycleMiddleware();
    const { makeStateDriver, makeActionDriver } = cycleMiddleware;
    const logger = createLogger();
    this.store = createStore(reducer, applyMiddleware(cycleMiddleware, logger));
    this.store.dispatch(setDomain(props.initialDomain));
    props.initialSeriesCollection.forEach(series => {
      this.store.dispatch(createSeries(series));
    });
    run(cycle, { ACTION: makeActionDriver(), STATE: makeStateDriver() });
  }
  render() {
    const ConnectedEEG = connectSeriesStore(EEG);
    const { x, y, onSave, onLoad } = this.props;
    return (
      <Provider store={this.store}>
        <ConnectedEEG
          x={x}
          y={y}
          onSave={onSave || this.onSave}
          onLoad={onLoad || this.onLoad}
        />
      </Provider>
    );
  }
}
