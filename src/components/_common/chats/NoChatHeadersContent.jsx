import React, {Component} from 'react';
import {FlatButton, RaisedButton} from "material-ui";
import {Link} from "react-router-dom";

export default class NoChatHeadersContent extends Component{
  render(){
    return (
      <div className="p-16">
        <h4>No Active Chats</h4>
        <div className="mt-5 text-center">
          <img src="https://st.depositphotos.com/1431107/2316/v/950/depositphotos_23163822-stock-illustration-oops-vector-smiley.jpg" height="300"/>
          <br />
          <Link to='/people'>
            <RaisedButton primary label="Search People & Chat" className="mt-5"/>
          </Link>
          <div className="mt-3">
            Seems like you don't have any Chats. You can search people and try to contact them.
          </div>
          <Link to='/postjob' >
            <RaisedButton secondary label="Post a Job" className="mt-5" />
          </Link>
          <div className="mt-3">
            You can also post a job and interested people will contact you.
          </div>
        </div>
      </div>
    );
  }
}
