import React, { Component } from "react";
import * as R from "ramda";
import { Button, Row, Col, NavItem, Nav } from "react-bootstrap";

export default class RawDataColumnKeyList extends Component {
  render() {
    const {traceColumns, setTraces, epochColumns, setEpochs } = this.props;
    const addTrace = col => R.append(col, traceColumns );
    const updateTrace = (index, newTraceVal) => R.update(index, newTraceVal, traceColumns);
    const updateEpoch = (i, newEpochVal) => R.update(i, newEpochVal, epochColumns);
    var selectedItem='';
    const editTrace = (selected) => {
      selectedItem= selected;
      var newTraceVal= "hello"; //set new column here 
      setTraces(updateTrace(selected, newTraceVal));
    };
    const editEpoch = (selected) =>{
      selectedItem= selected;
      var newEpochVal="hello!"; //set new column here
      var index;
      if (selected ==="start")
        index=0;
      else
        index=1;
      setEpochs(updateEpoch(index, newEpochVal));
    };
    return (
      <div>
        <h4 style= {{fontWeight: "bold"}}> Series Raw Data Columns </h4>
        <body> Note: there is one table per series and one column per trace </body> <br/>

        <div>
          <label> X-axis </label> <br/>
        </div>

        <div>
          <Row>
            <Col xs={3} md={3}>
              <label> Trace Columns </label> 
            </Col>
            <Col>
              <Button bsStyle="default" bsSize="xsmall" onClick={()=> setTraces(addTrace(' '))}>+</Button>
            </Col>
          </Row>
          <Nav bsStyle="pills" stacked activeKey={selectedItem}>
            {traceColumns.map( (columnName, index) => <NavItem onSelect={editTrace} eventKey={index}> Trace Column {index} : {columnName} </NavItem>)}
          </Nav>
        </div>

        <div>
          <label> Epoch Columns </label>
          <Nav bsStyle="pills" stacked activeKey={selectedItem}>
            <NavItem eventKey= "start" onSelect= {editEpoch}> Epoch Start Column: {epochColumns[0]}</NavItem>
            <NavItem eventKey= "end" onSelect= {editEpoch}> Epoch End Column: {epochColumns[1]} </NavItem>
          </Nav>
          <br/>
        </div>
      </div>
    
    )
  }
}
export class RawDataColumnKeyListTest extends Component {
  constructor(props) {
    super(props);
    this.state = {traceColumns: ['data_1', 'data_2'], epochColumns: ['start_time', 'end_time']};
  }
  render() {
    const setTraces = traceColumns=> this.setState({traceColumns}); //updates trace colum list 
    const setEpochs= epochColumns=> this.setState({epochColumns});
    return <RawDataColumnKeyList traceColumns= {this.state.traceColumns} setTraces= {setTraces} epochColumns= {this.state.epochColumns} setEpochs= {setEpochs}/>
  }  
}