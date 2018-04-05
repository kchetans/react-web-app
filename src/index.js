import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {eventEmitter} from "./dispatcher";
import {Provider} from "react-redux";
import {SocketProvider} from "socket.io-react";
import io from "socket.io-client";
import {getAccessToken, getUserInfo} from "./AuthService.js";
import "./static/img/logo.jpg";
import Store from "./StoreProvider";
import {pull_headers_from_server} from "./components/_common/chats/ChatActions";
import ReactGA from "react-ga";
import {GA_TRACKING_ID} from "./constants/ga";
import config from "./config.json";
import {DISCONNECT_SOCKET, LOG_OUT, SOCKET_DISCONNECTED, SOCKET_EVENT} from "./constants/events";
import {fetchMyProfile} from "./actions/my-profile";
import {removeAccessToken, removeUserInfo} from "./AuthService";
ReactGA.initialize(GA_TRACKING_ID);
let env = config.env;

let socket = undefined;

let _userinfo = undefined;

let checkUserInfo = (_callback = undefined) => {
  _userinfo = getUserInfo();

  if (!_userinfo.profile) {
    if (getAccessToken()) {
      fetchMyProfile()
        .then(res => {
          if (_callback)
            _callback(res.data);
        }).catch(err => {
        if (_callback)
          _callback(null, err);
      });
    } else {
      _callback(null, true);
    }
  } else {
    if (_callback)
      _callback(_userinfo, null);
  }
};

let render_app = () => {
  ReactDOM.render(
    <SocketProvider socket={socket} user_info={_userinfo}>
      <Provider store={Store}>
        <App />
      </Provider>
    </SocketProvider>,
    document.getElementById('root')
  );
};

if (Notification.permission !== 'granted')
  Notification.requestPermission();

let RaiseNotification = (title, content) => {
  let notification = new Notification(title, {icon: "./static/img/logo.jpg", body: content});
  //notification.onshow = function() { setTimeout(notification.close, 15000) };
  notification.onclick = (event) => {
    event.preventDefault();
    //todo: Generate the URL Dynamically & Don;t open, if already open;
    window.focus();
    notification.close();
  }
};

let init_sockets = (user_id) => {
  let query = `user_id=${user_id}&source=webapp&auth_token=${getAccessToken()}&version=version`;
  let _address = {prod: 'http://sockets.workex.xyz', local: 'localhost:3000', dev: 'devsocket.workex.xyz'};
  socket = io.connect(_address[env], {query: query});

  let onevent = socket.onevent;

  socket.onevent = function (packet) {
    let args = packet.data || [];
    onevent.call(this, packet);             // original call
    packet.data = ["*"].concat(args);
    onevent.call(this, packet);             // additional call to catch-all
  };
  socket.on("*", function (event, data) {
    console.log("SOCKET : ", event, "on", data);
  });

  socket.on(SOCKET_EVENT.CONNECT, msg => console.log('[Chat, Socket] Socket Connected'));

  eventEmitter.addListener(DISCONNECT_SOCKET, () => {
    socket.disconnect();
    eventEmitter.emit(SOCKET_DISCONNECTED);
  });

  socket.on(SOCKET_EVENT.CHAT, (data) => {

    if (data instanceof Array) {
      return;
    }

    data.status = 2;
    Store.dispatch({
      type: 'add_new_chat',
      user_id: data.sender,
      chat: data
    });

    // Store.dispatch(action_updateHeaders());

    let _state = Store.getState().chats;
    let _header = _state.selectHeader(_state.headers, data.sender);
    let _notification_title = 'New Message';
    if (_header) {
      _notification_title = _header.name;
    }
    RaiseNotification(_notification_title, data.text);


    // update delivered status
    socket.emit(SOCKET_EVENT.CHAT_STATUS, {
      sender: data.sender,
      message_guid: data.message_guid,
      status: 2
    });
  });

  // On Chat Status Update Received
  socket.on(SOCKET_EVENT.CHAT_STATUS, (data) => {
    Store.dispatch({
      type: 'update_chat_status',
      data: data
    })
  });

  socket.on(SOCKET_EVENT.DISCONNECT, msg => {
    eventEmitter.emit(SOCKET_DISCONNECTED);
  });
};

checkUserInfo((data, err) => {
  if (err && err !== null) {
    render_app();
  } else {
    // alert('dispatching from index js' + data.profile.user_id)
    Store.dispatch({
      type: 'login',
      user_id: data.profile.user_id,
      user_info: data,
      token: getAccessToken()
    });

    if (Store.getState().chats.headers.length === 0) {
      pull_headers_from_server();
    }

    init_sockets(data.profile.user_id);
    render_app();
  }

  eventEmitter.addListener(LOG_OUT, () => {
    removeAccessToken();
    removeUserInfo();
    Store.dispatch({type: "logout"});
    eventEmitter.emit(DISCONNECT_SOCKET);
    window.location = '/login';
  });

});


