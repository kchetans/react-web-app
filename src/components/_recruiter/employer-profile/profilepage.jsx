import React, {Component} from "react";
import CompanyInfoComponent from "./CompanyInfoComponent";


export default class EmployerProfilePage extends Component {

  render() {
    return (
      <div className="profile-page employer-profile-page">
        <h3>My Profile</h3>

        <CompanyInfoComponent/>
      </div>
    )
  }
}
