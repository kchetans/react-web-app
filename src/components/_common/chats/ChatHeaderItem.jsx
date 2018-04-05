import React, {Component} from "react";
import {Paper} from "material-ui";
import Moment from "react-moment";
import UserAvatar from "../UserAvatar";

export default class ChatHeaderItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      depth: 0
    }
  }

  _handleOnMouseOver = () => {
    this.setState({
      hover: true,
      depth: 5
    });
  };

  _handleOnMouseOut = () => {
    this.setState({hover: false, depth: 0});
  };

  render() {
    let info = this.props.info;
    if (!info)
      return null;

    let {name = 'Anonymus', profile_pic_url, chat_message = {}} = info;
    let {sent_time, text} = chat_message;

    return (
      <Paper zDepth={this.state.depth} className="chatHeaderItem"
             onMouseOver={this._handleOnMouseOver}
             onClick={() => {
               if (this.props.onSelect) {
                 this.props.onSelect();
               }
             }}
             onMouseOut={this._handleOnMouseOut}>
        <div className="flex">
          <div className="block profilePic">
            <UserAvatar src={profile_pic_url} name={name}/>
          </div>
          <div className="ml-16">
            <h5>{name}
              <span className="block time"><Moment interval={30000} fromNow>{sent_time}</Moment></span>
            </h5>
            <div className="block lastMessage">{text}</div>
          </div>
        </div>
      </Paper>
    );
  }
}
