import React from "react";
import GoogleAnalytics from "react-ga";
import {GA_TRACKING_ID} from "../constants/ga";

GoogleAnalytics.initialize(GA_TRACKING_ID);

const withTracker = (WrappedComponent) => {

  //logPageView
  const trackPage = (page) => {
    GoogleAnalytics.set({page});
    GoogleAnalytics.pageview(page);
  };

  const HOC = (props) => {
    const page = props.location.pathname;
    trackPage(page);

    return (
      <WrappedComponent {...props} />
    );
  };

  return HOC;
};

export default withTracker;
