import React, { Component } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class MetaDatePicker extends Component {
  render() {
    return (
      <DatePicker
        selected={this.props.selectDate}
        onChange={this.props.onChange}
        showTimeSelect
        dateFormat="LLL"
      />
    );
  }
}
export default MetaDatePicker;
