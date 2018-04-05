import React, {Component} from "react";
import {Paper} from "material-ui";
import {Scrollbars} from "react-custom-scrollbars";

class CandidateProfile extends Component {

  render() {
    let {fullprofile} = this.props;

    if (!fullprofile || fullprofile === null) {
      return null;
    }
    let {profile, experiences, educations, skill_and_certifications, is_online} = fullprofile;

    if (!!experiences && experiences.length === 0) {
      experiences = undefined;
    }

    if (!!educations && educations.length === 0) {
      educations = undefined;
    }

    if (!!skill_and_certifications && skill_and_certifications.length === 0) {
      skill_and_certifications = undefined;
    }

    if (!profile) {
      return null;
    }

    let _mobile_status = null, _email_status = null;

    if (profile.is_mobile_verified) {
      _mobile_status = 'Verified';
    } else {
      _mobile_status = 'Not Verified';
    }

    if (profile.is_email_verified) {
      _email_status = 'Verified'
    } else {
      _email_status = 'Not Verified'
    }

    let getTableItem = (_header, _value) => {
      return (
        <div className="row">
          <div className="col-3">
            {_header}
          </div>
          <div className="col">
            {_value}
          </div>
        </div>
      )
    };

    let _section_elevation = 1;

    let _get_section_header = (_headerText) => {
      return (<div className="header">
        {_headerText}
      </div>);
    };

    const RenderExperience = (_exp, index) => {
      return (
        <div className="experience mb-16" key={index}>
          <div className="title">{_exp.designation}</div>
          <div className="companyName">{_exp.company}</div>
          {!!_exp.duration ? <div className="duration">{_exp.duration}</div> : null}
        </div>
      )
    };

    const RenderEducation = (_edu, index) => {
      return (
        <div className="experience mb-16" key={index}>
          <div className="title">{_edu.course}</div>
          <div className="companyName">{_edu.institute}</div>
          {!!_edu.duration ? <div className="duration">{_edu.duration}</div> : null}
        </div>
      )
    };

    let scrollBarsStyle = {
      position: 'relative',
      top: 0,
      bottom: '10px'
    };

    return (
      <Scrollbars style={scrollBarsStyle}>
        <Paper zDepth={_section_elevation} className="section mt-8">
          {!profile.dob_text ? null : getTableItem('DoB:', profile.dob_text)}
          {!profile.education ? null : getTableItem('Education:', profile.education)}
          {!profile.total_experience ? null : getTableItem('Total Workex:', profile.total_experience)}
          {!profile.company_name ? null : getTableItem('Last Company:', profile.company_name)}
          {!profile.gender ? null : getTableItem('Gender:', profile.gender)}
          {getTableItem('Mobile No:', _mobile_status)}
          {getTableItem('Email:', _email_status)}
        </Paper>

        { !!experiences ? (<Paper zDepth={_section_elevation} className="section"> {_get_section_header('Workex')}
          <div className="content">
            {experiences.map((e, index) => RenderExperience(e, index))}
          </div>
        </Paper>) : null}

        { !!educations ? (<Paper zDepth={_section_elevation} className="section"> {_get_section_header('Education')}
          <div className="content">
            {educations.map((e, index) => RenderEducation(e, index))}
          </div>
        </Paper>) : null}

        { !!skill_and_certifications ? (
          <Paper zDepth={_section_elevation} className="section"> {_get_section_header('Trainings & Certifications')}
            <div className="content">
              {skill_and_certifications.map((e, index) => RenderEducation(e, index))}
            </div>
          </Paper>) : null}

        { (!!profile.full_time_preferences && profile.full_time_preferences.length > 0) ? (
          <Paper zDepth={_section_elevation} className="section">
            {_get_section_header('Job Preferences')}
            <div className="content">
              {profile.full_time_preferences.map((p, index) => <span key={index}>{p.key}. </span>)}
            </div>
          </Paper>) : null
        }

        { (!!profile.languages && profile.languages.length > 0) ? (
          <Paper zDepth={_section_elevation} className="section">
            {_get_section_header('Languages')}
            <div className="content">
              {profile.languages.map((l, index) => <span key={index}>{l}. </span>)}
            </div>
          </Paper>) : null
        }
      </Scrollbars>
    );
  }
}

CandidateProfile.propTypes = {};
CandidateProfile.defaultProps = {};

export default CandidateProfile;
