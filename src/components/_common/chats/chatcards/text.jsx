import React, {Component} from "react";
import Paper from "material-ui/Paper";
import Moment from "react-moment";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import {socketConnect} from "socket.io-react";
import {Link} from "react-router-dom";
import {SOCKET_EVENT} from "../../../../constants/events";

let MESSAGE_TEMPALATE = {
  CARD: 'card',
  TEXT: 'text'
};
let CARD_TEMPALATE = {
  JOB_APPLICATION: 'job_application',
  NOTIFICATION: 'notification',
  OFFER_LETTER: "offer_letter",
  JOB_INTEREST: "job_interest"
};

export const timeprovider = (time) => {
  return <Moment fromNow>{time}</Moment>
};

export class TextCardForChat extends Component {
  render() {
    let _classNames = '';
    _classNames += (this.props.info.type === 'in') ? 'text-in' : 'text-out';
    return (
      <Paper zDepth={1} className={_classNames}>
        <div className="main-container">
          {this.props.text}
          <div className="time">
            {timeprovider(this.props.info.sent_time)}
            {(this.props.info.type !== 'out') ? null : (() => {
              switch (this.props.info.status) {
                case 0:
                  return <i className="chat-status-icon material-icons">watch_later</i>
                  break;
                case 1:
                  return <i className="chat-status-icon material-icons">check</i>
                  break;
                case 2:
                  return <i className="chat-status-icon material-icons">done_all</i>
                  break;

                case 3:
                  return <i className="chat-status-icon chat-status-read material-icons">done_all</i>
                  break;

                default:
                  return null;
                  break;
              }
            })()}
          </div>

        </div>
      </Paper>);
  }
}

export class JobCardForChat extends Component {

  render() {
    let info = this.props.info;
    let {sender} = info;
    let card_info = undefined;

    if (info.card_update) {
      if (info.card_update.length > 0) {
        card_info = info.card_update[info.card_update.length - 1].card;
      }
    }

    if (!card_info) {
      card_info = info.card;
    }
    let {status, card_template, title, job_id, job_cover_pic_url, job_title, job_location, compensation, job_category, status_text, type_text} = card_info;

    let onClickAction = (payload) => {
      let {action, is_accepted, candidate_id, job_id} = payload;
      this.props.socket.emit(SOCKET_EVENT.CARD_ACTION, {action, payload}, (response) => {
        console.log("response", response);
      });
    };

    let getCardActions = () => {
      if (status === card_template) {
        return (
          <div>
            <FlatButton label="Reject" onTouchTap={(event) => {
              event.preventDefault();
              onClickAction({action: card_template, is_accepted: false, candidate_id: sender, job_id})
            }}/>
            <RaisedButton label="Accept" primary={true} onTouchTap={(event) => {
              event.preventDefault();
              onClickAction({action: card_template, is_accepted: true, candidate_id: sender, job_id})
            }}/>
          </div>);
      } else {
        return <h6 style={{textTransform: 'UPPERCASE'}}>{status}</h6>
      }
    };

    return (
      <Paper className="chat-job-card">
        <Link to={`/jobs/${job_id}`}>
          <div >{status_text}
            <div className="time">
              {timeprovider(info.sent_time)}
            </div>
          </div>
          <Paper zDepth={1}>
            <img src={job_cover_pic_url} className="w-100"/>
            <div className="main-container">
              <h6>{job_title}</h6>
              <div>
                {
                  job_category && job_category[0] ? <span >{job_category[0].key}. </span> : ""
                }
                {job_location}
              </div>
              <small>{type_text}</small>
              <div className="salary">{compensation}</div>
            </div>

          </Paper>
        </Link>
        <div className="chat-actions">
          {getCardActions()}
        </div>
      </Paper>
    );
  }
}

export class NotificationCardForChat extends Component {

  render() {
    return (
      <Paper zDepth={1}>
        <div className="notification">
          <div className="time">
            {timeprovider(this.props.info.sent_time)}
          </div>
          <div className="title">{this.props.info.card.title}</div>
          <div className="text">{this.props.info.card.text}</div>
        </div>
      </Paper>
    );
  }
}

class ChatCard extends Component {

  componentDidMount() {
    let info = this.props.info;
    if (info) {
      if ((info.status < 3 && info.type === 'in')) {
        this.props.socket.emit(SOCKET_EVENT.CHAT_STATUS, {
          sender: this.props.info.sender,
          message_guid: this.props.info.message_guid,
          status: 3
        });
      }
    }
  }

  render() {
    let info = this.props.info;
    if (!info) {
      return;
    }


    let GetChatCard = () => {
      switch (info.template) {
        case MESSAGE_TEMPALATE.TEXT:
          return <TextCardForChat text={info.text} info={info} socket={this.props.socket}/>;
        case MESSAGE_TEMPALATE.CARD:
          switch (info.card.card_template) {
            case CARD_TEMPALATE.NOTIFICATION:
              return <NotificationCardForChat info={info} socket={this.props.socket}/>;
            case CARD_TEMPALATE.JOB_APPLICATION:
              return <JobCardForChat info={info} socket={this.props.socket}/>;
            case CARD_TEMPALATE.OFFER_LETTER:
              return <JobCardForChat info={info} socket={this.props.socket}/>;
            case CARD_TEMPALATE.JOB_INTEREST:
              return <JobCardForChat info={info} socket={this.props.socket}/>;
            default:
              return null;
          }
          break;
      }
    };

    return (
      <div className="chat-message">
        {GetChatCard()}
      </div>
    );
  }
}

export default socketConnect(ChatCard);
