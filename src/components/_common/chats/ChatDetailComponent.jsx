import React, {Component} from "react";
import {Paper} from "material-ui";
import Scrollbars from "react-custom-scrollbars";
import ChatItems from "./ChatItems.jsx";
import SendMessageBar from "./SendMessageBar.jsx";
import {socketConnect} from "socket.io-react";
import {connect} from "react-redux";
import * as ChatActions from "./ChatActions";
import {CHAT_PLACE_HOLDER_IMG} from "../../../constants/urls";

class ChatDetailComponent extends Component {

  state = {
    is_loading: false,
    has_more_chat: true
  };

  scrollChatsToBottom = () => {
    console.log("-----------------scrollChatsToBottom-----------------");
    if (this.refs.scrollbar)
      this.refs.scrollbar.scrollToBottom();
  };

  componentDidMount() {
    this.checkAndFetchChat()
  }

  componentDidUpdate() {
    this.checkAndFetchChat()
  }

  checkAndFetchChat = () => {
    let {other_user_id, chats} = this.props;
    if (!chats && !this.state.is_loading && this.state.has_more_chat) {
      this.pull_chat_details_from_server(other_user_id)
        .then(res => this.scrollChatsToBottom())
    }
  };

  pull_chat_details_from_server = (other_user_id) => {
    this.setState({is_loading: true});
    return ChatActions.pull_chat_details_from_server(other_user_id)
      .then(res => {
        if (res.data.length === 0)
          this.setState({has_more_chat: false});
      })
      .catch(err => {

      })
      .then(res => {
        this.setState({is_loading: false})
      });
  };

  // on scroll
  handleUpdate = (values) => {
    let {other_user_id, chats} = this.props;
    const {scrollTop, scrollHeight, clientHeight} = values;
    const pad = 300;
    const t = ((scrollTop + pad) / (scrollHeight - clientHeight));
    if (t < 0.3 && !this.state.is_loading && this.state.has_more_chat) {
      this.pull_chat_details_from_server(other_user_id)
    }
  };

  render() {
    let {header, showHeader, chats} = this.props;

    let chat_messages = () => {
      if (chats && chats.data && chats.data.length > 0) {
        return <ChatItems chats={chats}/>
      }
      else return <img className="w-100" src={CHAT_PLACE_HOLDER_IMG}/>
    };

    return (
      <Paper zDepth={0} className="chat-detail-container h-100">
        <div className="chat-detail " style={{height: "100%"}}>
          <Scrollbars ref="scrollbar" className="chat-detail-scrollbar" onUpdate={this.handleUpdate}>
            {chat_messages()}
          </Scrollbars>
          <SendMessageBar receiver_id={this.props.other_user_id}/>
        </div>
      </Paper>
    );
  }
}

ChatDetailComponent.defaultProps = {
  showHeader: true
};

function mapStateToProps(state, ownProps) {
  if (state.chats) {
    return {
      user_id: state.chats.current_user,
      header: state.chats.selectHeader(state.chats.headers, ownProps.other_user_id),
      chats: state.chats.chats[ownProps.other_user_id]
    }
  }
  return {};
}

function matchDispatchToProps(dispatch) {
  return {
    //updateChats: (_user_id, _chats) => { dispatch(ChatActions.action_updateChatsForUser(_user_id,_chats));},
  }
}

export default socketConnect(connect(mapStateToProps, matchDispatchToProps)(ChatDetailComponent));
