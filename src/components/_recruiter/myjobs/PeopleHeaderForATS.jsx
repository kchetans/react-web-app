import React, {Component} from "react";
import Paper from "material-ui/Paper";
import UserAvatar from "../../_common/UserAvatar";


//todo: convert into state less component
export default class PeopleHeaderForATS extends Component {

  render() {
    let {info} = this.props;
    let _aboutMe = null, _location = null, _status = null;


    if (info.overview) {
      _aboutMe = <div>{info.overview}</div>;
    }

    if (info.city) {
      _location = <div>{info.city}</div>
    }

    if (info.status) {
      _status = <span className="status_text">{info.status}</span>
    }

    return (
      <Paper zDepth={1} className="p-16" onClick={this.props.onClick}>
        <div className="flex" style={{alignItems: 'flex-start'}}>
          <UserAvatar src={info.profile_pic_url} name={info.name}/>
          <div className="ml-16">
            <h5>{info.name}</h5>
            {_location} {_status}
            {_aboutMe}
          </div>
        </div>
      </Paper>
    );
  }
}
