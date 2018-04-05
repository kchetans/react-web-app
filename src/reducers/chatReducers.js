import cloneDeep from "lodash/cloneDeep";

const initial_state = {
  current_user: null,
  headers: [],
  selected_user_id: undefined,
  chats: {},
  selectHeader: (_headers, user_id) => {
    if (!_headers)
      return undefined;
    for (let header of _headers) {
      if (header._id === user_id) {
        return header;
      }
    }
    return undefined;
  }
};

export default (state = initial_state, action) => {
  const nextState = cloneDeep(state);
  let {type, ...payload} = action;

  if (action) {
    switch (type) {
      case 'login':
        return {...state, current_user: action.user_id};
        break;

      case 'update_headers':
        nextState.headers = action.headers //_.orderBy(action.headers, ['chat_message.sent_time'], ['desc']);
        break;

      case 'select_header':
        nextState.selected_user_id = action.user_id;
        break;

      case 'update_chats':
        if (nextState.chats[action.user_id]) {
          nextState.chats[action.user_id].data = action.chats.data.concat(nextState.chats[action.user_id].data);
        } else {
          nextState.chats[action.user_id] = action.chats;
        }
        break;

      case 'add_new_chat':

        if (nextState.chats[action.user_id] && action.chat.type !== 'card_update') {
          nextState.chats[action.user_id].data.push(action.chat);
        }
        if (action.chat.type === 'card_update') {
          for (let i = 0; i < nextState.chats[action.user_id].data.length; i++) {
            let message = nextState.chats[action.user_id].data[i];
            if (message.message_guid === action.chat.message_guid) {
              nextState.chats[action.user_id].data[i] = action.chat;
              break;
            }
          }
        } else {
          if (typeof action.chat.sent_time === 'object')
            action.chat.sent_time = action.chat.sent_time.toISOString();
          // Update Header
          let _headerFound = false;
          let _headerIndex = 0;
          for (let _header of nextState.headers) {
            if (_header.other_user === action.user_id) {
              _header.chat_message = action.chat;
              _headerFound = true;
              break;
            }
            _headerIndex++;
          }
          if (!_headerFound) {                // CREATE A NEW HEADER
            nextState.headers.splice(0, 0, {
              _id: action.user_id,
              name: action.chat && action.chat.sender_info ? action.chat.sender_info.name : "No Name",
              chat_message: action.chat
            });
          } else {
            let updatedHeader = nextState.headers.splice(_headerIndex, 1);
            nextState.headers.splice(0, 0, updatedHeader[0]);
          }
        }

        // nextState.headers = _.orderBy(nextState.headers, ['chat_message.sent_time'], ['desc']); // todo: check the ordering format;
        break;

      case 'update_chat_status':
        let _data = action.data;
        for (let item of _data) {
          if (item.status > 0 && item.status <= 3) {
            let _msgList = nextState.chats[item.receiver];
            if (_msgList && _msgList.data) {
              for (let msg of _msgList.data) {
                if (msg.message_guid === item.message_guid) {
                  if (msg.status < item.status) {
                    msg.status = item.status;
                    break;
                  }
                }
              }
            }
          }
        }
        break;

      case 'update_in_chat_status':
        let chat = action.chat;
        let status = action.status;
        //todo: InComplete, update status = 3, for local messages.
        break;

      default:
        break;
    }
  }
  return nextState;
};
