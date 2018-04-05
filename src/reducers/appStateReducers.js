import {removeUserInfo} from "../AuthService.js";
const initialState = {
  loggedIn: false,
  loading: false,
  role: 'employer',
  token: undefined,
  user_info: undefined,
  current_user_id: undefined,
};

export default function appStateReducers(state = initialState, action) {

  switch (action.type) {
    case 'login':
      let {user_id: current_user_id, user_info, token} = action;
      return {...state, loggedIn: true, current_user_id, user_info, token};
      break;
    case 'logout':
      removeUserInfo();
      return {...state, loggedIn: false, current_user_id: undefined, user_info: undefined, token: undefined};
      break;
  }

  return state;
}
