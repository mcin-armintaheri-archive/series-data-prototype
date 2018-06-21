import React, {Component} from 'react';
import TextField from './TextField';
import Dropdown from './Dropdown';
import INPUT_TYPES from './Dropdown';
import { ControlLabel, Form, FormGroup, FormControl, Grid, Row, Col} from 'react-bootstrap';

class MetadataSchemaConfigForm extends Component{
    render(){
        return(
            <div>
                <Grid>
                    <Row>
                        <Col xs={3} md={2}>
                            <ControlLabel>Label Name: </ControlLabel>
                        </Col>
                        <Col xs={4} md={2}>
                            <TextField existingVal={this.props.labelName}/>
                        </Col>
                    </Row> 
                 
                    <br/>
                    <ControlLabel>Description: </ControlLabel>                                  
                    <TextField existingVal={this.props.description}/>
                    <br/>
                    <ControlLabel>Input Type: </ControlLabel> 
                    <Dropdown dropItems={this.props.inputTypes} defaultItem={this.props.type}/>
                </Grid>
            </div>

        );
    }
}
export default MetadataSchemaConfigForm;