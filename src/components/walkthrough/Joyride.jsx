import React, {Component} from "react";
import Joyride from "react-joyride";
import "./react-joyride-compiled.css";
class JoyRideComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      joyrideOverlay: true,
      joyrideType: 'continuous',
      ready: false,
      onBoardingSteps: [
        {
          title: 'Workex— As they say: Make the font bigger!',
          textAlign: 'center',
          selector: '.top__logo',
          position: 'bottom'
        },
        {
          title: 'Workex— As they say: Make the font bigger!',
          textAlign: 'center',
          selector: '.post__job',
          position: 'bottom'
        },
        {
          title: 'Workex— As they say: Make the font bigger!',
          textAlign: 'center',
          selector: '.my__job',
          position: 'bottom'
        },
        {
          title: 'Workex— As they say: Make the font bigger!',
          textAlign: 'center',
          selector: '.chats',
          position: 'bottom'
        },
        {
          title: 'Workex— As they say: Make the font bigger!',
          textAlign: 'center',
          selector: '.search__people',
          position: 'bottom'
        },
        {
          title: 'Workex— As they say: Make the font bigger!',
          textAlign: 'center',
          selector: '.my__profile',
          position: 'left'
        }
      ]
    };
  }


  componentDidMount() {
    if (!localStorage.getItem("walkthrogh")) {
      setTimeout(() => {
        this.refs.joyride.start(true)
      }, 4000);
    }
  }


  callback = (data) => {
    if (data.type === "finished") {
      localStorage.setItem("walkthrogh", true);
    }
  };


  render() {
    let state = this.state;
    return (
      <Joyride
        ref="joyride"
        debug={false}
        steps={state.onBoardingSteps}
        type={state.joyrideType}
        locale={{
          back: (<span>Back</span>),
          close: (<span>Close</span>),
          last: (<span>Close</span>),
          next: (<span>Next</span>),
          skip: (<span>Skip</span>)
        }}
        autoStart={true}
        showSkipButton={true}
        showStepsProgress={true}
        showOverlay={state.joyrideOverlay}
        callback={this.callback}
      />
    );
  }
}

JoyRideComponent.propTypes = {};
JoyRideComponent.defaultProps = {};

export default JoyRideComponent;
