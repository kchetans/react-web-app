import React, {Component} from "react";
import Paper from "material-ui/Paper";
import ApiBuilder from "../../apiBuilder.js";
import {CandidateHeaderCard, SearchBar} from "./components";
import {FilterSelector} from "./components/FilterSelector";
import {Scrollbars} from "react-custom-scrollbars";
import _ from "lodash";
import {PEOPLE_URL} from "../../../constants/urls";
import CandidateDetails from "./components/CandidateDetails";

export default class PeopleSearchPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      list: [],
      currentPage: -1,
      loading: false,
      selected: undefined,
      searchArgs: {},
      filterOptions: {}
    };
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        });
      });
    }
    this.search('');
  }

  onSelected = (item) => {
    this.setState({selected: item});
  };

  filterChanged = (options) => {
    this.setState({filterOptions: options, currentPage: -1, list: []}, this.search)
  };

  searchOptionsChanged = (args) => {
    this.setState({searchArgs: args, currentPage: -1, list: []}, this.search);
  };

  search = () => {
    let _queryArgs = this.state.searchArgs;
    let filterOptions = this.state.filterOptions;

    let _url = ApiBuilder.getApi(PEOPLE_URL);
    let _args = {};

    _args.pageNo = this.state.currentPage + 1;

    if (_queryArgs && _queryArgs.query !== '')
      _args.q = _queryArgs.query;

    if (this.state.position) {
      _args.lat = this.state.position.lat;
      _args.lng = this.state.position.lng;
    }

    if (_queryArgs.position) {
      _args.lat = _queryArgs.position.lat;
      _args.lng = _queryArgs.position.lng;
      _args.place_data = _queryArgs.place_data;
    }

    if (filterOptions) {
      _args.filterOptions = filterOptions
    }

    this.setState({loading: true});

    ApiBuilder.fetch(_url, {
      method: 'POST',
      body: _args
    })
      .then(result => {
        if (result && result.data) {
          let _selected = null;
          if (result.data.people) {
            if (result.data.people.length > 0) {
              _selected = result.data.people[0];
            } else {
              _selected = null;
            }
          }
          if (result && result.data && result.data.meta)
            this.setState({currentPage: result.data.meta.pageNo});
          let peoples = result.data.people;
          if (peoples)
            this.setState({
              list: this.state.list.concat(peoples),
              loading: false,
              selected: _selected
            });
        } else {
          console.log('No Result Found');
        }

      });
  };

  getCandidateHeaders = () => {
    if (this.state.list.length === 0 && !this.state.loading) {
      return (
        <div className="p-16">
          <img src="http://fr.ubergizmo.com/wp-content/uploads/2012/03/Fotolia_29538381_Subscription_XXL.jpg"
               style={{width: '100%'}}/>
          <div style={{textAlign: 'center'}}>Results are not available for selected filters. Trying changing options!
          </div>
        </div>
      );
    }
    return _.map(this.state.list, c => <CandidateHeaderCard profile={c} onSelect={this.onSelected} key={c._id}/>);
  };

  fetchNextPage() {
    this.setState({loading: true});
    this.search();
  }

  handleUpdate = (values) => {
    const {scrollTop, scrollHeight, clientHeight} = values;
    const pad = 300; // 100px of the bottom
    // t will be greater than 1 if we are about to reach the bottom
    const t = ((scrollTop + pad) / (scrollHeight - clientHeight));
    if (t > 1 && t !== Infinity && !this.state.loading)
      this.fetchNextPage();
  };

  render() {
    return (
      <div className="peopleSearch">
        <h3>Search People</h3>
        <div className="mainContainers">
          <FilterSelector onFiltersChanged={this.filterChanged}/>
          <Paper zDepth={1} className="peopleHeaderContainer col-4">
            <Scrollbars
              onUpdate={this.handleUpdate}
            >
              <SearchBar onSearch={this.searchOptionsChanged}/>
              {this.getCandidateHeaders()}
            </Scrollbars>
          </Paper>
          <div className="peopleDetailContainer col-6">
            <Scrollbars>
              <CandidateDetails info={this.state.selected}/>
            </Scrollbars>
          </div>
        </div>

      </div>
    );
  }
}
