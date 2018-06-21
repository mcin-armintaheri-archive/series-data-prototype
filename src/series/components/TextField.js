import React, {Component} from 'react';
import { FormControl} from 'react-bootstrap';

class TextField extends Component{
    render(){
        return (
            <div className= "TextField">  
                   
                <FormControl
                    type="text"
                    value={this.state.inpuVal}
                    placeholder="Enter Value"
                    onChange={this.handleUpdate}
                />
       
            </div>
        );
    }
    constructor(props){
        super(props);
        this.state= {inputVal: ''};
        this.handleUpdate=this.handleUpdate.bind(this);
    }

    handleUpdate(event){
        this.setState({inputVal: event.target.value});
    }
}
export default TextField;