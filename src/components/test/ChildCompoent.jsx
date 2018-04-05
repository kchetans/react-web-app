import React, {Component} from "react";

class ChildCompoent extends Component {
  render() {
    return (
      <div>
        Child Component
        {this.props.item}
      </div>
    );
  }
}

ChildCompoent.propTypes = {};
ChildCompoent.defaultProps = {};

export default ChildCompoent;
