import React, {Component} from "react";
import Paper from "material-ui/Paper";
import ApiBuilder from "../../apiBuilder.js";
import {Tab, Tabs} from "material-ui/Tabs";
import CandidateDetails from "../../_recruiter/people/components/CandidateDetails";
import _ from "lodash";
import PeopleHeaderForATS from "./PeopleHeaderForATS";
import {eventEmitter} from "../../../dispatcher";
import {EMP_JOB_DETAIL, getRedefineUrl, PEOPLES} from "../../../constants/urls";
import {HIDE_PROGRESS_BAR, SHOW_PROGRESS_BAR} from "../../../constants/events";
import {CircularProgress} from "material-ui";
import LoaderCard from '../../_common/LoaderCard';
import {Scrollbars} from "react-custom-scrollbars";

let APPLIED_TAB = 'applied';
let SHORTLISTED_TAB = 'matched';
let SEARCH_TAB = 'recommended';

export default class JobATSPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading_job_detail: false,
      loading_peoples: false,
      is_error: false,
      tab: APPLIED_TAB,
      selected_people: undefined,
      applied: [],
      matched: [],
      recommended: [],
    };
  }

  componentDidMount() {
    let job_id = ApiBuilder.getUrlParameter('job_id');
    if (!job_id) {
      this.props.history.push('/myjobs');
    }
    let tab = ApiBuilder.getUrlParameter('tab') || APPLIED_TAB;
    this.setState({job_id, tab});
    this.fetchJobDetails(job_id);
    this.fetch_people({tab, job_id});
  }

  fetchJobDetails = (job_id) => {
    this.setState({loading_job_detail: true});
    eventEmitter.emit(SHOW_PROGRESS_BAR);
    ApiBuilder.fetch(ApiBuilder.getApi(getRedefineUrl(EMP_JOB_DETAIL, {job_id}))).then(res => {
      this.setState({job: res.data});
    })
      .catch(err => {
        this.setState({is_error: true});
      })
      .then(res => {
        this.setState({loading_job_detail: false});
        eventEmitter.emit(HIDE_PROGRESS_BAR);
      });
  };

  fetch_people(args) {
    let {tab: _tab = this.state.tab, job_id = this.state.job_id, pageNo = 0, pageSize = 15} = args;
    let state = _tab;
    this.setState({loading_peoples: true});
    ApiBuilder.fetch(ApiBuilder.getApi(getRedefineUrl(PEOPLES, {state, job_id, pageNo, pageSize}))).then((res) => {
      let _stateParams = {};
      if (res.data.people.length === 0)
        _stateParams['no_more_people' + _tab] = true;
      _stateParams[_tab] = this.state[_tab].concat(res.data.people);
      if (res.data.people.length > 0) _stateParams['selected_people'] = res.data.people[0];
      // Select the first element by default;
      this.setState({currentPage: res.data.meta.pageNo});
      this.setState(_stateParams);
    }).catch(err => {
      this.setState({is_error: true});
    }).then(res => {
      this.setState({loading_peoples: false});
      eventEmitter.emit(HIDE_PROGRESS_BAR);
    });
  }

  handleUpdate = (values) => {
    const {scrollTop, scrollHeight, clientHeight} = values;
    const pad = 300;
    const t = ((scrollTop + pad) / (scrollHeight - clientHeight));
    if (t > 1 && t !== Infinity && !this.state.loading_peoples && !this.state['no_more_people' + this.state.tab])
      this.fetch_people({pageNo: this.state.currentPage + 1});
  };

  handleTabChange = (_value) => {
    let _stateArgs = {tab: _value};
    if (this.state[_value].length === 0) {
      _stateArgs.selected_people = undefined;
      this.fetch_people({tab: _value});
    } else {
      if (this.state[_value].length > 0) _stateArgs.selected_people = this.state[_value][0];
    }
    this.setState(_stateArgs);
  };

  render() {
    let getJobSummary = () => {
      let {loading_job_detail, job} = this.state;
      if (loading_job_detail) {
        return ( <div><CircularProgress size={80} thickness={5}/></div> )
      }
      if (job) {
        let _zdepth = 1;
        return (
          <div>
            <Paper zDepth={_zdepth} className="mb-16"> <img alt="this.state.job.description" src={this.state.job.cover_pic_url} width="100%"/>
              <div className="p-3">
                <div className="time"> {this.state.job.time} </div>
                <h6>{this.state.job.description}</h6>
                <div>{this.state.job.city}</div>
                <div>{this.state.job.compensation}</div>
              </div>
            </Paper>
            <Paper zDepth={_zdepth} className="mb-16 p-16"
                          onTouchTap={() => this.handleTabChange(APPLIED_TAB)}> {job.stats.applications} Applied </Paper>
            <Paper zDepth={_zdepth} className="mb-16 p-16"
                   onTouchTap={() => this.handleTabChange(SHORTLISTED_TAB)}> {job.stats.matched} Shortlisted </Paper>
            <Paper zDepth={_zdepth} className="mb-16 p-16"
                   onTouchTap={() => this.handleTabChange(SEARCH_TAB)}> {job.stats.recommended} Candidates </Paper>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="job-ats-page">
      <div className="row">
        <div className="col1 col-2 p-1"> {getJobSummary()} </div>
        <div className="col2 col-4 p-1 ph-8">
          <Paper className="w-100 h-100">
            <Tabs value={this.state.tab}
                  inkBarStyle={{background: 'white', height: '5px'}}
                  tabItemContainerStyle={{backgroundColor: '#f62424'}}
                  contentContainerClassName="candidates-tab-container"
                  tabTemplateStyle={{height: '100%'}}
                  onChange={this.handleTabChange} className="tabs">
              <Tab label="Applied" value={APPLIED_TAB}>
                  {this.getTabView(APPLIED_TAB)}
              </Tab>
              <Tab label="Shortlisted" value={SHORTLISTED_TAB}>
                {this.getTabView(SHORTLISTED_TAB)}
              </Tab>
              <Tab label="Candidates" value={SEARCH_TAB}>
                {this.getTabView(SEARCH_TAB)}
              </Tab>
            </Tabs>
          </Paper>
        </div>
        <div className="col3 col-6 p-1 ph-8">
          <Paper className="p-0 w-100 h-100">
            <CandidateDetails info={this.state.selected_people} job_id={this.state.job_id}/>
          </Paper>
        </div>
      </div>
    </div> );
  }

  getNoRecordsFoundCard = () => {
    return (
      <Paper zDepth={0} className="p-16">
        <h4>No Records Found</h4>
      </Paper>
    )
  };

  getTabView = (stateToShow) => {
    let {loading_peoples} = this.state;
    let people = this.state[stateToShow] || [];

    let scrollBarsStyle = {
      position: 'absolute',
      top: 0,
      bottom: 0
    };

    if (loading_peoples || (people && people.length !== 0)) {
      return (
        <Scrollbars className="scrollbars"
                    style={scrollBarsStyle}
                    onUpdate={this.handleUpdate}>
          {
            _.map(people, (_info, index) => <PeopleHeaderForATS className="hand"
                                                                info={_info} key={index}
                                                                onClick={() => {
                                                                  this.setState({selected_people: _info})
                                                                }}/>)
          }
          {loading_peoples ? <LoaderCard /> : ""}
        </Scrollbars>
      );
    }
    else
      return this.getNoRecordsFoundCard();
  }
}
