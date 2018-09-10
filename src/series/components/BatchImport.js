import React, { Component } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { csv } from "d3-fetch";
import * as R from "ramda";

export default class BatchImport extends Component {
  render() {
    const { heading, batches, setBatches } = this.props;
    const addTableToBatch = (index, table) => {
      const { batches, setBatches } = this.props;
      const innerArrayLens = R.lensIndex(index);
      setBatches(
        R.over(innerArrayLens, R.unless(R.isNil, R.append(table)), batches)
      );
    };
    const askForFile = index => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".csv";
      input.multiple = true;
      input.click();
      input.addEventListener("change", function(event) {
        const { files } = event.target;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.addEventListener("load", readEvent => {
            if (readEvent.target.readyState !== 2) {
              return;
            }
            if (readEvent.target.error) {
              alert("Error reading file.");
            }
            const url = readEvent.target.result;
            const table = { name: file.name, rows: [] };
            const loadRow = row => {
              table.rows.push(row);
            };
            csv(url, loadRow).then(() => addTableToBatch(index, table));
          });
        }
      });
    };
    console.log(batches);
    return (
      <div>
        <h4> {heading} </h4>
        <Row>
          {" "}
          <Col xs={12}>
            <Button
              bsSize="small"
              onClick={() => setBatches(R.append([], batches))}
            >
              + Add Batch
            </Button>{" "}
          </Col>
        </Row>
        <br />
        {batches.map((batch, index) => (
          <div key={`${index}-${batches.length}`}>
            <Row>
              <Col xs={9}>
                <label>Batch {index + 1} :</label>
              </Col>
              <Col xs={3}>
                <Button bsSize="small" onClick={() => askForFile(index)}>
                  Upload Table
                </Button>
              </Col>
            </Row>{" "}
            <br />
            <ul>
              {batch.map((table, index) => (
                <li key={`${index}-${batch.length}`}>{table.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }
}

export class BatchImportTest extends Component {
  constructor(props) {
    super(props);
    this.state = { batches: [] };
  }

  render() {
    const setBatches = batches => this.setState({ batches });
    return (
      <BatchImport
        heading="Series Raw Data"
        batches={this.state.batches}
        setBatches={setBatches}
        multiple
      />
    );
  }
}
