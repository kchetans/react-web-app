import React, {Component} from "react";
import {Card} from "material-ui/Card";
import {ORG_PROFILE} from "../../../constants/urls";
import ApiBuilder from "../../apiBuilder";
import Store from "./../../../StoreProvider";
import {connect} from "react-redux";
import WxEditableLabel from "../../WxEditableLabel";
import _ from "lodash";
import WxImgPreviewUploader from "../../WxImgPreviewUploader";
import CompanySocialInfo from "./CompanySocialInfo";


class CompanyInfoComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      is_company_profile_exist: true,
      company_profile: undefined,
      is_loading: true
    };
    this.debounceUpdateKey = _.debounce(this.updateProfileKey, 500);
  }

  componentDidMount() {
    if (!this.state.company_profile) {
      ApiBuilder.fetch(ApiBuilder.getApi(ORG_PROFILE))
        .then(res => {
          this.setState({is_loading: false});
          Store.dispatch({
            type: 'company_profile',
            payload: res.data
          });
        }).catch(err => {
        this.setState({is_loading: false});
        this.setState({is_company_profile_exist: false});
      });
    }
  }


  updateProfileKey(key, value) {
    let {is_company_profile_exist} = this.state;
    ApiBuilder.fetch(ApiBuilder.getApi(ORG_PROFILE), {
      method: !is_company_profile_exist ? "POST" : "PUT",
      body: {
        [key]: value
      }
    }).then(res => {
      this.setState({is_company_profile_exist: true});
      Store.dispatch({
        type: 'company_profile',
        payload: res.data
      });
    });

  }

  render() {
    let {company_profile, is_loading} = this.state;
    if (!is_loading) {

      let {name, info, lob, about, logo_url: logo, social_profiles} = company_profile || {};
      return (
        <div>
          <Card className="mb-16 p-4">
            <div className="row">
              <div className="col-2">
                <WxImgPreviewUploader
                  style={{width: 150, height: 150}}
                  imageUrl={logo}
                  onChange={(response) => {
                    this.debounceUpdateKey("logo_url", response.data.url);
                  }}
                />
              </div>
              <div className="col-10 pt-4">
                <WxEditableLabel
                  ShowFloatingLabelText={false}
                  name="name"
                  floatingLabelText="Company Name"
                  hintText="Enter Company Name"
                  value={name}
                  onChange={(e, v) => this.debounceUpdateKey("name", v)}
                />
                <br/>
                <WxEditableLabel
                  ShowFloatingLabelText={false}
                  floatingLabelText="Line Of Business"
                  name="lob"
                  hintText="Enter Line Of Business"
                  value={lob}
                  onChange={(e, v) => this.debounceUpdateKey("lob", v)}
                />
              </div>
            </div>
            <br /><br />
            <WxEditableLabel
              multiLine={true}
              name="about"
              floatingLabelText="About Company"
              hintText="Enter About Company"
              value={about}
              onChange={(e, v) => this.debounceUpdateKey("about", v)}
            />
            <br/>
          </Card>
          <CompanySocialInfo
            social_profiles={social_profiles}
            updateSocialProfile={(social_profiles) => this.debounceUpdateKey("social_profiles", social_profiles)}
          />
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
    if (this.props !== nextProps && nextProps.company_profile) {
      this.setState({company_profile: nextProps.company_profile})
    }
  }
}

function mapStateToProps(state) {
  return {
    company_profile: state.profile.company_profile
  }
}

export default connect(mapStateToProps)(CompanyInfoComponent);
