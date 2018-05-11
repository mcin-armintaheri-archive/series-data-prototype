import * as R from "ramda";
import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import EditableText from "../EditableText";
import NewSeries from "./NewSeries.js";

class NewSeriesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      xType: "range",
      seriesData: {
        name: "new series",
        domains: [],
        tags: [],
        xCol: [],
        xRange: { start: 0, end: 1, rate: 100 },
        ys: []
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  setShow(show) {
    if (!show) {
      this.setState({ series: null });
    }
    this.setState({ show });
  }
  handleSubmit() {
    const { xType } = this.state;
    const { name, tags, domains, xRange, xCol, ys } = this.state.seriesData;
    let x = [];
    if (xType === "range") {
      const { start, end, rate } = xRange;
      const samples = Math.abs((end - start) * rate);
      x = R.map(x => x / rate + start, R.range(0, samples));
    } else {
      x = xCol || [];
    }
    const makeTrace = (x, y) => ({ x, y });
    const makeEpoch = (tag, domain) => ({ tag, domain });
    const traces = ys.map(y => R.zipWith(makeTrace, x, y));
    const epochs = R.zipWith(makeEpoch, tags, domains);
    this.props.createSeries({ name, traces, epochs });
    this.setState({ show: false });
  }
  render() {
    const { show, seriesData } = this.state;
    const setSeriesData = settingData =>
      this.setState({ seriesData: R.merge(seriesData, settingData) });

    return (
      <div style={{ margin: "10px 10px" }}>
        <Button onClick={() => this.setShow(true)}>New Series</Button>
        <Modal show={show} onHide={() => this.setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              <div style={{ maxWidth: "250px" }}>
                <EditableText
                  value={seriesData.name}
                  onSubmit={name => setSeriesData({ name })}
                />
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <NewSeries
              setXType={xType => this.setState({ xType })}
              seriesData={seriesData}
              setSeriesData={setSeriesData}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleSubmit} bsStyle="primary">
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default NewSeriesModal;
