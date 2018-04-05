import React, {Component} from "react";

export default class GetUsers extends Component {

  state = {
    categories: []
  };

  componentDidMount() {
    // api call
    fetch("http://jobs.api.workex.in:9000/api/master/job-categories")
      .then(res => {
        this.setState({categories: res.data});
      });
  }


  render() {
    let {categories = []} = this.state;
    return (
      <div>
        {JSON.stringify(categories)}
      </div>
    );
  }
}

