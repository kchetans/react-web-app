import ApiBuilder from "../../apiBuilder.js";
import Store from "../../../StoreProvider";
import {CHAT_HEADERS_URL, CHAT_MESSAGES_URL, getRedefineUrl} from "../../../constants/urls";
import {isLoggedIn} from "../../../AuthService";

export class ChatEvents {
  static EVENT_CONNECT = 'connect';
  static EVENT_CHAT = 'chat';
  static EVENT_USER_STATUS = 'user_status';
  static EVENT_CHAT_STATUS = 'chat_status';
  static EVENT_DISCONNECT = 'disconnect';
  static EVENT_CARD_ACTION = 'card_action';
  static CHAT_HEADERS = 'CHAT_HEADERS';

  static OFFER_LETTER = 'offer_letter';

  static CHAT_STATUS_PENDING = 0;
  static CHAT_STATUS_SENT = 1;
  static CHAT_STATUS_DELIVERED = 2;
  static CHAT_STATUS_SEEN = 3;
}

// Chat Store Actions
export const action_updateHeaders = (_headers) => {
  return {
    type: 'update_headers',
    headers: _headers
  };
};

export const action_updateHeader = _header => {
  return {
    type: 'update_header',
    header: _header
  };
};

export const action_select_header = _header => {
  return {
    type: 'select_header',
    header: _header,
    user_id: _header._id
  };
};

export const action_updateChatsForUser = (_userid, _chats) => {
  return {
    type: 'update_chats',
    user_id: _userid,
    chats: _chats
  };
};

export const action_addNewChatForUser = (_userid, _chat) => {
  return {
    type: 'add_new_chat',
    user_id: _userid,
    chat: _chat
  };
};

export const pull_chat_details_from_server = (user_id) => {
  let state = Store.getState();
  let message_guid = undefined;

  if (state.chats.chats[user_id]) {
    message_guid = state.chats.chats[user_id].data[0].message_guid;
  }

  let params = message_guid ? `message_guid=${message_guid}` : "";

  return new Promise((resolve, reject) => {
    ApiBuilder.fetch(ApiBuilder.getApi(getRedefineUrl(CHAT_MESSAGES_URL, {user_id}) + `?${params}`))
      .then(res => {
        Store.dispatch(action_updateChatsForUser(user_id, {data: res.data, meta: res.meta}));
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const pull_headers_from_server = () => {
  return new Promise((resolve, reject) => {
    if (!isLoggedIn()) {
      reject(true);
    }
    ApiBuilder.fetch(ApiBuilder.getApi(CHAT_HEADERS_URL))
      .then(res => {
        resolve(res.data);
        Store.dispatch({
          type: 'update_headers',
          headers: res.data
        });
      })
      .catch(err => {
        reject(err);
      })
  });
};
