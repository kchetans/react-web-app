import React, {Component} from "react";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import IconButton from "material-ui/IconButton";
import Avatar from "material-ui/Avatar";
import Divider from "material-ui/Divider";
import avatarImage from "../img/user12.jpg";
import ApiBuilder from "./apiBuilder";
import injectTapEventPlugin from "react-tap-event-plugin";
import {Link, Redirect} from "react-router-dom";
import {MY_PROFILE} from "../constants/urls";
import Store from "./../StoreProvider";
import {eventEmitter} from "../dispatcher";
import {connect} from "react-redux";
import {LOG_OUT} from "../constants/events";
injectTapEventPlugin();

class AvatarDropdown extends Component {


  state = {
    valueSingle: '3',
    navigate_link: undefined,
    valueMultiple: ['3', '5'],
  };

  componentDidMount() {
    this.getUserProfile();
  }

  getUserProfile = () => {
    ApiBuilder.fetch(ApiBuilder.getApi(MY_PROFILE))
      .then(res => {
        Store.dispatch({
          type: 'my_profile',
          payload: res.data
        });
      });
  };


  handleOnRequestChange = (value) => {
    this.setState({
      openMenu: value,
    });
  };


  render() {
    let {profile_pic_url} = this.state;

    const style = {
      zIndex: '1500'
    };

    let {navigate_link} = this.state;
    if (navigate_link) {
      return <Redirect to={`/${navigate_link}`} push={true}/>
    }

    return (
      <div className="my__profile">
        <IconMenu
          style={style}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          iconButtonElement={<IconButton>
            <Avatar
              src={profile_pic_url || avatarImage}
              size={35}
            />
          </IconButton>}
          open={this.state.openMenu}
          onRequestChange={this.handleOnRequestChange}
        >
          <Link to="/empprofile">
            <MenuItem onTouchTap={() => this.setState({openMenu: false})} primaryText="My Profile"
                      leftIcon={<i className="material-icons">account_circle</i>}/>
          </Link>
          <Link to="/company-profile">
            <MenuItem onTouchTap={() => this.setState({openMenu: false})} primaryText="Company Profile"
                      leftIcon={<i className="material-icons">account_circle</i>}/>
            {/*<MenuItem primaryText="Inbox" leftIcon={<i className="material-icons">mail_outline</i>} />*/}
          </Link>
          <Link to="/faq">
            <MenuItem onTouchTap={() => this.setState({openMenu: false})}
                      primaryText="FAQ"
                      leftIcon={<i className="material-icons">help</i>}/>
          </Link>
          <Divider />
          {/*<Link to="/settings">*/}
          {/*<MenuItem onTouchTap={() => this.setState({openMenu: false})}*/}
          {/*primaryText="Settings"*/}
          {/*leftIcon={<i className="material-icons">settings</i>}/>*/}
          {/*</Link>*/}
          <MenuItem
            primaryText="Sign Out" leftIcon={<i className="material-icons">power_settings_new</i>}
            onClick={() => {
              eventEmitter.emit(LOG_OUT);
            }}/>
        </IconMenu>
      </div>
    );
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props !== nextProps && nextProps.my_profile && nextProps.my_profile.profile) {
      this.setState({profile_pic_url: nextProps.my_profile.profile.profile_pic_url});
    }
  }

}


function mapStateToProps(state) {
  return {
    my_profile: state.profile.my_profile
  }
}

export default connect(mapStateToProps)(AvatarDropdown);
