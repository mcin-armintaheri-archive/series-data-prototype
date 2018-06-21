import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

class MetaDatePicker extends Component{
    render(){
        return (
           <DatePicker
                selected={this.state.selectDate}
                onChange={this.handleChange}
            />
          );
    }
    constructor(props){
        super(props);
        this.state={selectDate: moment() };
        this.handleChange=this.handleChange.bind(this);
    }
    handleChange(date){
        this.setState({selectDate:date})
    }
   
}
export default MetaDatePicker;