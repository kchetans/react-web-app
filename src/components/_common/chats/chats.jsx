import React, {Component} from "react";
import {socketConnect} from "socket.io-react";
import {connect} from "react-redux";
import ChatHeaders from "./ChatHeaders.jsx";
import * as ChatActions from "./ChatActions";
import CandidateDetails from "../../_recruiter/people/components/CandidateDetails";

class ChatsPage extends Component {

  state = {
    isLoadingHeader: false
  };

  componentDidMount() {
    let {headers} = this.props;
    if (headers.length === 0) {
      this.setState({isLoadingHeader: true});
      ChatActions.pull_headers_from_server()
        .then(haeders => {
          this.setState({isLoadingHeader: false});
        });
    }
  }

  onChatHeaderSelected = (_header) => {
    if (!!_header && _header._id) {
      this.props.selectHeader(_header);
    }
  };

  render() {
    let {headers} = this.props;
    let {isLoadingHeader} = this.state;

    if (headers)
      return (
        <div className="chat-page row">
          <div className="col-4">
            <ChatHeaders isLoading={isLoadingHeader} headers={headers}
                         onHeaderSelected={this.onChatHeaderSelected}/>
          </div>
          <div className="col-8">
            <div className="peopleDetailContainer p-0 w-100 h-100">
              <CandidateDetails info={{user_id: this.props.selected_user_id}} viewState="Chat"/>
            </div>
          </div>
        </div>
      );
    else
      return (
        <div>
          No Chat exist
        </div>
      )
  }
}


function mapStateToProps(state, ownProps) {
  if (state.chats) {
    return {
      headers: state.chats.headers,
      selected_header: state.chats.selectHeader(state.chats.headers, state.chats.selected_user_id),
      selected_user_id: state.chats.selected_user_id,
    }
  }
}

//return bindActionCreators({selectedHeaderStyle: selectedHeaderStyle}, dispatch)
function matchDispatchToProps(dispatch) {
  return {
    selectHeader: _header => {
      dispatch(ChatActions.action_select_header(_header));
    },
  }
}

export default socketConnect(connect(mapStateToProps, matchDispatchToProps)(ChatsPage));
