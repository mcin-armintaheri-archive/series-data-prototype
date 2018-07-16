import React, { Component } from "react";
import TextField from "./TextField";
import Dropdown from "./Dropdown";
import MetaDatePicker from "./MetaDatePicker";
import {
  ControlLabel,
  Grid,
  Row,
  Col,
  Button,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";

class MetadataEditForm extends Component {
  constructor(props) {
    super(props);
    this.getElement = this.getElement.bind(this);
    this.getDescription = this.getDescription.bind(this);
  }
  render() {
    return (
      <div>
        <Grid>
          {this.props.dataComponents.map((dataComp, i) => (
            <div key={`${i}-${this.props.dataComponents.length}`}>
              <Row>
                <Col xs={4} md={3}>
                  <ControlLabel>{dataComp.labelName}</ControlLabel>
                </Col>
                <OverlayTrigger
                  placement="right"
                  overlay={this.getDescription(dataComp.description)}
                >
                  <Button bsStyle="default" bsSize="xsmall">
                    ?
                  </Button>
                </OverlayTrigger>
              </Row>
              <Row>
                <Col xs={4} md={3}>
                  {this.getElement(dataComp)}
                </Col>
              </Row>
              <br />
            </div>
          ))}
        </Grid>
      </div>
    );
  }
  getElement(dataComp) {
    const { metaDataValue, setMetadataValue } = this.props;
    switch (dataComp.inputType) {
      case "TextField":
        return <TextField inputVal={metaDataValue} onChange={setMetadataValue}/>;
      case "DatePicker":
        return <MetaDatePicker selected={metaDataValue} onChange={setMetadataValue} />;
      case "Dropdown":
        // need options for dropdown
        return (
          <Dropdown
            title={metaDataValue}
            dropItems={dataComp.options || []}
            onSelect={setMetadataValue}
          />
        );
      default:
        return <div>This metadata field has no input type.</div>;
    }
  }
  getDescription(description) {
    return <Tooltip id="tooltip">{description}</Tooltip>;
  }
}
export default MetadataEditForm;
