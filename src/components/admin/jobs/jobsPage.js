import React, {Component} from 'react';
import Autocomplete from 'react-google-autocomplete';
import {Paper, RadioButton, RadioButtonGroup, RaisedButton, TextField} from 'material-ui';
import ApiBuilder from '../../apiBuilder';
import {ADMIN_JOBS} from "../../../constants/urls";
import Select from 'react-select';

export default class JobsPage extends Component{

  constructor(props){
    super(props);
    this.state = {
      text: null,
      jobs: [],
      job_type: 'full_time',
      master_categories: [
        {
        "value": "barista_bartender",
        "key": "Barista"
      },
        {
          "value": "bartender",
          "key": "Bartender"
        },
        {
          "value": "beauty_Wellness",
          "key": "Beauty & Wellness"
        },
        {
          "value": "careworkers_health",
          "key": "Careworkers & Health"
        },
        {
          "value": "chef_cook",
          "key": "Chef & Cook"
        },
        {
          "value": "cleaner",
          "key": "Cleaner"
        },
        {
          "value": "construction",
          "key": "Construction"
        },
        {
          "value": "driver_courier",
          "key": "Driver"
        },
        {
          "value": "delivery_courier",
          "key": "Delivery & Courier"
        },
        {
          "value": "telecaller",
          "key": "Telecaller"
        },
        {
          "value": "education",
          "key": "Education"
        },
        {
          "value": "events_promotion",
          "key": "Events & Promotion"
        },
        {
          "value": "kitchen_porter",
          "key": "Kitchen Porter"
        },
        {
          "value": "office_admin",
          "key": "Office & Admin"
        },
        {
          "value": "retail",
          "key": "Retail"
        },
        {
          "value": "sales_marketing",
          "key": "Sales & Marketing"
        },
        {
          "value": "waiter_waitress",
          "key": "Waiter / Waitress"
        },
        {
          "value": "warehouse",
          "key": "Warehouse"
        },
        {
          "value": "others",
          "key": "Others"
        }],
      job_categories: []
    }
  }

  renderJob = (_job) =>{
    return (
      <Paper zDepth={1} style={{marginTop:'16px'}} key={_job.job_id}>
        <img src={_job.cover_pic_url} width='100%'/>
        <div className="p-16">
          <h5>{_job.description}</h5>
          <div>
            {_job.city} | {_job.type_text} | <span className="distance">{_job.distance}</span>
          </div>
          <div>
            {_job.compensation}
          </div>
          <div>
            {_job.category.map((c)=> <span key={c.value}>{c.key} </span>)}
          </div>
          <div>
            <small>{_job.time} </small>
            <small>Score: {_job.score}</small>
          </div>
        </div>
      </Paper>
    )
  };

  exec_search = () => {
    let _text = this.refs.searchtextbar.getValue();
    let _url = ApiBuilder.getApi(ADMIN_JOBS)
      //'http://localhost:9000/api/workexnow/v1/jobs/jobs/v2';

    let _args = {
      q: _text,
      pageSize: 100
    };

    console.log('Search State, ',this.state);


    if(this.state.job_type){
      _args["job_type"]=this.state.job_type;
    }

    if(this.state.job_categories.length > 0){
      _args['categories'] = this.state.job_categories;
    }

    if(this.state.place){
      _args.lat = this.state.place.geometry.location.lat();
      _args.lng = this.state.place.geometry.location.lng();
      console.log('admin jobs args body',_args)
      ApiBuilder.fetch(_url,{
        method:'POST',
        body:_args
      })
        .then((res)=>{
          this.setState({text:_text, jobs:res.data.jobs, meta:res.data.meta});
        });

    }else{
      alert('Location is a Must');
    }

  };

  handleOnPlaceSelected = (place) =>{
    this.setState({place:place});
    this.exec_search();
  };

  handleCategorySelect = (data) => {
    let _values = [];
    for(let item of data){
      _values.push(item.value);
    }
    this.setState({job_categories:_values});
    setTimeout(this.exec_search,150);
  };

  render(){

    return (<div>
      <div className="row">
        <div className="col-6">
          <TextField defaultValue={this.state.text} ref="searchtextbar" name="search" hintText="Search Keywords like (Sales)" onChange={()=> this.exec_search()}/>
          <Autocomplete className="mt-16" name="place"
            onPlaceSelected={this.handleOnPlaceSelected}
            types={[]}
            style={{width: '100%', padding: '4px'}}
          />
          <Select className="mt-16" value={this.state.job_categories}
                  name="category" labelKey="key" multi={true}
                  options={this.state.master_categories} onChange={this.handleCategorySelect}
          />
          <RadioButtonGroup defaultSelected={this.state.job_type} ref="jobtyperadio"
                            className="mt-16"
                            name="job_type" onChange={(event,value)=> this.setState({job_type:value})}>
            <RadioButton label="All"></RadioButton>
            <RadioButton value="full_time" label="Full Time" />
            <RadioButton value="part_time" label="Part Time" />
          </RadioButtonGroup>
          <RaisedButton label="Search" primary={true} onTouchTap={this.exec_search} className="mt-16"></RaisedButton>
          <hr/>
          <div>
            {
              this.state.jobs.map((j)=>{return this.renderJob(j)})
            }
          </div>
          <div>
            { (()=>{
                if(this.state.jobs.length === 0){
                  return (
                    <Paper zDepth={1} className="p-16 mt-16">
                      <h4>No Results Found!</h4>
                      <h5>Please Try Changing you Search Preferences, or your location for better results.</h5>
                    </Paper>
                  )
                }
            })()}
          </div>
        </div>
        <div className="col-6">
        </div>
      </div>
    </div>)
  }
}
