import React, {Component} from "react";
import {Helmet} from "react-helmet";

class PublibJobsHeaderMeta extends Component {

  render() {
    let {meta} = this.props;
    let {cover_pic_url} = meta || {};
    return (
      <Helmet>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no"/>
        <meta property="description" content="{{meta_description}}"/>
        <meta property="keywords" content="{{meta_keyword}}"/>
        <title>Workex | Jobs </title>
        <link rel="shortcut icon" href="images/favicon.png" type="image/x-icon"/>
        <link rel="apple-touch-icon-precomposed" href="images/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" href="https://s3.ap-south-1.amazonaws.com/wx-logo/logo_original_icon.png"/>
        <meta property="og:title" content="Job {{text}} | Workex"/>
        <meta property="og:site_name" content="Workex"/>
        <meta property="og:description" content="Find jobs on Workex. Workex helps you find employment"/>
        <meta property="og:image" content={cover_pic_url}/>
        <meta property="og:image:width" content="640"/>
        <meta property="og:image:height" content="300"/>
      </Helmet>
    );
  }
}

PublibJobsHeaderMeta.propTypes = {};
PublibJobsHeaderMeta.defaultProps = {};

export default PublibJobsHeaderMeta;
