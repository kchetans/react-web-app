import classNames from "classnames";
import React, {Component} from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import SidebarMenuRouters from "./routers/routers.js";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import {BrowserRouter as Router} from "react-router-dom";
import "./static/css/Select.css";
import "./static/css/App.css";
import "./static/css/vendor-styles.css";
import Header from "./containers/header.js";
import RoutesComponent from "./routers/routesComponent";
import BaseAfterLogin from "./components/base/BaseAfterLogin";
import Joyride from "./components/walkthrough/Joyride";


const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#258df2',
    accent1Color: '#40c741',
  }
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {menuOpen: false};
    this.menuCollapseWithResize = this.menuCollapseWithResize.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  // menu collapse when on mobile function
  menuCollapseWithResize() {
    if (window.innerWidth < 991) {
      this.setState({menuOpen: false});
    }
    if (window.innerWidth > 991) {
      this.setState({menuOpen: false});
    }
  }

  // Sidebar toggle
  toggleMenu() {
    this.setState(prevState => ({
      menuOpen: !prevState.menuOpen
    }));
  }


  connectSocket = () => {

  };

  // Sidebar collapse when tablet
  componentDidMount() {
    window.addEventListener('resize', this.menuCollapseWithResize);
    if (window.innerWidth < 991) {
      this.setState({menuOpen: false});
    }
  }

  // Sidebar collapse when tablet
  componentWillUnmount() {
    window.removeEventListener('resize', this.menuCollapseWithResize);
  }


  render() {

    const pageContent = classNames({
      'readmin-page-content': true,
      'menu-open': this.state.menuOpen
    });

    return (
      <div>
        <MuiThemeProvider muiTheme={muiTheme}>
          <Router >
            <div>
              <BaseAfterLogin />
              <Header />
              <SidebarMenuRouters onMenuStateChange={(menuOpen) => {
                this.setState({menuOpen})
              }} menuOpen={this.state.menuOpen}/>
              <div className={pageContent}>
                <RoutesComponent />
              </div>
              <Joyride />
            </div>
          </Router>
        </MuiThemeProvider>
      </div>

    );
  }
}

export default App;
