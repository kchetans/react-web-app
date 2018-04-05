import React, {Component} from "react";
import {Scrollbars} from "react-custom-scrollbars";
import Paper from "material-ui/Paper";
import ChatHeaderItem from "./ChatHeaderItem.jsx";
import NoChatHeadersContent from "./NoChatHeadersContent";
import LoadingChatHeaders from "./LoadingChatHeaders";
import map from "lodash/map";

export default class ChatHeaders extends Component {

  render() {
    let {isLoading = false, zDepth = 1, headers = []} = this.props;

    if (isLoading) {
      return (
        <Paper zDepth={zDepth} className="chat-headers p-16">
          <LoadingChatHeaders />
        </Paper>
      );
    }

    if (headers.length === 0) {
      return (
        <Paper zDepth={zDepth} className="chat-headers p-16">
          <NoChatHeadersContent />
        </Paper>
      );
    }

    let chatHeaders = map(headers, headerItem => {
      return <ChatHeaderItem info={headerItem} key={headerItem._id}
                             onSelect={() => {
                               if (this.props.onHeaderSelected) {
                                 this.props.onHeaderSelected(headerItem);
                               }
                             }}
      />
    });

    return (
      <Paper zDepth={zDepth} className="chat-headers">
        <Scrollbars style={{height: '100%'}}>
          {chatHeaders}
        </Scrollbars>
      </Paper>
    );
  }
}
