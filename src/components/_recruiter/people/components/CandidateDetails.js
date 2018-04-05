import React, {Component} from "react";
import {LinearProgress} from "material-ui";
import {CandidateHeaderCard} from "./CandidateHeaderCard";
import ApiBuilder from "../../../apiBuilder";
import ChatDetailComponent from "../../../_common/chats/ChatDetailComponent";
import {getRedefineUrl, USER_PROFILE} from "../../../../constants/urls";
import CandidateProfile from "./CandidateProfile";

let viewState = {
  PROFILE: 'Profile',
  CHAT: 'Chat'
};

class CandidateDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      viewState: viewState.PROFILE,
      fullprofile: undefined
    };
  }

  //fetch user profile from server
  fetch_from_server = (user_id) => {
    if (!user_id)
      return;
    let _url = ApiBuilder.getApi(getRedefineUrl(USER_PROFILE, {user_id}));
    //this.setState({loading:true});
    ApiBuilder.fetch(_url)
      .then(res => {
        this.setState({fullprofile: res.data, loading: false});
      }).catch(err => {
      console.error(err);
    });
  };


  render() {
    let {info} = this.props;
    let {fullprofile} = this.state;
    if (!info) {
      return null;
    }

    if (!fullprofile || fullprofile === null) {
      return null;
    }
    let {profile, is_online} = fullprofile;

    if (!profile) {
      return null;
    }

    const RenderProgressBar = (value) => {
      if (!value)
        return <LinearProgress mode="determinate" value={0} min={0} max={100}/>;
      if (this.state.loading)
        return <LinearProgress mode="indeterminate"/>;
      return <LinearProgress mode="determinate" value={value} min={0} max={100}/>;
    };

    let getProfileComponents = () => {
      return (
        <CandidateProfile fullprofile={fullprofile}/>
      );
    };

    let getChatComponents = () => {
      return (
        <div className="w-100 h-100">
          <ChatDetailComponent other_user_id={profile.user_id}/>
        </div>
      );
    };

    let getComponentDetails = () => {
      switch (this.state.viewState) {
        case viewState.PROFILE:
          return getProfileComponents();
        case viewState.CHAT:
          return getChatComponents();
      }
      return null;
    };

    return (
      <div className="candidate-details h-100 w-100">
        <div style={{height: '30%'}}>
          {
            // className="position-relative">
          }
          <div style={{height: '5px', width: '100%', backgroundColor: 'rgb(189,189,189)'}}>
            {RenderProgressBar(profile.profile_percentage)}
          </div>
          <CandidateHeaderCard profile={profile} viewState={this.state.viewState} canSwitchState={true}
                               job_id={this.props.job_id} is_online={is_online}
                               onViewStateChanged={(_state) => this.setState({viewState: _state})}/>
        </div>
        <div style={{height: '70%'}}>
          { getComponentDetails()}
        </div>
      </div>
    )
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.viewState) {
      this.setState({viewState: nextProps.viewState});
    }
    if (nextProps.info && nextProps.info.user_id) {
      this.setState({fullprofile: {profile: nextProps.info}});
      this.fetch_from_server(nextProps.info.user_id);
    } else {
      this.setState({fullprofile: undefined});
    }
  }

}

export default CandidateDetails;

