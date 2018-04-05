import React, {Component} from "react";
import ApiBuilder from "../apiBuilder";
import {getBaseUrl, getRedefineUrl, PUBLIC_JOB} from "../../constants/urls";
import LinkedInShare from "../social-sharing/LinkedInShare";
import FacebookShare from "../social-sharing/FacebookShare";
import WhatsAppShare from "../social-sharing/WhatsAppShare";
import PublibJobsHeaderMeta from "./PublibJobsHeaderMeta";
class PublicJobs extends Component {

  state = {
    job_info: {},
    is_loading: false
  };

  componentDidMount() {
    let currentRout = this.props.location.pathname;
    let jobSlug = currentRout.substring(currentRout.lastIndexOf("/") + 1);
    this.setState({is_loading: true});
    ApiBuilder.fetch(ApiBuilder.getApi(getRedefineUrl(PUBLIC_JOB, {slug: jobSlug})))
      .then(res => {
        this.setState({job_info: res.data});
      })
      .catch(err => {

      })
      .then(res => {
        this.setState({is_loading: false});
      })
  }


  render() {
    let {job_info, is_loading} = this.state;
    if (is_loading) {
      return (
        <div>
          Loading...
        </div>
      )
    }

    let {cover_pic_url, contact_name, city, compensation, state, title, description, category, type_text, created_at, slug} = job_info;
    let shareUrl = `${getBaseUrl()}jobs/${slug}`;
    return (
      <div>
        <PublibJobsHeaderMeta meta={job_info}/>
        <div>
          <img src={cover_pic_url}/>
          <span>{title}</span><br />
          <span>{description}</span><br />
          <span>{category} || {type_text} ||</span><br />

          <div className="mt-3 flex">
            <h5 className="pt-4">
              <i className="fa fa-calendar h5 pr-2" style={{color: "#29b1fd"}}/>
              Date Posted:</h5>
            <span>{created_at}</span>
          </div>
          <div className="mt-3 flex">
            <h5 className="pt-4">
              <i className="fa fa-map-marker h5 pr-2" style={{color: "#29b1fd"}}/>
              Location:</h5>
            <span>{city} , {state}</span>
          </div>
          <div className="mt-3 flex">
            <h5 className="pt-4">
              <i className="fa fa-money h5 pr-2" style={{color: "#29b1fd"}}/>
              Salary:</h5>
            <span>{compensation}</span>
          </div>

          <LinkedInShare shareUrl={shareUrl} title={description}/>
          <FacebookShare shareUrl={shareUrl} title={description}/>
          <WhatsAppShare shareUrl={shareUrl} title={description}/>
        </div>
      </div>
    );
  }
}

PublicJobs.propTypes = {};
PublicJobs.defaultProps = {};

export default PublicJobs;
