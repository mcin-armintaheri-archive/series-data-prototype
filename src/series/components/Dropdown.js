import React, { Component } from "react";
import { DropdownButton, MenuItem } from "react-bootstrap";

class Dropdown extends Component {
  render() {
    return (
      <div>
        <DropdownButton
          title={this.props.selectedItem}
          id={`dropdown-basic`}
          onSelect={this.props.onSelect}
        >
          {(this.props.dropItems || []).map((dropItem, i) => (
            <MenuItem key={i} eventKey={dropItem}>
              {dropItem}
            </MenuItem>
          ))}
        </DropdownButton>
      </div>
    );
  }
}
export default Dropdown;
