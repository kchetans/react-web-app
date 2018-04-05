import React from 'react';
import * as $ from './imports/_base';
import {JobPostingsDashboard} from './dashboards/jobpostings';
import Panel from '../../panel.js';
import {MenuItem, SelectField} from "material-ui";


const containers = [
    'full-row', '2-col-row', '2-col-row-1-2', '2-col-row-2-1', '3-col-row', '2-cols'
  ];

const dashboards = [
  {
    name: 'daily-dashboards',
    display: 'Daily Dashboards',
    config:
      [{
          container: 'full-row',
          content: [
            {
              type: "widget",
              name: 'job-applications-per-day'
            }]
        },{
          container: 'full-row',
          content:
            [{
              type: "widget",
              name: 'job-postings-per-day'
            }]
        },{
        container: 'full-row',
        content:
          [{
            type: "widget",
            name: 'employers-created-per-day'
          }]
        },{
        container: 'full-row',
        content:
          [{
            type: "widget",
            name: 'candidates-created-per-day'
          }]
      }
      ]
  },
  {
    name: 'chat-dashboards',
    display: 'Chat Dashboards',
    config: [
      {
        container: 'full-row',
        content:
          [{
            type: "widget",
            name: 'chats-per-day'
          }]
      },{
        container: 'full-row',
        content:
          [{
            type: "widget",
            name: 'chat-users-per-day'
          }]
      }
    ]
  },
] ;

//<div>{JSON.stringify(component)}</div>
export class DashboardComponent extends React.Component{
  render(){
    let component = this.props.component;

    if(!component)
      return null;

    switch (component.container){
      case 'full-row':
        if(!component.content || component.content.length === 0)
          return null;
        return (
          <div>
            <JobPostingsDashboard name={component.content[0].name}></JobPostingsDashboard>
          </div>
          );
        break;

      default:
        return null;
        break;
    }
  }
};

export class Dashboard extends React.Component{

  render(){
    let dashboard = undefined;
    for(let d of dashboards){
      if(d.name === this.props.selected){
        dashboard = d;
        break;
      }
    }
    if(!dashboard)
      return <span>Invalid Input (Dashboard)</span>;
    if(!dashboard.config)
      return <span>Invalid Input (Config)</span>;
    return (<div>
      {
        dashboard.config.map((c) => <DashboardComponent component={c}/>)
      }
    </div>);
  }
}

export default class InsightsPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {selected:'daily-dashboards', dashboard:dashboards[0]};
  }

  render(){
    return (
      <div>
        <SelectField
            floatingLabelText="Select Dashboard"
            value={this.state.selected}
            onChange={(event, index, value)=>{this.setState({selected:value, dashboard:dashboards[index] });}}
          >
          {dashboards.map(d=> <MenuItem value={d.name} primaryText={d.display} />)}
        </SelectField>
        <Dashboard selected={this.state.selected} test="2"/>
      </div>
    );
  }
}
