import React, {Component} from "react";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import {RadioButton, RadioButtonGroup} from "material-ui/RadioButton";
import ApiBuilder from "../../apiBuilder.js";
import {Redirect} from "react-router";
import update from "immutability-helper";
import Autocomplete from "react-google-autocomplete";
import _ from "lodash";
import Store from "./../../../StoreProvider";
import {connect} from "react-redux";
import {JobCardPreview} from "./JobCardPreview";
import {MY_PROFILE, ORG_PROFILE} from "../../../constants/urls";
import {fireEventTrack} from "../../../analytics/analytics";
import {POST_JOB} from "../../../constants/ga";
import PromoteJob from "./PromoteJob";


let defaultJobState = {
  cover_pic_url: "https://s3.ap-south-1.amazonaws.com/app-util-images/Others.png",
  title: 'Cook Required for 2 people, 2 times daily, North-Indian Dishes!',
  description: "",
  category_display: 'Others',
  category_id: 'others',
  city: 'Bengaluru',
  compensation: 'Rs. 12000 / Month',
  type_id: 'full_time',
  type_display: 'Full Time',
  recruiter_name: '',
  recruiter_mobile: '',
  recruiter_email: '',
  companyName: ''
};

class PostJobComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      company_profile: undefined,
      user_profile: undefined,
      categories: [],
      category: 'others',
      info: defaultJobState,
      saving: false,
      loading: false,
      showPromoteDialog: false,
      job_posted: {}
    }
  }

  componentDidMount() {
    this.load_categories_master();
    this.getCompanyAndUserProfile();
    this.fetch_cover_pic();
    this.fetchCurrentLocation();
  }

  fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        let {info} = this.state;
        let newJobPosting = _.clone(info);
        newJobPosting.location = {lat, lng};
        this.setState({info: newJobPosting});

        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCpSom-2YkkkeOa_GkMt396mXRhdmZowJI`)
          .then(res => res.json())
          .then(res => {
            if (res && res.results && res.results.length > 0) {
              let address = res.results[0].formatted_address;
              let {info} = this.state;
              let newJobPosting = _.clone(info);
              newJobPosting.address = address;

              let city = "";
              if (res.results[0].address_components) {
                for (let i = 0, len = res.results[0].address_components.length; i < len; i++) {
                  let ac = res.results[0].address_components[i];
                  if (ac.types.indexOf("locality") >= 0) {
                    city = ac.short_name;
                    newJobPosting.city = city;
                  }
                }
              }

              this.setState({info: newJobPosting});
            }
          });
      });
    }
  };

  getCompanyAndUserProfile = () => {
    let {company_profile, user_profile} = this.state;
    if (!user_profile) {
      ApiBuilder.fetch(ApiBuilder.getApi(ORG_PROFILE))
        .then(res => {
          Store.dispatch({
            type: 'company_profile',
            payload: res.data
          });
        });
      ApiBuilder.fetch(ApiBuilder.getApi(MY_PROFILE))
        .then(res => {
          Store.dispatch({
            type: 'my_profile',
            payload: res.data
          });
        });
    }
  };

  componentWillReceiveProps(nextProps, nextContext) {
    let {info} = this.state;
    if (this.props !== nextProps && nextProps.company_profile) {
      let company_profile = nextProps.company_profile;
      this.setState({
        company_profile: nextProps.company_profile,
        info: update(info, {companyName: {$set: company_profile.name}})
      })
    }
    if (this.props !== nextProps && nextProps.my_profile) {
      let my_profile = nextProps.my_profile;
      let {profile = {}} = my_profile || {};
      let company_profile = nextProps.company_profile || {};
      this.setState({
        my_profile: nextProps.my_profile,
        info: update(info, {
          recruiter_name: {$set: profile.name},
          recruiter_mobile: {$set: profile.mobile_no},
          recruiter_email: {$set: profile.email},
          companyName: {$set: company_profile.name}
        })
      })
    }
  }

  fetch_cover_pic = () => {
    if (this.state.info.category_id) {
      let url = ApiBuilder.getApi('/workexnow/v1/jobs/categories/' + this.state.info.category_id + '/images');
      ApiBuilder.fetch(url)
        .then(res => {
          let _info = this.state.info;
          _info.cover_pic_url = res.data;
          this.setState({info: _info});
        }).catch((err) => {
        console.error(err);
      })
    }
  };

  load_categories_master = () => {
    let url = ApiBuilder.getApi(ApiBuilder.PATH_GET_CATEGORIES_MASTER);
    ApiBuilder.fetch(url)
      .then((res) => {
        this.setState({categories: res.data});
      }).catch((err) => {
      //todo: Handle Error
      console.error(err);
    });
  };

  post_on_server = () => {
    let url = ApiBuilder.getApi(ApiBuilder.PATH_POST_NEW_JOB);
    let _info = this.state.info;
    if (!_info.recruiter_name) {
      this.setState({name_required: true});
      return;
    }
    let _payload = {};
    //todo: validate Payload before posting the job

    _payload.description = _info.title;
    _payload.name = _info.recruiter_name;
    _payload.cover_pic_url = _info.cover_pic_url;
    _payload.category = _info.category_id;
    _payload.compensation = _info.compensation;
    _payload.type = _info.type_id;
    _payload.city = _info.city;
    _payload.location = _info.location;
    _payload.mobile_no = _info.recruiter_mobile;

    ApiBuilder.fetch(url, {
      method: 'POST',
      body: _payload
    }).then(res => {
      console.log("res.data", res.data);
      this.setState({navigate_my_jobs: false, showPromoteDialog: true, job_posted: res.data});
    }).catch(err => {
      console.error(err);
    });
  };

  validateStep = () => {
    let {info} = this.state;
    switch (this.state.step) {
      case 0:
        return info.category_id;
      case 1:
        return true;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return true;
    }
  };

  onNextClick = () => {
    fireEventTrack(POST_JOB, "next", this.state.step);
    if (this.validateStep()) {
      if (this.state.step === 4) {
        this.post_on_server();
      } else {
        let newState = {step: this.state.step + 1};
        if (newState.step === 3)
          newState.step = 4;
        this.setState(newState);
      }
    }
  };

  onBackClicked = () => {
    fireEventTrack(POST_JOB, "back", this.state.step);
    if (this.state.step === 0)
      return;
    let newState = {step: this.state.step - 1};
    if (newState.step === 3)
      newState.step = 2;
    this.setState(newState);
  };

  SelectCategoryComponent = () => {
    let getCategoriesView = this.state.categories.map((c) => {
      let classNames = 'chip-selector';
      if (c.value === this.state.category) {
        classNames = 'chip-selector selected';
      }
      // Handle When a Category is Selected
      let clickHandler = () => {
        fireEventTrack(POST_JOB, "category_change", c.key);
        let _info = this.state.info;
        _info.category_display = c.key;
        _info.category_id = c.value;
        this.setState({category: c.value, info: _info});
        this.fetch_cover_pic();
      };

      return (
        <div className={classNames} onClick={clickHandler} key={c.key}>
          {c.key}
        </div>
      );
    });

    return (
      <div>
        <h3>What you are hiring for?</h3>
        <div style={{'display': 'flex', 'flexWrap': 'wrap'}}>
          {getCategoriesView}
        </div>
      </div>
    );
  };

  onInputChanged = (e) => {
    let _info = this.state.info;
    if (e.target.name === 'title')
      _info.title = e.target.value;
    else if (e.target.name === 'location')
      _info.city = e.target.value;
    else if (e.target.name === 'job_type') {
      _info.type_id = e.target.value;
      _info.type_display = _info.type_id === 'full_time' ? 'Full Time' : 'Part Time';
      // todo: May need to change this logic, if you add more options in job type
    }
    else if (e.target.name === 'company_name')
      _info.companyName = e.target.value;
    else if (e.target.name === 'company_about')
      _info.companyAbout = e.target.value;
    else if (e.target.name === 'coverpic')
      _info.coverpic = e.target.value;
    else
      _info[e.target.name] = e.target.value;
    this.setState({info: _info});
  };

  handleOnPlaceSelected = (place) => {
    let {info} = this.state;
    let newJobPosting = _.clone(info);
    if (place) {
      if (place.address_components) {
        let city = "";
        for (let i = 0, len = place.address_components.length; i < len; i++) {
          let ac = place.address_components[i];
          if (ac.types.indexOf("locality") >= 0) {
            city = ac.short_name;
            newJobPosting.city = city;
          }
        }
      }
      if (place.geometry) {
        let formatted_address = place.formatted_address;
        let lat = place.geometry.location.lat();
        let lng = place.geometry.location.lng();
        newJobPosting.location = {lat, lng};
        newJobPosting.address = formatted_address;
        this.setState({info: newJobPosting});
      }
    }
  };

  SelectJobDetails = () => {

    return (
      <div>
        <h3> Please Enter Job Details ...</h3>
        <TextField onChange={this.onInputChanged} name="title" value={this.state.info.title}
                   hintText="eg. Need a Delivery boy for Flipkart, No Experience Required, Need to have Bike & Smartphone, Good Incentives"
                   floatingLabelText="Please Enter Job Description" multiLine={true} rows={2} fullWidth/>

        <div style={{paddingTop: 10}}>
          <span style={{color: "rgba(0, 0, 0, 0.298039)"}}>Address</span>
          <Autocomplete
            style={{
              width: '100%',
              padding: '16px 8px 8px 8px',
              marginBottom: '16px',
              border: '1px solid white',
              borderBottom: '1px solid gray'
            }}
            defaultValue={this.state.info.city}
            onPlaceSelected={this.handleOnPlaceSelected}
            types={['(cities)']}
            componentRestrictions={{country: "in"}}
          />
        </div>

        <TextField onChange={this.onInputChanged} name="compensation" value={this.state.info.compensation}
                   hintText="Enter Compensation like Rs. 12,000 Per Month" floatingLabelText="Compensation" fullWidth/>
        <div style={{'marginTop': '24px'}}>
          <RadioButtonGroup name="job_type" defaultSelected={this.state.info.type_id} onChange={this.onInputChanged}>
            <RadioButton value="full_time" label="Full Time"/>
            <RadioButton value="part_time" label="Part Time"/>
          </RadioButtonGroup>
        </div>
      </div>
    );
  };

  SetCompanyDetails = () => {
    return (
      <div>
        <h3>Please Enter Your Company Details</h3>
        <TextField fullWidth floatingLabelText="Enter Your Company/Business Name"
                   name="company_name" onChange={this.onInputChanged} value={this.state.info.companyName}/>
        <TextField fullWidth multiLine={true} rows={2} onChange={this.onInputChanged}
                   floatingLabelText="Would you like to share about your company?"
                   hintText="Please share what you would to share with the potential candidates"
                   name="company_about" value={this.state.info.companyAbout}/>
      </div>
    )
  };

  SelectCoverPic = () => {

    let _imagePreview = () => {
      if (this.state.info.coverpic) {
        return <img src={this.state.info.coverpic}/>;
      } else {
        return null;
      }
    };

    return (
      <div>
        <h3>Picture Speaks More than 1000 Words!</h3>
        <h5>Upload a Photo now ...</h5>

        <input className="imageContainer" type="file" name="coverpic" onChange={this.onInputChanged}/>

        <div className="imgPreview">
          {_imagePreview()}
        </div>
      </div>
    );
  };

  SetAboutYourSelf = () => {
    return (
      <div>
        <h3>Mention about Yourself?</h3>
        <TextField floatingLabelText="Your Name*" name="recruiter_name"
                   hintText="Enter Name"
                   errorText={ this.state.name_required ? "Name is required" : ""}
                   value={this.state.info.recruiter_name} fullWidth onChange={this.onInputChanged}/>
        <TextField floatingLabelText="Mobile No"
                   value={this.state.info.recruiter_mobile} name="recruiter_mobile" fullWidth
                   onChange={this.onInputChanged}/>
        <TextField floatingLabelText="Email Address"
                   value={this.state.info.recruiter_email} name="recruiter_email" fullWidth
                   onChange={this.onInputChanged}/>
        <div className="hint">Your Mobile No & Email information will not be shared.</div>
      </div>
    );
  };

  GetBreadCumb = () => {
    let titles = ['Categories', 'Description', 'Company', 'Cover Photo', 'Yourself'];

    let _getIcon = () => {
      return (<i className="material-icons">chevron_right</i>); //<Icon color="error" style={{ fontSize: 36 }}>chevron_right</Icon>
    };

    let _getComponent = (_step) => {
      let _classnames = 'item';
      if (_step === this.state.step) {
        _classnames = 'item selected';
      }
      return <span className={_classnames}>{titles[_step]}</span>;
    };

    return (
      <div className="breadcumb">
        {_getComponent(0)} {_getIcon()}
        {_getComponent(1)} {_getIcon()}
        {_getComponent(2)} {_getIcon()}
        {_getComponent(4)}
      </div>
    );
  };

  render() {
    let {navigate_my_jobs = false, showPromoteDialog = false} = this.state;
    if (navigate_my_jobs) {
      return <Redirect to="/myjobs" push={true}/>
    }

    let main_container = {
      height: '90%',
      padding: '0rem 1.8rem '
    };

    let style_left_container = {
      display: 'block',
      padding: '16px'
    };

    let style_right_container = {
      display: 'block',
      padding: '16px',
    };

    let renderComponent = () => {
      switch (this.state.step) {
        case 0:
          return this.SelectCategoryComponent();
        case 1:
          return this.SelectJobDetails();
        case 2:
          return this.SetCompanyDetails();
        case 3:
          return this.SelectCoverPic();
        case 4:
          return this.SetAboutYourSelf();
      }
    };

    let getBackButton = () => {
      if (this.state.step === 0)
        return null;
      return (
        <RaisedButton label="Back" labelPosition="before"
                      secondary={true} onClick={this.onBackClicked}/>
      );
    };

    let getNextButton = () => {
      if (this.state.step < 4) {
        return (
          <RaisedButton label="Next" labelPosition="before"
                        primary={true} onClick={this.onNextClick}/>
        );
      }
      if (this.state.step === 4) {
        return (
          <RaisedButton label="Finish" labelPosition="before"
                        primary={true} onClick={this.onNextClick}/>
        );
      }
    };

    return (
      <div className="post-job">
        <div className='row' style={main_container}>
          <div className='col-6' style={style_left_container}>
            { this.GetBreadCumb() }
            <div style={{'display': 'block', 'marginTop': '16px'}}/>
            { renderComponent() }
            <div className="footer">
              <div style={{width: '100%', marginTop: '16px', padding: '16px', borderTop: '1px solid lightgray'}}>
                <div className="row">
                  <div className="col">
                    {getBackButton()}
                  </div>
                  <div className="col">
                  </div>
                  <div className="col">
                  </div>
                  <div className="col">
                    { getNextButton() }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-6' style={style_right_container}>
            <h6 className="postingPreviewTitle">Posting Preview:</h6>
            <JobCardPreview info={this.state.info}/>
          </div>
        </div>
        <PromoteJob showPromote={showPromoteDialog} job={this.state.job_posted}
                    onClose={() => this.setState({navigate_my_jobs: true})}/>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    company_profile: state.profile.company_profile,
    my_profile: state.profile.my_profile
  }
}

export default connect(mapStateToProps)(PostJobComponent);
