import React, {Component} from "react";
import ChildCompoent from "./ChildCompoent";

class ParentCompoent extends Component {

  state = {
    a: "ok"
  };

  render() {
    let {a} = this.state;
    setTimeout(() => {
      this.setState({a: "123"})
    }, 8000);
    return (
      <div>
        Parent Component
        <ChildCompoent item={a}/>
      </div>
    );
  }
}

ParentCompoent.propTypes = {};
ParentCompoent.defaultProps = {};

export default ParentCompoent;
