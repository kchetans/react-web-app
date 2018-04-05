import {Component} from "react/lib/ReactBaseClasses";
import {Paper, TextField} from "material-ui";
import * as React from "react";
import Autocomplete from 'react-google-autocomplete';

export class SearchBar extends Component{

  constructor(props){
    super(props);
    let state = {};
  }

  invokeOnSearch = () => {
    if(this.props.onSearch){
      this.props.onSearch(this.state);
    }
  };

  /*
      this methods add a delay of {500 ms} and check if the value is same as before. If it same, then only it will hit the search api, otherwise, it will abort.
   */
  handleOnChange = (e) =>{
    let initvalue = this.refs.searchTextField.getValue();
    setTimeout(()=>{
      let finalValue = this.refs.searchTextField.getValue();
      if(initvalue === finalValue){
        //console.log('input remained to be ', finalValue, ', searching...');
        this.setState({query:finalValue});
        this.invokeOnSearch();
      }else{
        //console.log('input changed from ', initvalue, ' to ', finalValue, ', aborting.');
      }
    },500);
  };

  handleOnPlaceSelected = (place) => {
    let _stateArgs = {};
    if(place){
      if(place.geometry){
        _stateArgs.position = {};
        _stateArgs.position.lat = place.geometry.location.lat();
        _stateArgs.position.lng = place.geometry.location.lng();
        _stateArgs.place_data = {
          address_components: place.address_components,
          vicinity: place.vicinity,
          name: place.name,
          types: place.types,
          formatted_address: place.formatted_address
        }
      }
    }
    this.setState(_stateArgs);
    this.invokeOnSearch();
  };

  handleOnAutocompleteChange = (e) => {

    let value = e.currentTarget.value;
    if(value === '' || value === null){
      this.setState({position:undefined, place_data:undefined}, this.invokeOnSearch);
    }
    this.setState({position:undefined, place_data:undefined});
  };

  render(){
    return (
      <div>
        <Paper zDepth={1} className="mb-16" style={{'paddingLeft': '16px', paddingRight: '16px'}}>
          <TextField ref="searchTextField" fullWidth hintText="Search Here" onChange={this.handleOnChange}/>
          <Autocomplete
            style={{width: '100%', padding:'8px', marginBottom: '16px', border: '1px solid white', borderBottom: '1px solid gray'}}
            onPlaceSelected={this.handleOnPlaceSelected}
            onChange = {this.handleOnAutocompleteChange}
            types={['(cities)']}
            componentRestrictions={{country: "in"}}
          />
        </Paper>
      </div>
    );
  }
}
