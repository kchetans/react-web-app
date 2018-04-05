import React, {Component} from 'react';
import * as $ from '../imports/_base';
import Panel from '../../../panel';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import ApiBuilder from '../../../apiBuilder';

export class JobPostingsDashboard extends Component{

  constructor(props){
    super(props);
    this.state = {
      data: [],
      meta: {},
      displayArgs:{},
      loaded:true
    };
  }

  componentDidMount(){
    if(!this.props.name)
      return;
    ApiBuilder.fetch(ApiBuilder.getApi('/workexnow/v1/insights/?name='+this.props.name))
      .then((res)=>{
        this.setState({
          data:res.data,
          displayArgs: res.display,
          meta: res.meta
        });
      });
  };

  componentWillReceiveProps(newProps){
    if(!newProps.name)
      return;
    ApiBuilder.fetch(ApiBuilder.getApi('/workexnow/v1/insights/?name='+newProps.name))
      .then((res)=>{
        console.log('got data as ', res);
        this.setState({
          data:res.data,
          displayArgs: res.display,
          meta: res.meta
        });
      });
  }

  componentWillUpdate(nextProps, nextState){

  }

  render(){
    if(this.state.data.length === 0 || !this.state.displayArgs.series){
      return null;
    }

    console.log('map',this.state.displayArgs.series);

    const getBars = () => {
      if(!this.state.displayArgs.series)
        return null;
      return this.state.displayArgs.series.map((i) => <Bar dataKey={i.dataKey} fill={i.color}/>)
    }

    return (
      <Panel title={this.state.displayArgs.title}>
        <ResponsiveContainer>
          <BarChart width={600} height={300} data={this.state.data}
                    margin={{top: 5, right: 30, left: 20, bottom: 5}}>
            <XAxis dataKey={this.state.displayArgs.xDataKey}/>
            <YAxis/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            {
              this.state.displayArgs.showLegend ?<Legend />:null
            }
            {getBars()}
          </BarChart>
        </ResponsiveContainer>
        {this.state.displayArgs.showTotal?(this.state.meta.total?<span>Total Records Found: {this.state.meta.total}</span>:null):null}
      </Panel>
    );
  }

}
