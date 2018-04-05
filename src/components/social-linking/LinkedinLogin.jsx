import React, {Component} from "react";
import SocialButton from "./SocialButton";

import config from "../../config.json";
export default class LinkedinLogin extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SocialButton
        provider='linkedin'
        appId={config.linkedin_id}
        onLoginSuccess={this.props.onLoginSuccess}
        onLoginFailure={this.props.onLoginFailure}
      >{this.props.children || "Login With Linkedin"}</SocialButton>
    );
  }
}
