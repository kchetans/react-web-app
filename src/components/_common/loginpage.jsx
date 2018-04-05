import React, {Component} from "react";
import TextField from "material-ui/TextField";
import Checkbox from "material-ui/Checkbox";
import RaisedButton from "material-ui/RaisedButton";
import {setAccessToken} from "../../AuthService.js";
import {connect} from "react-redux";
import ApiBuilder from "../apiBuilder.js";
import LinkedinLogin from "../social-linking/LinkedinLogin";
import FacebookLogin from "../social-linking/FacebookLogin";
import {fireLoginEventTrack} from "../../analytics/analytics";
import {CONFIRM_OTP, REQUEST_OTP} from "../../constants/ga";
import {FB_LOGIN, GOOGLE_LOGIN, LINKEDIN_LOGIN} from "../../constants/urls";
import GoogleLogin from "../social-linking/GoogleLogin";
import {isLoggedIn, setUserInfo} from "../../AuthService";
import {Redirect} from "react-router-dom";

class LoginPage extends Component {

  constructor(props) {
    super(props);
    let _state = {
      status: 'default',
      errors: {}
    };
    this.state = _state;
  }

  checkMobileValid = () => {
    let _mobileNo = this.refs.mobile_no.getValue();
    if (_mobileNo === null || _mobileNo === '') {
      this.setState({errors: {mobile_error: 'Mobile No. is Required'}});
      return false;
    }
    if (_mobileNo.length !== 10) {
      this.setState({errors: {mobile_error: 'Mobile No. has to be 10 digits long'}});
      return false;
    } else {
      this.setState({errors: {}});
    }
    return true;
  };

  request_otp = () => {
    let _mobileNo = this.refs.mobile_no.getValue();
    fireLoginEventTrack(REQUEST_OTP, _mobileNo);
    this.setState({'mobile_no': _mobileNo});

    let _url_request_otp = ApiBuilder.getApi('/workexnow/v1/users/send-otp');

    let fetch_request_otp = () => {

      ApiBuilder.fetch(_url_request_otp, {
        method: 'POST',
        body: {
          mobile_no: _mobileNo,
          roles: 'employer'
        }
      }).then(result => {
        this.setState({status: 'otp_requested'});
      })
        .catch((err) => {
          if (err.errors && err.errors.length > 0) {
            this.setState({errors: {mobile_error: err.errors[0]['message']}});
          }
        });
    };

    if (this.checkMobileValid()) {
      fetch_request_otp();
    }
  };

  confirm_otp = () => {
    let _otp = this.refs.otp.getValue();
    // let _rem_me = this.refs.rem_me.isChecked();
    fireLoginEventTrack(CONFIRM_OTP, this.state.mobile_no);

    let _url_confirm = ApiBuilder.getApi('/workexnow/v1/users/confirm-otp');
    ApiBuilder.fetch(_url_confirm, {
      method: 'POST',
      body: {
        otp: _otp,
        roles: 'employer',
        mobile_no: this.state.mobile_no
      }
    })
      .then(result => {
        setAccessToken(result.data.token);

        this.props.setLogin(result.data.user._id, result.data.token);
        setUserInfo(result.data.user)
        window.location = '/';
        // console.log('login result', result)
      }).catch(error => {
      console.log(error);
    });
  };

  handleSocialLogin = (user) => {
    console.log("user", JSON.stringify(user));
    let {_profile, _token, _provider} = user;
    let {accessToken: access_token, expiresAt} = _token;
    let {email, id, name, profilePicURL} = _profile;
    let linkedin_id, fb_id, google_id;
    let url = "";
    let oauth_token = access_token;
    if (_provider === "linkedin") {
      url = LINKEDIN_LOGIN;
      linkedin_id = id;
    } else if (_provider === "facebook") {
      url = FB_LOGIN;
      fb_id = id;
    } else {
      oauth_token = undefined;
      url = GOOGLE_LOGIN;
      google_id = id;
    }
    ApiBuilder.fetch(ApiBuilder.getApi(url), {
      method: "POST",
      body: {
        name, email, profile_pic_url: profilePicURL, linkedin_id, fb_id, roles: "employer",
        oauth_token, access_token, google_id
      }
    }).then(result => {
      fireLoginEventTrack(_provider, email);
      setAccessToken(result.data.token);
      // alert('handling social login' + result.data.user._id)
      this.props.setLogin(result.data.user._id, result.data.token);
      window.location = '/';
    });
  };

  onLoginFailure = (err) => {
    console.log("err", err);
  };

  //<a href="">Forgot Password?</a>
  render() {

    if (isLoggedIn()) {
      return <Redirect to="/" push={true}/>
    }

    let request_otp_block = () => {
      if (this.state.status === 'default') {
        return (
          <div>
            <TextField
              id="name" name="mobile"
              ref="mobile_no"
              errorText={this.state.errors.mobile_error} onChange={this.checkMobileValid}
              floatingLabelText="Mobile No"
              fullWidth={true}
            />
            <div className="pt20">
              <RaisedButton label="Request OTP" primary={true} fullWidth={true} onClick={this.request_otp}/>
            </div>
            <div >
              <LinkedinLogin
                onLoginFailure={this.onLoginFailure}
                onLoginSuccess={this.handleSocialLogin}
              >
                <a className="hand btn btn-lg btn-block mt-3" style={{background: "#0077B5"}}>
                  <i className="fa fa-linkedin text-white p-2"/>
                  <span className="hidden-xs-down text-white">Linkedin</span>
                </a>
              </LinkedinLogin>
              <FacebookLogin
                onLoginFailure={this.onLoginFailure}
                onLoginSuccess={this.handleSocialLogin}
              >
                <a className="hand btn btn-lg btn-block mt-3" style={{background: "#3b5998"}}>
                  <i className="fa fa-facebook text-white m-2"/>
                  <span className="hidden-xs-down text-white">Facebook</span>
                </a>
              </FacebookLogin>
              <GoogleLogin
                onLoginFailure={this.onLoginFailure}
                onLoginSuccess={this.handleSocialLogin}
              >
                <a className="hand btn btn-lg btn-block mt-3" style={{background: "#c32f10"}}>
                  <i className="fa fa-google-plus text-white m-2"/>
                  <span className="hidden-xs-down text-white">Google+</span>
                </a>
              </GoogleLogin>
            </div>
          </div>
        );
      } else if (this.state.status === 'otp_requested') {
        return <div>OTP Request Sent! Please Wait!</div>
      }
    };

    let confirm_otp_block = () => {
      if (this.state.status === 'otp_requested') {
        return (
          <div>
            <TextField
              id="pass"
              ref="otp"
              floatingLabelText="OTP"
              fullWidth={true}
            />
            <div className="pt20">
              <Checkbox defaultChecked={true} ref="rem_me"
                        label="Remember Me"
              />
            </div>
            <div className="pt20">
              <RaisedButton label="Confirm OTP" primary={true} fullWidth={true} onClick={this.confirm_otp}/>
            </div>
          </div>
        );
      }
    };

    return (
      <div>
        <div className="login-wrapper">
          <div className="login-fields">
            <h3>Login</h3>
            {request_otp_block()}
            {confirm_otp_block()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {}
};

const matchDispatchToProps = (dispatch) => {
  return {
    setLogin: (_user_id, token, args = undefined) => {
      dispatch({
        type: 'login',
        user_id: _user_id,
        token: token,
        args: args
      });
    }
  }
};

export default connect(mapStateToProps, matchDispatchToProps)(LoginPage);
