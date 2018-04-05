import React, {Component} from "react";
import SocialButton from "./SocialButton";

import config from "../../config.json";

export default class GoogleLogin extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SocialButton
        provider='google'
        appId={config.google_id}
        onLoginSuccess={this.props.onLoginSuccess}
        onLoginFailure={this.props.onLoginFailure}
      > {this.props.children || "Login With Google"}</SocialButton>
    );
  }
}
