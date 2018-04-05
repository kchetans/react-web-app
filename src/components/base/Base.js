import React from "react";
import LinearProgress from "material-ui/LinearProgress";
import {eventEmitter} from "../../dispatcher";
import {HIDE_PROGRESS_BAR, SHOW_PROGRESS_BAR} from "../../constants/events";
import SnackBar from "./SnackBar";

export default function Base() {
  return class Base extends React.Component {

    state = {
      showProgress: false
    };

    componentDidMount() {
      eventEmitter.addListener(SHOW_PROGRESS_BAR, () => {
        this.setState({showProgress: true})
      });
      eventEmitter.addListener(HIDE_PROGRESS_BAR, () => {
        this.setState({showProgress: false})
      });
    }

    render() {
      let {showProgress} = this.state;
      return (
        <div className="container">
          {showProgress ?
            <LinearProgress style={{position: 'absolute', zIndex: 10000, width: "106%"}} mode="indeterminate"/> : ""}
          {this.props.children}
          <SnackBar />
        </div>
      )
    }
  }
}
