import React, { Component } from "react";
import { FormControl } from "react-bootstrap";

class TextField extends Component {
  constructor(props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
  }
  handleUpdate(event) {
    this.props.onChange(event.target.value);
  }
  render() {
    return (
      <div className="TextField">
        <FormControl
          type="text"
          value={this.props.inputVal}
          placeholder="Enter Value"
          onChange={this.handleUpdate}
        />
      </div>
    );
  }
}

export default TextField;
