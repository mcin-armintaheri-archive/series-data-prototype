import * as R from "ramda";
import React from "react";
import { Nav, NavItem, Row, Col, Tab } from "react-bootstrap";
import { Table, Column, Cell } from "fixed-data-table-2";
import "fixed-data-table-2/dist/fixed-data-table.min.css";

const Page = ({ selectedColumns, pageIndex, page, onColumnSelect }) => {
  if (page.length === 0) {
    return null;
  }
  const header = R.keys(page[0]);
  const renderHeader = key => ({ ...props }) => (
    <div
      style={{
        cursor: "pointer",
        borderStyle: "solid",
        borderWidth: !!selectedColumns.find(s => s.column === key)
          ? "3px"
          : "0px"
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

const Tables = ({ selectedColumns = [], tables = [], onSelect }) => {
  const handleSelectColumn = (pageIndex, column) =>
    onSelect && onSelect({ pageIndex, column });
  const selectedCols = selectedColumns.filter(
    R.allPass([R.complement(R.isNil), R.has("pageIndex"), R.has("column")])
  );
  return (
    <div>
      {tables.length === 0 ? (
        <h4>There are no tables to display</h4>
      ) : (
        <Tab.Container defaultActiveKey={0} id="page-tabs">
          <Row>
            <Col xs={12}>
              <div style={{ width: "100%", overflowX: "auto" }}>
                <div
                  style={{
                    width: R.sum(tables.map(t => t.name.length)) * 12
                  }}
                >
                  <Nav bsStyle="tabs">
                    {tables.map((table, i) => {
                      const selectedPage = selectedCols.find(
                        s => s.pageIndex === i
                      );
                      return (
                        <NavItem key={`${i}-${tables.length}`} eventKey={i}>
                          {selectedPage ? (
                            <strong>table.name</strong>
                          ) : (
                            table.name
                          )}
                        </NavItem>
                      );
                    })}
                  </Nav>
                </div>
              </div>
            </Col>
            <Col xs={12}>
              <Tab.Content animation={false}>
                {tables.map((table, i) => {
                  const selectedPage = selectedCols.find(
                    s => s.pageIndex === i
                  );
                  return (
                    <Tab.Pane key={`${i}-${tables.length}`} eventKey={i}>
                      <Page
                        selectedColumns={selectedPage ? selectedCols : []}
                        pageIndex={i}
                        page={table.rows}
                        onColumnSelect={handleSelectColumn}
                      />
                    </Tab.Pane>
                  );
                })}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      )}
    </div>
  );
};

export default Tables;
