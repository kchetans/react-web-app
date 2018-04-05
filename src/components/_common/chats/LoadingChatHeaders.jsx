import React, {Component} from "react";
import {RaisedButton} from "material-ui";
import {Link} from "react-router-dom";
import LoaderCard from "../../_common/LoaderCard";

export default class LoadingChatHeaders extends Component {
  render() {
    return (
      <div className="p-16">
        <h4>Loadin Active Chats</h4>
        <div className="mt-5 text-center">
          <LoaderCard />
          <br />
          <Link to='/people'>
            <RaisedButton primary label="Search People & Chat" className="mt-5"/>
          </Link>
          <Link to='/postjob'>
            <RaisedButton secondary label="Post a Job" className="mt-5"/>
          </Link>
          <div className="mt-3">
            You can also post a job and interested people will contact you.
          </div>
        </div>
      </div>
    );
  }
}
