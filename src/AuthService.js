import {USER_PROFILE_STORAGE} from "./constants/storage";
const AUTH_TOKEN = 'auth-token';


export function setUserInfo(info) {
  localStorage.setItem(USER_PROFILE_STORAGE, JSON.stringify(info));
}

export function getUserInfo() {
  let _item = localStorage.getItem(USER_PROFILE_STORAGE);
  if (_item) {
    return JSON.parse(_item);
  } else {
    return {};
  }
}

export function removeUserInfo() {
  localStorage.removeItem(USER_PROFILE_STORAGE);
}

export function setAccessToken(token) {
  localStorage.setItem(AUTH_TOKEN, token);
}

export function removeAccessToken() {
  localStorage.removeItem(AUTH_TOKEN);
}

export function getAccessToken() {
  return localStorage.getItem(AUTH_TOKEN);
}

export function isLoggedIn() {
  const accessToken = getAccessToken();
  let _loggedIn = !!accessToken;
  return _loggedIn;
}
