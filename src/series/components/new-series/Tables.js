import * as R from "ramda";
import React, { Component } from "react";
import { csv } from "d3-fetch";
import { Tabs, Tab } from "react-bootstrap";
import { Table, Column, Cell } from "fixed-data-table-2";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faPlus from "@fortawesome/fontawesome-free-solid/faPlus";
import Clickable from "../Clickable";
import "fixed-data-table-2/dist/fixed-data-table.min.css";

const Page = ({ selected, pageIndex, page, onColumnSelect }) => {
  if (page.length === 0) {
    return null;
  }
  const header = R.keys(page[0]);
  const renderHeader = key => ({ ...props }) => (
    <div
      style={{
        cursor: "pointer",
        borderStyle: "solid",
        borderWidth: !!selected.find(s => s.key === key) ? "3px" : "0px"
      }}
      onClick={() => onColumnSelect(pageIndex, key)}
    >
      <Cell
        onClick={() => {
          onColumnSelect(pageIndex, header[key]);
        }}
        {...props}
      >
        {key}
      </Cell>
    </div>
  );
  const renderCell = ({ rowIndex, columnKey, ...props }) => (
    <Cell {...props}>{page[rowIndex][columnKey]}</Cell>
  );
  return (
    <Table
      rowHeight={50}
      rowsCount={page.length}
      width={400}
      height={400}
      headerHeight={50}
    >
      {header.map((key, i) => (
        <Column
          key={`${i}-${header.length}`}
          columnKey={key}
          header={renderHeader(key)}
          cell={renderCell}
          width={100}
        />
      ))}
    </Table>
  );
};

class Tables extends Component {
  constructor(props) {
    super(props);
    this.state = { pages: [], selected: [] };
    this.loadFromCSV = this.loadFromCSV.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }
  loadFromCSV() {
    const { pages } = this.state;
    const input = document.createElement("input");
    input.type = "file";
    input.addEventListener("change", event => {
      const file = event.target.files[0];
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
        const page = [];
        const loadRow = data => {
          page.push(data);
        };
        csv(url, loadRow).then(() => {
          return this.setState({ pages: pages.concat([page]) });
        });
      });
    });
    input.click();
  }
  handleSelect(pageIndex, key) {
    console.log(pageIndex, key);
    const { selected, pages } = this.state;
    const { onColumnSelect } = this.props;
    const finder = s => s.pageIndex === pageIndex && s.key === key;
    const rejectSelected = R.reject(finder);
    const mergeSelected = R.append({ pageIndex, key });
    const found = selected.find(finder);
    const newSelected = !!found
      ? rejectSelected(selected)
      : R.pipe(rejectSelected, mergeSelected)(selected);
    const columns = newSelected.map(s =>
      pages[s.pageIndex].map(row => row[s.key])
    );
    onColumnSelect(columns);
    this.setState({ selected: newSelected });
  }
  render() {
    const { selected, pages } = this.state;
    return (
      <div>
        <div style={{ display: "inline-block", margin: "auto" }}>
          <Clickable onClick={this.loadFromCSV}>
            <FontAwesomeIcon icon={faPlus} />
          </Clickable>
        </div>
        <Tabs defaultActiveKey={0} id="page-tabs">
          {pages.map((page, i) => (
            <Tab key={`${i}-${pages.length}`} eventKey={i} title={`Page ${i}`}>
              <Page
                selected={selected.filter(s => s.pageIndex === i)}
                pageIndex={i}
                page={page}
                onColumnSelect={this.handleSelect}
              />
            </Tab>
          ))}
        </Tabs>
      </div>
    );
  }
}

export default Tables;
