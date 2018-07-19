import React, {Component} from "react";
import {Button, Row, Col} from "react-bootstrap";
import * as R from "ramda";

export default class BatchImport extends Component {
  render(){
    const {heading, batches, setBatches} = this.props;
    const addBatch=()=> R.append({files: []}, batches);
    
    
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
                <input type='file' accept=".csv" multiple/>
              </Col>
            </Row> <br/>
              <ul>
                {batch.files.map((file) =>
                  <li>{file}</li>
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
            {files: ['hello.csv', 'another.csv']}
          ]
        }
      };
  
  render(){
    const setBatches= batches => this.setState({batches});
    return <BatchImport heading= {this.state.heading} batches= {this.state.batches} setBatches={setBatches}/>
  }
}