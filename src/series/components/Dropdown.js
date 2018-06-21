import React, {Component} from 'react';
import { DropdownButton, MenuItem} from 'react-bootstrap';

class Dropdown extends Component{
    render(){
        return (
            <div>
            <DropdownButton
              title={this.state.selectedItem}
              id={`dropdown-basic`}
              onSelect={this.handleChange}
            >
            {this.props.dropItems.map((dropItem, i)=> 
                <MenuItem eventKey={dropItem}> {dropItem} </MenuItem>
            )}
            </DropdownButton>
            </div>
          );
    }
    constructor(props){
        super(props);
        this.state={selectedItem: props.defaultItem};
        this.handleChange=this.handleChange.bind(this);

    }
    handleChange (val){
        this.setState({selectedItem: val});
    }
   
}
export default Dropdown;