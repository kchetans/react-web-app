import React, {Component} from "react";
import RaisedButton from "material-ui/RaisedButton";
import Paper from "material-ui/Paper";
import {Redirect} from "react-router";

export class JobCardPreview extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    let info = {};

    if (this.props.info) {
      info = this.props.info;
    }

    let getTitlePreview = () => {
      if (info.title)
        return info.title;
      else
        return <span className="titlePlaceholder"> Please Provide a Job Description ...</span>
    };

    let getLocation = () => {
      if (!info.city)
        return null;
      return <span className="label chip location">{info.city}</span>;
    };

    let getPostedByInfo = () => {
      let _company_name = null;
      if (info.companyName)
        _company_name = <div className="company-name">{info.companyName}</div>;
      if (info.recruiter_name) {
        return (
          <div className="posted-by">
            {/*<div><span className="label">Posted by</span><span className="name">{info.recruiter_name}</span></div>*/}
            {/*{_company_name}*/}
          </div>
        );
      }
    };

    let getCoverPic = () => {
      if (info.cover_pic_url) {
        return <img width="100%" src={info.cover_pic_url}/>;
      } else {
        return <img width="100%"
                    src="http://www.techicy.com/wp-content/uploads/2015/01/India-Republic-Day-Facebook-Cover-Photos-Images-Wallpapers-2015-2.jpg"/>
      }
    };

    return (
      <Paper zDepth={3}>
        <div className="job-preview">
          {getCoverPic()}
          <div className="contentContainer">
            <h4>
              {getTitlePreview()}
            </h4>
            <div className="row">
              <div className="col-9">
                <div>
                  <span className="label chip">{info.category_display}</span>
                  {getLocation()}
                  <span className="label chip emp-type">{info.type_display}</span>
                </div>
                <div className="salary">
                  {info.compensation}
                </div>
                {getPostedByInfo()}
              </div>
              <div className="col-3" style={{'textAlign': 'right', 'paddingTop': '40px'}}>
                <RaisedButton label="Apply" labelPosition="before" primary={true}/>
              </div>
            </div>
          </div>
        </div>
      </Paper>
    );
  }
}
