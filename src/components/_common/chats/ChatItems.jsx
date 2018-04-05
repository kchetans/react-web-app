import React, {Component} from "react";
import ChatCard from "./chatcards/text.jsx";
import map from "lodash/map";

export default class ChatItems extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {chats} = this.props; //this.state[this.getUserBaserKey(this.state.selected_user_id)];
    if (!chats || !chats.data)
      return null;
    return (
      <div className="chatsContainer">
        {map(chats.data, _chat => {
          return <ChatCard info={_chat} key={('chat' + _chat.message_guid)}/>
        })}
      </div>
    );
  }
}
