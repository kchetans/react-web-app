/*
 * filename: routers.js
 * mainly responsivle for all routes component
 * change and sidebar routlist menu item
 * */

import React, {Component} from "react";
import {connect} from "react-redux";

class SidebarMenuRouters extends Component {
  constructor() {
    super();
    this.state = {menuOpen: false};
  }

  // Sidebar toggle
  toggleMenu = () => {
    if (this.props.onMenuStateChange)
      this.props.onMenuStateChange(!this.props.menuOpen);
  }

  render() {

    // const containerStyle = {
    //   background: this.props.colorSidebar.color
    // }

    // Sidebar class based on bg color
    // const sidebarClass = classNames({
    //   'menu-drawer': true,
    //   'has-bg': true,
    // });


    /*
     <FloatingActionButton
     mini={true}
     secondary={true}
     onClick={this.toggleMenu}
     >
     <i className="material-icons">format_indent_decrease</i>
     </FloatingActionButton>
     */

    // header left part with logo and toggle button
    const HeaderLogoWithMenu = () => (
      null
    );

    // let _getSidebar = () => {
    //   if (!isLoggedIn()) {
    //     return null;
    //   } else {
    //     return (
    //       <Drawer open={this.props.menuOpen}
    //               className={sidebarClass}
    //               containerClassName="sidebar-initial-color"
    //               containerStyle={containerStyle}
    //       >
    //         <Scrollbars>
    //           <RoutesList />
    //         </Scrollbars>
    //       </Drawer>
    //     );
    //   }
    // };

    // <StyleSwitcher/>
    return (
      <div className="readmin-sidebar">
        <HeaderLogoWithMenu />
        {/*{_getSidebar()}*/}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    colorHeader: state.headerActiveStyle,
    colorSidebar: state.sidebarActiveStyle
  }
}

export default connect(mapStateToProps)(SidebarMenuRouters);
