import React, { Component } from "react";
import {} from "react-bootstrap";

class EditableText extends Component {
  constructor(props) {
    super(props);
    this.state = { editing: false };
  }
  render() {
    const { value, onSubmit } = this.props;
    const { editing } = this.state;
    return <div>{value}</div>;
  }
}

export default EditableText;
