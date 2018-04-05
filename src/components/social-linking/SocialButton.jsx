import React from "react";
import SocialLogin from "react-social-login";

const Button = ({children, triggerLogin, ...props}) => (
  <div onClick={triggerLogin} {...props}>
    { children }
  </div>
);

export default SocialLogin(Button);
