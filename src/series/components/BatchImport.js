import React, {Component} from "react";
import {Button, Row, Col} from "react-bootstrap";
import * as R from "ramda";

export default class BatchImport extends Component {
  
  render(){
    const {heading, batches, setBatches} = this.props;
    const addBatch=()=> R.append({files: []}, batches);
    const addFileToBatch=(index, file) =>{
      const { batches, setBatches } = this.props;
      const innerArrayLens = R.lensPath([index, "files"]);
      setBatches( R.over(innerArrayLens, R.unless(R.isNil, R.append(file)), batches ));
    };
    const askForFile=(index) =>{
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".csv";
      input.multiple = true;
      input.click();
      input.addEventListener("change", function(event) {
          for(var i=0; i<event.target.files.length; i++){
            addFileToBatch(index, event.target.files[i]);
          }
          
        }
      );
    };
    
    return(
      <div>    
        <h4> {heading} </h4>
        <Row> <Button bsSize="small" onClick= {()=>setBatches(addBatch())}>+ Add Batch</Button> </Row><br/>
        {batches.map((batch, index) =>
          <div>
            <Row>
              <Col xs={3}>
                <label>Batch {index+1} :</label>
              </Col>
              <Col>
                <Button bsSize="small" onClick= {()=>askForFile(index)}>Upload Table</Button>
              </Col>
            </Row> <br/>
              <ul>
                {batch.files.map((file) =>
                  <li>{file.name}</li>
                )}
              </ul>
          </div>
        )} 
      </div>
    )
  };
  
}

export class BatchImportTest extends Component{
  constructor(props){
    super(props);
    this.state= {
      heading: "Series Metadata",
      batches:[
      ]
    };
  };
  
  render(){
    const setBatches= batches => this.setState({batches});
    return <BatchImport heading= {this.state.heading} batches= {this.state.batches} setBatches={setBatches} />
  }
}