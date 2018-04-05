import React, {Component} from "react";
import {Paper, RaisedButton} from "material-ui";
import update from "immutability-helper";
import ApiBuilder from "../../apiBuilder";
import FacebookShare from "../../social-sharing/FacebookShare";
import LinkedInShare from "../../social-sharing/LinkedInShare";
import {getBaseWebUrl} from "../../../lib/navigation-utils";

export default class MyJobHeaderDisplay extends Component {

  componentWillMount() {
    this.setState({info: this.props.info});
  }


  closeJob = (job_id) => {
    ApiBuilder.fetch(ApiBuilder.getApi(`/workexnow/v1/jobs/${job_id}/remove`), {
      method: 'PUT'
    })
      .then(res => {
        this.setState({info: update(this.state.info, {is_active: {$set: false}})});
      })
      .catch(err => {

      });
  };

  render() {
    let info = this.state.info;
    let _link = '/jobats?job_id=' + info.job_id;
    let {is_active, compensation, city, description, cover_pic_url, type_text, job_id , slug} = info;
    let shareUrl = `${getBaseWebUrl()}/job/${slug}`;
    return (
      <Paper zDepth={1} className="my-job-header-display p-16 flex space-between mb-16">
        <div className="flex align-items-stretch" onClick={() => {
          is_active ? this.props.history.push(_link) : ''
        }}>
          <Paper zDepth={1} className="stats-box">
            <div className="number">{info.stats.applications}</div>
            <div className="title">Applied</div>
          </Paper>
          <Paper zDepth={1} className="stats-box">
            <div className="number">{info.stats.matched}</div>
            <div className="title">Shortlisted</div>
          </Paper>
          <img className="coverpic" src={cover_pic_url}/>
          <div className="job-details ml-16">
            <h3>{description}</h3>
            <div>
              <span className="type">{type_text}</span> | <span className="location">{city}</span>
            </div>
            <div className="salary">
              {compensation}
            </div>
            {
              is_active ?
                <div className="recommended">
                  {info.stats.recommended} Matching Candidates Available.
                </div>
                :
                <div></div>
            }
          </div>
        </div>
        <div className="block">
          {/*<div><RaisedButton label="Edit" fullWidth/></div>*/}
          <div>{
            is_active ?
              <RaisedButton onTouchTap={() => this.closeJob(job_id)} label="Close" fullWidth className="mt-1"/>
              : <span className="badge badge-danger">Closed</span>
          }

            <LinkedInShare shareUrl={shareUrl} title={description}/>
            <FacebookShare shareUrl={shareUrl} title={description}/>
          </div>
        </div>
      </Paper>
    );
  }
}
