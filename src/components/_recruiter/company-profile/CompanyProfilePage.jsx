import React, {Component} from "react";
import CompanyInfoComponent from "./CompanyInfoComponent";


export default class CompanyProfilePage extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="profile-page employer-profile-page">
        <h3>Company Profile</h3>
        <br />
        <CompanyInfoComponent/>
      </div>
    )
  }
}
