import React, {Component} from "react";
import _ from "lodash";
import {Checkbox, RadioButton, RadioButtonGroup, RaisedButton} from "material-ui";

export class FilterSelector extends Component {

  constructor(props) {
    super(props);
    this.state = {experiences: [], education: 'NA'};
    this.invokeOptionsChanged = _.debounce(this.idebounceInvokeOptionsChanged, 500);
  }

  setInitialState = () => {
    this.setState({experiences: [], education: 'NA'}, this.invokeOptionsChanged);
  };

  idebounceInvokeOptionsChanged = () => {
    if (this.props.onFiltersChanged) {
      this.props.onFiltersChanged(this.state);
    }
  };

  handleEducationOptionChanged = (event, value) => {
    this.setState({education: value}, this.invokeOptionsChanged);
  };

  handleWorkexOptionChanged = (event, value) => {
    let _experiences = this.state.experiences;
    if (value) {
      _experiences = _experiences.concat(event.target.name);
    } else {
      let _index = _experiences.indexOf(event.target.name);
      if (_index > -1) {
        _experiences.splice(_index, 1);
      }
    }
    this.setState({experiences: _experiences}, this.invokeOptionsChanged);
  };

  render() {

    let experienceOptions = ['Fresher', '0-1 years', '1-3 years', '3-5 years', '5-10 years'];
    let educationOptions = ['Graduation and above', 'Diploma', '10+2 Pass', '10th Pass', 'NA'];

    return (
      <div>
        <div className="filterContainer pl-3 pt-3 pr-3">

          <RaisedButton className="mb-3 full-width" primary
            onTouchTap={this.setInitialState}
            label="Reset"/>

          {/*
           <h6>Show Profiles</h6>
           <div className="pl-2">
           <Checkbox label="Online"/>
           <Checkbox label="Full Profile"/>
           </div>

           <SelectField floatingLabelText="Category?" fullWidth>
           <MenuItem value={1} primaryText="All Categories" />
           <MenuItem value={2} primaryText="Sales and Marketing" />
           <MenuItem value={3} primaryText="Bartender" />
           <MenuItem value={4} primaryText="Cleaning" />
           </SelectField>
           */}

          <h6>Work Experience</h6>
          <div className="pl-2">
            { experienceOptions.map((item, index_outer) => {
              let isSelected = false;
              this.state.experiences.map((experience_item, index) => {
                if (experience_item === item)
                  isSelected = true;
              });
              return <Checkbox checked={isSelected} label={item} key={item + " " + index_outer}
                               onCheck={this.handleWorkexOptionChanged} name={item}/>;
            })}
          </div>
          <hr />
          <h6>Max Education</h6>
          <div className="pl-2">
            <RadioButtonGroup valueSelected={this.state.education} name="" defaultSelected='NA'
                              onChange={this.handleEducationOptionChanged}>
              { educationOptions.map((item, index) => {
                return <RadioButton key={item} label={item} value={item}/>;
              })}
            </RadioButtonGroup>
          </div>
        </div>
      </div>
    );
  }
}
