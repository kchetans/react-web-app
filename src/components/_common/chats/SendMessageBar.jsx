import React, {Component} from "react";
import {socketConnect} from "socket.io-react";
import {connect} from "react-redux";
import {FloatingActionButton, Paper, TextField} from "material-ui";
import ContentAdd from "material-ui/svg-icons/content/send";
import {SOCKET_EVENT} from "../../../constants/events";
import Store from "./../../../StoreProvider";
import {action_updateHeaders} from "./ChatActions";

const uuid = require('uuid/v1');

class SendMessageBar extends Component {

  send_message = () => {
    let _text = this.refs.chatInput.getValue();
    if (_text && _text.length > 0) {
      let _now = new Date();
      let _newMessage = {
        message_guid: uuid(),
        type: 'out',
        template: 'text',
        status: 0,
        generated_at: _now,
        sent_time: _now,
        text: _text,
        receiver: '' + this.props.receiver_id,
        sender: '' + this.props.user_id,
        for_user: '' + this.props.user_id
      };
      this.props.addChat(this.props.receiver_id, _newMessage);
      this.props.socket.emit(SOCKET_EVENT.CHAT, _newMessage);
      // Store.dispatch(action_updateHeaders());
      this.refs.chatInput.getInputNode().value = '';
    }
  };

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.send_message();
    }
  };

  render() {
    return (
      <Paper zDepth={2} className="send-message-bar">
        <TextField ref="chatInput" className="inputText" hintText="Enter Chat Here, Press Enter to Send!" fullWidth
                   multiLine={false} rowsMax={3}
                   onKeyDown={this.handleKeyPress}/>
        <FloatingActionButton mini={true} className="ml-16"
                              onClick={this.send_message}><ContentAdd/></FloatingActionButton>
      </Paper>
    );
  }
}

/*
 SendMessageBar.propTypes = {
 user_id: PropTypes.string.isRequired,
 receiver_id: PropTypes.string.isRequired,
 addChat: PropTypes.func.isRequired
 };*/

function mapStateToProps(state, ownProps) {
  return {
    user_id: state.appState.current_user_id
  }
}

function matchDispatchToProps(dispatch) {
  return {
    addChat: (_user_id, _chat) => {
      dispatch({
        type: 'add_new_chat',
        user_id: _user_id,
        chat: _chat,
      });
    }
  }
}

export default socketConnect(connect(mapStateToProps, matchDispatchToProps)(SendMessageBar));
