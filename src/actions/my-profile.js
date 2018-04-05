import {MY_PROFILE} from "../constants/urls";
import ApiBuilder from "./../components/apiBuilder";
import Store from "./../StoreProvider";
import {setUserInfo} from "../AuthService";

export const fetchMyProfile = () => {
  return new Promise((resolve, reject) => {
    ApiBuilder.fetch(ApiBuilder.getApi(MY_PROFILE))
      .then(res => {
        setUserInfo(res.data);
        Store.dispatch({
          type: 'my_profile',
          payload: res.data
        });
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};
