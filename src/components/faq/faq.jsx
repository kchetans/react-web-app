import React, {Component} from "react";
import TextField from "material-ui/TextField";
import _ from "lodash";
import Paper from "material-ui/Paper";
import {connect} from "react-redux";
import Store from "./../../StoreProvider";
import ApiBuilder from "../../components/apiBuilder";

class FAQTitle extends Component {

  handleOnClick = () => {
    if (this.props.onSelected) {
      this.props.onSelected(this.props.info);
    }
  };

  _getInfo = () => {
    return (
      <Paper zDepth={1} className="faq-title-item" onClick={this.handleOnClick}>
        <b>Q : </b> {this.props.info.title}
      </Paper>);
  };

  render() {
    if (this.props.info)
      return this._getInfo();
    else
      return <span>No Information Available</span>;
  }
}

class FAQDetail extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.info) {
      return null;
    }

    return (
      <Paper zDepth={1}>
        <Paper zDepth={1} className="p-16">
          {this.props.info.title}</Paper>
        <div className="faq-content p-16">
          <h6>Answer:</h6>
          {this.props.info.detail}
        </div>
      </Paper>
    );
  }
}

class FAQPage extends Component {

  constructor(props) {
    super(props);
    this.state = {list: []};
  }

  componentDidMount() {
    this.getFaqs();
  }

  getFaqs = () => {
    if (this.props.faqs && this.props.faqs.length === 0) {
      ApiBuilder.fetch(ApiBuilder.getApi('/master/faq'))
        .then(res => {
          Store.dispatch({
            type: 'faqs',
            payload: res.data
          });
          this.setState({list: res.data, selected: res.data[0]});
        })
    } else {
      this.setState({list: this.props.faqs, selected: this.props.faqs[0]});
    }
  };

  render() {

    return (
      <div className="faq-page">
        <h3>Frequently Asked Questions (FAQ)</h3>
        <TextField hintText="Search here" id="faq_searchbar" className="searchfield" fullWidth/>
        <div className="faq-container row">
          <div className="qs-container col-5">
            {_.map(this.state.list, (i) => {
              return <FAQTitle info={i} onSelected={() => {
                this.setState({selected: i});
              }}/>
            })}
          </div>
          <div className="details-container col-7">
            <FAQDetail info={this.state.selected}/>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    faqs: state.faq.faqs
  }
}

export default connect(mapStateToProps)(FAQPage);
