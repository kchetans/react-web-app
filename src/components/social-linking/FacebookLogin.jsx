import React, {Component} from "react";
import SocialButton from "./SocialButton";
import config from "../../config.json";

export default class FacebookLogin extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SocialButton
        provider='facebook'
        appId={config.fb_id}
        onLoginSuccess={this.props.onLoginSuccess}
        onLoginFailure={this.props.onLoginFailure}
      > {this.props.children || "Login With Facebook"}</SocialButton>
    );
  }
}
