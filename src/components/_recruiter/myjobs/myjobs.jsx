import React, {Component} from "react";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import Paper from "material-ui/Paper";
import Popover from "material-ui/Popover";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import ApiBuilder from "../../apiBuilder.js";
import update from "immutability-helper";
import {eventEmitter} from "../../../dispatcher";
import _ from "lodash";
import {HIDE_PROGRESS_BAR, SHOW_PROGRESS_BAR} from "../../../constants/events";
import {MY_JOBS} from "../../../constants/urls";
import {DropDownMenu} from "material-ui/DropDownMenu/index";
import {Scrollbars} from "react-custom-scrollbars";
import MyJobHeaderDisplay from "./MyJobHeaderDisplay";
import NoJobsFoundMessage from "./noJobsFoundMessage";
import LoaderCard from "../../_common/LoaderCard";
import {fireEventTrack, fireNavigationEventTrack} from "../../../analytics/analytics";
import {FILTER, MY_JOBS_EVENT, NEW_POSTING, SORT, TEXT_SEARCH} from "../../../constants/ga";

export default class MyjobsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filter_1_value: 1,
      filter_2_value: 1,
      is_loading: false,

      filters: {
        is_active: true
      },
      query: undefined,
      sort: {
        created_at: -1
      },
      open_sort: false,
      jobs: [],
      hasMorePages: true
    };

    this.debounceOnTextChange = _.debounce(this.onTextChange, 800);
  }

  componentDidMount() {
    this.fetch_my_jobs();
  }

  // on scroll
  handleUpdate = (values) => {
    const {scrollTop, scrollHeight, clientHeight} = values;
    const pad = 300;
    const t = ((scrollTop + pad) / (scrollHeight - clientHeight));
    if (t > 1 && t !== Infinity && !this.state.is_loading)
      this.fetch_my_jobs({pageNo: this.state.currentPage + 1});
  };

  scrollMyJobToTop = () => {
    if (this.refs.scrollbar_my_jobs)
      this.refs.scrollbar_my_jobs.scrollToTop();
  };


  fetch_my_jobs = (args) => {
    let {pageNo = 0, pageSize = 15} = args || {};
    let {filters, sort, query, hasMorePages} = this.state;
    if (!hasMorePages) {
      console.log("no more pages");
      return;
    }
    eventEmitter.emit(SHOW_PROGRESS_BAR);
    this.setState({is_loading: true, is_error: false});
    ApiBuilder.fetch(ApiBuilder.getApi(MY_JOBS), {
      method: 'POST',
      body: {filters, query, sort, pageNo, pageSize}
    })
      .then((res) => {
        if (res.data && res.data.jobs) {
          let totalJobs = [];
          if (res.data.meta.pageNo !== 0)
            totalJobs = this.state.jobs.concat(res.data.jobs);
          else {
            this.scrollMyJobToTop();
            totalJobs = res.data.jobs;
          }
          this.setState({jobs: totalJobs, currentPage: res.data.meta.pageNo, hasMorePages: res.data.jobs.length});
        }
      })
      .catch((err) => {
        this.setState({is_error: true});
      })
      .then(res => {
        eventEmitter.emit(HIDE_PROGRESS_BAR);
        this.setState({is_loading: false});
      });
  };

  handleTouchTap = (event, source) => {
    event.preventDefault();
    if (source === 'sort') {
      this.setState({
        open_sort: true,
        anchorEl: event.currentTarget,
      });
    }
  };

  handleRequestClose = (action = undefined, order = -1) => {
    if (!action || action === "none")
      return;
    fireEventTrack(MY_JOBS_EVENT, SORT, action);
    let sort = {[action]: order};
    this.setState({open_sort: false, sort, hasMorePages: true}, () => this.fetch_my_jobs());
  };

  onTextChange = (value) => {
    fireEventTrack(MY_JOBS_EVENT, TEXT_SEARCH, value);
    this.setState({query: value, hasMorePages: true}, () => this.fetch_my_jobs());
  };

  render() {

    return (
      <div className="my-jobs-page">
        <h3>
          My Jobs
          {/*<div>{this.getFilterView()}</div>*/}
          <div className="block pull-right">
            <FlatButton onTouchTap={() => {
              fireNavigationEventTrack(MY_JOBS, NEW_POSTING);
              this.props.history.push('/postjob')
            }} label="New Posting" primary={true}/>
          </div>
        </h3>

        <Paper zDepth={1} style={{padding: '8px'}} className="filterContainer">
          <input type="text" placeholder="Search" className="search"
                 onChange={(event) => this.debounceOnTextChange(event.target.value)}/>
          <div className="flex">
            {this.getFilterPopOver()}
            {this.getSortPopOver()}
          </div>
        </Paper>

        <div className="block mt-16"/>
        {this.getMyJobs()}
      </div>
    );
  }

  getMyJobs = () => {
    let {jobs, is_loading, hasMorePages} = this.state;

    if (is_loading || (jobs && jobs.length > 0))
      return (
        <div>
          <Scrollbars ref="scrollbar_my_jobs" style={{height: '800px'}} onUpdate={this.handleUpdate}>
            {
              jobs.map((_job) => <MyJobHeaderDisplay history={this.props.history} info={_job}
                                                     key={_job.job_id}/>)
            }
            {is_loading ? <LoaderCard /> : ""}
            {!hasMorePages ? "No More Jobs" : ""}
          </Scrollbars>
        </div>
      );
    else
      return <NoJobsFoundMessage />;
  };

  getFilterPopOver = () => {
    return (
      <div className="align-self-center">
        <RaisedButton
          icon={<i className="material-icons">filter_list</i>}
          onClick={(event, value) => {
            event.preventDefault();
            this.setState({
              filter_popover: true,
              anchor_filter_popover: event.currentTarget,
            });
          }}
          label="Filter"
        />
        <Popover
          open={this.state.filter_popover}
          anchorEl={this.state.anchor_filter_popover}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={() => {
            this.setState({filter_popover: false})
          }}
        >
          <Menu>
            <DropDownMenu value={this.state.filter_1_value} onChange={(event, index, value) => {
              let type = undefined;
              if (value === 2)
                type = 'full_time';
              else if (value === 3)
                type = 'part_time';
              this.setState({
                jobs: [],
                hasMorePages: true,
                filter_1_value: value,
                filters: update(this.state.filters, {$merge: {type}}),
                filter_popover: false
              }, () => {
                fireEventTrack(MY_JOBS_EVENT, FILTER, this.state.filters);
                this.fetch_my_jobs()
              });
            }}>
              <MenuItem value={1} primaryText="All"/>
              <MenuItem value={2} primaryText="Full Time"/>
              <MenuItem value={3} primaryText="Part Time"/>
            </DropDownMenu>

            <DropDownMenu value={this.state.filter_2_value} onChange={(event, index, value) => {
              let is_active = true;
              if (value === 2)
                is_active = false;
              this.setState({
                jobs: [],
                hasMorePages: true,
                filter_2_value: value,
                filters: update(this.state.filters, {$merge: {is_active}}),
                filter_popover: false
              }, () => {
                fireEventTrack(MY_JOBS_EVENT, FILTER, this.state.filters);
                this.fetch_my_jobs()
              });
            }}>
              <MenuItem value={1} primaryText="Active"/>
              <MenuItem value={2} primaryText="Closed"/>
            </DropDownMenu>
          </Menu>
        </Popover>
      </div>
    )
  };


  getLeftIcon = (type) => {
    let {sort} = this.state;
    return <i className="material-icons">{sort[type] ? "done" : ''}</i>;
  };

  getRightIcon = (type) => {
    let {sort} = this.state;
    let is_descending = sort[type] === -1;
    return (
      <i onClick={() => {
        this.handleRequestClose(type, is_descending ? 1 : -1)
      }} className="material-icons">{is_descending ? "arrow_downward" : sort[type] ? 'arrow_upward' : ""}</i>);
  };

  getSortPopOver = () => {
    return (
      <div className="align-self-center">
        <RaisedButton label="Sort" labelPosition="after" className="ml-16"
                      icon={<i className="material-icons">arrow_downward</i>}
                      onTouchTap={(event) => {
                        this.handleTouchTap(event, 'sort')
                      }}/>
        <Popover
          open={this.state.open_sort}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={() => this.handleRequestClose('none')}
        >
          <Menu>
            <MenuItem
              leftIcon={this.getLeftIcon("applied")}
              rightIcon={this.getRightIcon("applied")}
              primaryText="Applied" onTouchTap={(event) => {
              this.handleRequestClose('applied')
            }}/>
            <MenuItem
              leftIcon={this.getLeftIcon("matched")}
              rightIcon={this.getRightIcon("matched")}
              primaryText="Shortlisted" onTouchTap={(event) => {
              this.handleRequestClose('matched')
            }}/>
            <MenuItem
              leftIcon={this.getLeftIcon("created_at")}
              rightIcon={this.getRightIcon("created_at")}
              primaryText="Create Date" onTouchTap={(event) => {
              this.handleRequestClose('created_at')
            }}/>
          </Menu>
        </Popover>
      </div>
    )
  }
};
