import React, {Component} from "react";
import {connect} from "react-redux";
import AvatarDropdown from "../components/avatarDropdown.js";
import {isLoggedIn} from "../AuthService.js";
import {NavLink} from "react-router-dom";

class Header extends Component {

  render() {
    const style = {
      background: this.props.colorHeaderBanner.color
    };

    const headerStyle = {
      background: '#ffffff',         //this.props.colorHeader.color
      color: '#f62424'
    };

    let getHeaderOnLoggedIn = () => {
      // const style = {
      //   padding: '16px 16px 16px 16px',
      //   fontSize: '14px',
      // };

      const HeaderLogoWithMenu = () => (
        <div className="top__logo" style={headerStyle}>
          <div className="header-left">
            <img alt="workex" src="https://s3.ap-south-1.amazonaws.com/wx-logo/logo_original_icon.png" width="50"
                 className="pr-3"/>
            <a className="brand">Workex</a>
          </div>
        </div>
      );

      return (
        <div className="mainHeaderContainer">
          <div className="leftContainer">
            <HeaderLogoWithMenu />
            <NavLink to="/postjob?source=nav_bar" exact className="topHeaderLink">
              <i className="material-icons">dashboard</i>
              <span style={{marginLeft: '16px'}}>Post Job</span>
            </NavLink>

            <NavLink to="/myjobs?source=nav_bar" exact className="topHeaderLink">
              <i className="material-icons">people</i>
              <span style={{marginLeft: '16px'}}>My Jobs</span>
            </NavLink>

            <NavLink to="/chats?source=nav_bar" exact className="topHeaderLink">
              <i className="material-icons">people</i>
              <span style={{marginLeft: '16px'}}>Chats</span>
            </NavLink>

            <NavLink to="/people?source=nav_bar" exact className="topHeaderLink">
              <i className="material-icons">search</i>
              <span style={{marginLeft: '16px'}}>Search People</span>
            </NavLink>
          </div>
          <div className="rightContainer">
            {/*<Notification/>*/}
            <AvatarDropdown/>
          </div>
        </div>)
    };

    let getHeaderOnLoggedOut = () => {
      return null;
    };

    let getHeaderSection = () => {
      if (isLoggedIn())
        return getHeaderOnLoggedIn();
      else
        return getHeaderOnLoggedOut();
    };

    return (
      <header style={style} className="an-header">
        {getHeaderSection()}
      </header>
    );
  }
}

function mapStateToProps(state) {
  return {
    colorHeaderBanner: state.headerBAnnerActiveStyle
  }
}

export default connect(mapStateToProps)(Header);
