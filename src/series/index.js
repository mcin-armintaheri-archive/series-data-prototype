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

const cycleMiddleware = createCycleMiddleware();
const { makeStateDriver, makeActionDriver } = cycleMiddleware;

const logger = createLogger();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.store = createStore(reducer, applyMiddleware(cycleMiddleware, logger));
    this.store.dispatch(setDomain(props.initialDomain));
    props.initialSeriesCollection.forEach(series => {
      this.store.dispatch(createSeries(series));
    });
    run(cycle, { ACTION: makeActionDriver(), STATE: makeStateDriver() });
  }
  render() {
    const ConnectedEEG = connectSeriesStore(EEG);
    const { x, y } = this.props;
    return (
      <Provider store={this.store}>
        <ConnectedEEG x={x} y={y} />
      </Provider>
    );
  }
}
