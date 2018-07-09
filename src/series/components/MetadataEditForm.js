import React, {Component} from 'react';
import TextField from './TextField';
import Dropdown from './Dropdown';
import MetaDatePicker from './MetaDatePicker'
import { ControlLabel, Grid, Row, Col, Button, OverlayTrigger, Tooltip} from 'react-bootstrap';

class MetadataEditForm extends Component{
    constructor(props){
        super(props);
        this.getElement=this.getElement.bind(this);
        this.getDescription=this.getDescription.bind(this);
    }
    render(){
        return(
            <div>
                <Grid>
                    
                    {this.props.dataComponents.map(dataComp=> 
                        <div>
                            <Row> 
                                <Col xs={4} md={3}>
                                    <ControlLabel>{dataComp.name} </ControlLabel> 
                                </Col>
                                <OverlayTrigger placement="right" overlay={this.getDescription(dataComp.description)}>
                                  <Button bsStyle="default" bsSize="xsmall">?</Button>
                                </OverlayTrigger>
                            </Row>
                            <Row>
                                <Col xs={4} md={3}>
                                    {this.getElement(dataComp)
                                        
                                    }
                                </Col>
                            </Row>
                            <br/>
                        </div>
                    )}
                    
                </Grid>
            </div>
        );
    }
    getElement(dataComp){
        switch(dataComp.type){
            case 'TextField':
                return <TextField existingVal={ dataComp.existingVal}/>
            case 'MetaDatePicker':
                return <MetaDatePicker/>
            case 'Dropdown':
                return <Dropdown dropItems= {dataComp.dropItems} defaultItem= {dataComp.defaultItem}/>
            default: 
                return <br/>

        }
    }
    getDescription(description){
        return <Tooltip id="tooltip">{description}</Tooltip>
    }
   
}
export default MetadataEditForm;