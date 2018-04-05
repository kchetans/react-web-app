import React, {Component} from "react";
import Paper from "material-ui/Paper";
import ApiBuilder from "../../apiBuilder.js";
import {ADMIN_JOBS} from "../../../constants/urls";
import {eventEmitter} from "../../../dispatcher";
import {HIDE_PROGRESS_BAR, SHOW_PROGRESS_BAR} from "../../../constants/events";
import {Scrollbars} from "react-custom-scrollbars";
import LoaderCard from "../../_common/LoaderCard";
import JobHeaderDisplay from "./JobHeaderDisplay";

export default class jobsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      jobs: []
    }
    ;
  }

  handleUpdate = (values) => {
    const {scrollTop, scrollHeight, clientHeight} = values;
    const pad = 300;
    const t = ((scrollTop + pad) / (scrollHeight - clientHeight));
    if (t > 1 && t !== Infinity && !this.state.is_loading)
      this.fetch_jobs({pageNo: this.state.currentPage + 1});
  };

  componentDidMount() {
    this.fetch_jobs();
  }

  fetch_jobs = (args) => {
    let {pageNo = 0, pageSize = 15} = args || {};
    let {filters, sort, query} = this.state;
    eventEmitter.emit(SHOW_PROGRESS_BAR);
    this.setState({is_loading: true, is_error: false});
    console.log('admin fetch jobs')
    ApiBuilder.fetch(ApiBuilder.getApi(ADMIN_JOBS), {
      method: 'POST',
      body: {filters, query, sort, pageNo, pageSize}
    })
      .then((res) => {
        if (res.data && res.data.jobs) {
          let totalJobs = [];
          if (res.data.meta.pageNo !== 0)
            totalJobs = this.state.jobs.concat(res.data.jobs);
          else {
            if (this.refs.scrollbar)
              this.refs.scrollbar.scrollToTop();
            totalJobs = res.data.jobs;
          }
          this.setState({jobs: totalJobs, currentPage: res.data.meta.pageNo});
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

  getJobs = () => {
    let {jobs, is_loading} = this.state;

    if (is_loading || jobs && jobs.length > 0)
      return (
        <div>
          <Scrollbars ref="scrollbar" style={{height: '800px'}} onUpdate={this.handleUpdate}>
            {
              jobs.map((_job) => <JobHeaderDisplay history={this.props.history} info={_job}
                                                   key={_job.job_id}/>)
            }
            {is_loading ? <LoaderCard /> : ""}
          </Scrollbars>
        </div>
      );
    else
      return <Paper className="p-16 flex flex-column space-around">
        <div className="text-center">
          <img
            src="https://st.depositphotos.com/1431107/2316/v/950/depositphotos_23163822-stock-illustration-oops-vector-smiley.jpg"
            height="300"/>
        </div>
      </Paper>;
  };

  render() {
    let {jobs} = this.state;

    return (
      <div>
        <h3>
          All Jobs
        </h3>

        <Paper style={{padding: '8px'}} className="flex space-between">
          <input type="text" placeholder="Search" className="search"/>
        </Paper>

        <div className="block mt-16"/>
        {this.getJobs()}
      </div>
    );
  }

};
