import {getAccessToken} from "../AuthService.js";
import config from "../config.json";
import {LOG_OUT} from "../constants/events";
import {eventEmitter} from "../dispatcher";
// let version = config.version;
export default class ApiBuilder {

  static _env = config.env;

  static PATH_GET_CATEGORIES_MASTER = '/workexnow/v1/jobs/categories';

  static PATH_POST_NEW_JOB = '/workexnow/v1/jobs/';

  static params = {

    prod: {
      _host: "http://apis.workex.xyz/api"
    },
    local: {
      _host: 'http://localhost:9000/api',
      _socket_address: 'localhost:3000'
    },
    dev: {
      _host: 'http://development.workex.xyz/api',
      _socket_address: 'devsocket.workex.xyz'
    },
    staging: {}
  };

  static getUrlParameter = (name) => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  static getApi = (path, args) => {
    return ApiBuilder.params[ApiBuilder._env]._host + path;
  };

  static getWebappApi = (path) => {
    return ApiBuilder.getApi('/webapp/v1', path);
  };

  static getMobAppApi = (path) => {
    return ApiBuilder.getApi('/workexnow/v1', path);
  };

  static handleErrors = (response) => {
    if (!response.ok) {
      return response.json().then(_res => {
        let {errors} = _res;
        if (errors && errors[0] && errors[0].code === "invalid_token") {
          eventEmitter.emit(LOG_OUT);
        }
        return Promise.reject(_res)
      });
    } else {
      return response.json();
    }
  };

  static fetch = (...args) => {

    let _headerParams = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      // 'request-source': `web-panel-${version}`
    };

    let _accessToken = getAccessToken();
    if (_accessToken) {
      // Logged In:
      _headerParams['Authorization'] = 'JWT ' + _accessToken;
    }

    if (args.length === 2) {
      args[1].headers = Object.assign({}, _headerParams, args[1].headers);
      if (args[1].body && typeof args[1].body !== 'string') {
        args[1].body = JSON.stringify(args[1].body);
      }
    }
    else if (args.length === 1 && _accessToken) {
      args.push({headers: _headerParams});
    }
    return fetch(...args).then(ApiBuilder.handleErrors);
  };


  static uploadImage = (...args) => {

    let _headerParams = {};

    let _accessToken = getAccessToken();
    if (_accessToken) {
      // Logged In:
      _headerParams['Authorization'] = 'JWT ' + _accessToken;
    }

    if (args.length === 2) {
      args[1].headers = Object.assign({}, _headerParams, args[1].headers);
    }
    else if (args.length === 1 && _accessToken) {
      args.push({headers: _headerParams});
    }
    return fetch(...args).then(ApiBuilder.handleErrors);
  }
}
