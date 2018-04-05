import React, {Component} from "react";
import {Card, CardHeader} from "material-ui";
import WxEditableLabel from "../../WxEditableLabel";
import _ from "lodash";

let socialJson = [
  {
    name: 'facebook_page',
    floatingLabelText: 'Facebook Page',
    hintText: 'Enter Facebook Page',
  }, {
    name: 'twitter_handle',
    floatingLabelText: 'Twitter Handle',
    hintText: 'Enter Twitter Handle',
  }, {
    name: 'instagram_page',
    floatingLabelText: 'Instagram Page',
    hintText: 'Enter Instagram Page',
  }, {
    name: 'blog_url',
    floatingLabelText: 'Blog Url',
    hintText: 'Enter Blog Url',
  }, {
    name: 'linkedin_url',
    floatingLabelText: 'Linkedin Url',
    hintText: 'Enter Linkedin Url',
  },
];

class CompanySocialInfo extends Component {

  constructor(props) {
    super(props);
    this.debounceUpdateKey = _.debounce(this.updateProfileKey, 500);
  }

  updateProfileKey(key, value) {
    let social_profiles = this.props.social_profiles || {};
    social_profiles[key] = value;
    if (this.props.updateSocialProfile)
      this.props.updateSocialProfile(social_profiles);
  }


  render() {
    let social_profiles = this.props.social_profiles || {};
    let inputFields = _.map(socialJson, (item, index) => {
      let {
        name, floatingLabelText, hintText
      } = item;
      let value = social_profiles[name];
      return (
        <div key={index}>
          <WxEditableLabel
            name={name}
            floatingLabelText={floatingLabelText}
            hintText={hintText}
            value={value}
            onChange={(e, v) => this.debounceUpdateKey(name, v)}
          />
          <br/>
        </div>
      )
    });
    return (
      <Card>
        <CardHeader title="Social info">
          <br/><br/>
          {inputFields}
        </CardHeader>
      </Card>
    );
  }
}

CompanySocialInfo.propTypes = {};
CompanySocialInfo.defaultProps = {};

export default CompanySocialInfo;
