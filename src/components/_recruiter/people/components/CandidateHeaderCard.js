import React, {Component} from "react";
import Dialog from "material-ui/Dialog";
import {Paper, RaisedButton} from "material-ui";
import UserAvatar from "../../../_common/UserAvatar";
import ApiBuilder from "../../../apiBuilder";
import {fireEventTrack} from "../../../../analytics/analytics";
import {CANDIDATE_HEADER, SHORTLIST} from "../../../../constants/ga";

export class CandidateHeaderCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_my_jobs_dialog: false,
      job_for_shortlisting: []
    };
  }

  handleOnClick = () => {
    if (this.props.onSelect) {
      this.props.onSelect(this.props.profile);
    }
  };

  getLabelFromViewStat = (_viewState) => {
    return _viewState === 'Chat' ? 'Profile' : 'Chat';
  };

  componentWillMount() {
    this.setState({viewState: this.props.viewState});
  }

  render() {

    let {profile, is_online = undefined} = this.props;
    let {about, city, status, total_experience, education, current_location, profile_pic_url, name, distance, user_id} = profile;

    let _aboutMe = null, _location = null, _avatar = null, _status = null;

    if (about) _aboutMe = <div className="aboutme"><span className="title">About Me: </span> {about}</div>;

    if (city) _location = <div>{city}</div>;

    if (status) _status = <span className="status_text">{status}</span>;

    let getOverview = () => {

      let tags = [];

      if (total_experience) tags.push(<span>Experience: {total_experience}</span>);

      if (education) tags.push(<span>{education}</span>);

      if (current_location) tags.push(<span className="current-location">{current_location}</span>);

      return tags.map((item, i) => {
        if (i < (tags.length - 1))
          return <span key={i}>{item}; </span>;
        else
          return <div key={i}>{item}</div>;
      });

    };

    return (
      <Paper zDepth={1} className="CandidateHeader" onClick={this.handleOnClick}>
        {this.getMyJobsActive()}
        <div className="flex space-between">
          <div className="flex align-items-start">
            <div className="no-grow">
              <UserAvatar src={profile_pic_url} name={name}/>
              {is_online === true ? <div>Online</div> : is_online === false ? <div>OffLine</div> : ""}
            </div>
            <div style={{marginLeft: '16px'}}>
              <h5>{name} {distance ? <span className="font-small font-blue">{distance}</span> : null}
              </h5>
              {<div className="overview font-small">{getOverview()}</div>}
              {_location} {_status}
              {_aboutMe}
            </div>
          </div>
          <div>
            {
              !this.props.canSwitchState ? null :
                <div className="flex flex-column align-items-end">
                  <RaisedButton
                    onTouchTap={() => {
                      fireEventTrack(CANDIDATE_HEADER, this.getLabelFromViewStat(this.state.viewState), user_id);
                      let _newState = this.getLabelFromViewStat(this.state.viewState);
                      this.setState({viewState: _newState});
                      if (this.props.onViewStateChanged) {
                        this.props.onViewStateChanged(_newState);
                      }
                    }}
                    className="ml-16"
                    label={this.getLabelFromViewStat(this.state.viewState)}
                    primary={true}
                  />
                  <RaisedButton
                    onTouchTap={() => {
                      if (this.props.job_id) {
                        this.shortListCandidate(this.props.job_id);
                      } else {
                        this.getJobsFor(user_id);
                        this.setState({show_my_jobs_dialog: true});
                      }
                    }}
                    className="ml-16 mt-4"
                    label={ this.state.is_shortlisted === `${this.props.job_id}-${user_id}` ? "Shortlisted" : "Shortlist"}
                    secondary={true}
                  />
                </div>
            }
          </div>
        </div>
      </Paper>
    );
  }

  handleClose = () => {
    this.setState({show_my_jobs_dialog: false, job_for_shortlisting: []});
  };

  getMyJobsActive = () => {
    return (
      <Dialog
        autoScrollBodyContent={true}
        title="Shortlist"
        modal={false}
        open={this.state.show_my_jobs_dialog}
        onRequestClose={this.handleClose}
      >
        {
          this.state.job_for_shortlisting && this.state.job_for_shortlisting.length > 0 ?
            this.state.job_for_shortlisting.map((item, index) => {
              let {city, compensation, type_text, cover_pic_url, job_id, description, title} = item;
              return (
                <div key={index}>
                  <img src={cover_pic_url}/>
                  <h4>{title}</h4>
                  {compensation} || {city} || {type_text}
                  <RaisedButton
                    className="ml-5"
                    primary={!this.state[`shortlisted${job_id}`]}
                    onTouchTap={() => {
                      this.shortListCandidate(job_id);
                    }}
                    label={!this.state[`shortlisted${job_id}`] ? "Shortlist" : "Shortlisted"}
                  />
                  <hr />
                </div>
              )
            })
            :
            <div>No Jobs to shortlist this candidate</div>
        }
      </Dialog>
    )
  };


  shortListCandidate = (job_id) => {
    fireEventTrack(CANDIDATE_HEADER, SHORTLIST, this.props.profile.user_id);
    ApiBuilder.fetch(ApiBuilder.getApi(`/workexnow/v1/jobs/${job_id}/short-list/${this.props.profile.user_id}`), {
      method: 'PUT'
    }).then(res => {
      this.setState({[`shortlisted` + job_id]: true, is_shortlisted: `${job_id}-${this.props.profile.user_id}`});
    }).catch(err => {
      console.error(err);
    });
  };

  getJobsFor = (user_id) => {
    let _url = ApiBuilder.getApi(`/workexnow/v1/users/${user_id}/active-jobs/shortlist`);
    //this.setState({loading:true});
    ApiBuilder.fetch(_url)
      .then(res => {
        this.setState({job_for_shortlisting: res.data});
      }).catch(err => {
      console.error(err);
    });
  };

}
