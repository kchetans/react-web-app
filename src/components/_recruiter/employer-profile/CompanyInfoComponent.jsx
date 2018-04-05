import React, {Component} from "react";
import {MY_PROFILE} from "../../../constants/urls";
import ApiBuilder from "../../apiBuilder";
import Store from "./../../../StoreProvider";
import {connect} from "react-redux";
import WxEditableLabel from "../../WxEditableLabel";
import _ from "lodash";
import {Card} from "material-ui";
import WxImgPreviewUploader from "../../WxImgPreviewUploader";
import AccountLinking from "../company-profile/AccountLinking";
import {fetchMyProfile} from "../../../actions/my-profile";


class CompanyInfoComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      my_profile: undefined,
      mode: 'display'       // Should be Either display or edit
    };
    this.debounceUpdateKey = _.debounce(this.updateProfileKey, 500);
  }

  componentDidMount() {
    if (!this.state.my_profile) {
      fetchMyProfile();
    }
  }

  updateProfileKey(key, value) {
    ApiBuilder.fetch(ApiBuilder.getApi(MY_PROFILE + "?full_profile=true"), {
      method: "PUT",
      body: {
        [key]: value
      }
    }).then(res => {
      Store.dispatch({
        type: 'my_profile',
        payload: res.data
      });
    });

  }

  render() {
    let {my_profile} = this.state;
    if (my_profile) {
      let {profile = {}} = my_profile;
      let {
        name, status, mobile_no, is_mobile_verified, email, gender, dob, profile_pic_url,
        cover_pic_url, education, languages, city, linkedin_info, google_info, fb_info
      } = profile;

      return (
        <div>
          <Card className="mb-16 p-4">
            <div className="row">
              <div className="col-2">
                <WxImgPreviewUploader
                  style={{width: 150, height: 150}}
                  imageUrl={profile_pic_url}
                  onChange={(response) => {
                    this.debounceUpdateKey("profile_pic_url", response.data.url);
                  }}
                />
              </div>
              <div className="col-10 pt-4">
                <WxEditableLabel
                  name="name"
                  ShowFloatingLabelText={false}
                  floatingLabelText="Name"
                  hintText="Enter Name"
                  value={name}
                  onChange={(e, v) => this.debounceUpdateKey("name", v)}
                />

                <WxEditableLabel
                  ShowFloatingLabelText={false}
                  floatingLabelText="Status"
                  name="status"
                  hintText="Enter Status"
                  value={status}
                  onChange={(e, v) => this.debounceUpdateKey("status", v)}
                />
              </div>
            </div>
            <br />
            {
              is_mobile_verified ?
                <div>
                  <span className="h6">Mobile No</span><br/>
                  <span>{mobile_no}</span>
                </div>
                :
                <WxEditableLabel
                  floatingLabelText="Mobile No"
                  name="mobile_no"
                  hintText="Enter Mobile No"
                  value={mobile_no}
                  onChange={(e, v) => this.debounceUpdateKey("mobile_no", v)}
                />
            }
            <br/>
            <WxEditableLabel
              floatingLabelText="Email"
              name="email"
              hintText="Enter Email"
              value={email}
              onChange={(e, v) => this.debounceUpdateKey("email", v)}
            />
            <br />
            <WxEditableLabel
              name="city"
              floatingLabelText="City"
              hintText="Enter City"
              value={city}
              onChange={(e, v) => this.debounceUpdateKey("city", v)}
            />
            <br />
            <WxEditableLabel
              name="gender"
              floatingLabelText="Gender"
              hintText="Enter Gender"
              onChange={(e, v) => this.debounceUpdateKey("gender", v)}
              value={gender}
            />
          </Card>
          <AccountLinking linkedin_info={linkedin_info} google_info={google_info} fb_info={fb_info}/>
        </div>
      );
    } else {
      return (
        <div>
          Loading...
        </div>
      )
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props !== nextProps && nextProps.my_profile) {
      this.setState({my_profile: nextProps.my_profile})
    }
  }
}

function mapStateToProps(state) {
  return {
    my_profile: state.profile.my_profile
  }
}

export default connect(mapStateToProps)(CompanyInfoComponent);
