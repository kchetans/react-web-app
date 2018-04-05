import React, {Component} from "react";
import {Card, CardHeader} from "material-ui";
import FacebookLogin from "../../social-linking/FacebookLogin";
import LinkedinLogin from "../../social-linking/LinkedinLogin";
import {LINK_ACCOUNT} from "../../../constants/urls";
import ApiBuilder from "../../apiBuilder";
import {fetchMyProfile} from "../../../actions/my-profile";

class AccountLinking extends Component {


  onLoginSuccess = (user) => {
    let {_profile, _token, _provider} = user;
    let {accessToken, expiresAt} = _token;
    let {email, firstName, id, lastName, name, profilePicURL} = _profile;
    let linkedin_id, fb_id;
    _provider === "linkedin" ? linkedin_id = id : fb_id = id;
    ApiBuilder.fetch(ApiBuilder.getApi(LINK_ACCOUNT), {
      method: "POST",
      body: {
        name, email, profile_pic_url: profilePicURL, linkedin_id, fb_id,
        oauth_token: accessToken, provider: _provider
      }
    }).then(result => {
      fetchMyProfile();
    });
  };

  onLoginFailure = (error) => {

  };

  render() {
    let {linkedin_info, google_info, fb_info} = this.props;

    let fb_info_view = () => {
      if (fb_info) {
        let {name, profile_pic_url, email, mobile_no} = fb_info;
        return (
          <Card>
            <CardHeader title="Facebook" avatar={profile_pic_url}
                        subtitle={`${name} - ${email} - ${mobile_no}`}
            />
          </Card>
        );
      }
      else return (
        <FacebookLogin
          onLoginSuccess={this.onLoginSuccess}
          onLoginFailure={this.onLoginFailure}
        >
          Link Fb
        </FacebookLogin>
      )
    };

    let linkedin_info_view = () => {
      if (linkedin_info) {
        let {name, profile_pic_url, email, mobile_no} = linkedin_info;
        return (
          <Card>
            <CardHeader title="LinkedIn" avatar={profile_pic_url}
                        subtitle={`${name} - ${email} - ${mobile_no}`}
            />
          </Card>
        );
      }
      else return (
        <LinkedinLogin
          onLoginSuccess={this.onLoginSuccess}
          onLoginFailure={this.onLoginFailure}
        >
          Link Linkedin
        </LinkedinLogin>
      )
    };
    return (
      <div>
        <Card>
          <CardHeader title="Account Linking">
          </CardHeader>
          {linkedin_info_view()}
          {fb_info_view()}
        </Card>
      </div>
    );
  }
}

AccountLinking.propTypes = {};
AccountLinking.defaultProps = {};

export default AccountLinking;
