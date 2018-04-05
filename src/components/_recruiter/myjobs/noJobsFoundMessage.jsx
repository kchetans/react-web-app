import React, {Component} from 'react';
import {Paper, RaisedButton} from "material-ui";
import {Link} from "react-router-dom";

export default class NoJobsFoundMessage extends Component{

  render(){
    return (
      <Paper className="p-16 flex flex-column space-around">
        <div className="text-center">
          <img src="https://st.depositphotos.com/1431107/2316/v/950/depositphotos_23163822-stock-illustration-oops-vector-smiley.jpg" height="300"/>
        </div>
        <Link to="/postjob">
          <RaisedButton primary label="Post a Job Now"/>
        </Link>
      </Paper>
    );
  }

}
