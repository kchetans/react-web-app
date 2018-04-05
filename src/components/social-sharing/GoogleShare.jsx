import React, {Component} from "react";
import {GooglePlusShareButton} from "react-share/lib/share-buttons";
import {GooglePlusShareCount} from "react-share/lib/share-counts";
import {generateShareIcon} from "react-share";
const LinkedinIcon = generateShareIcon('google');

class GoogleShare extends Component {
  render() {
    let {shareUrl, title, size = 32} = this.props;
    return (
      <div className="Demo__some-network">
        <GooglePlusShareButton
          url={shareUrl}
          title={title}
          windowWidth={750}
          windowHeight={600}
          className="Demo__some-network__share-button">
          <LinkedinIcon
            size={size}
            round/>
        </GooglePlusShareButton>

        {/*<LinkedinShareCount*/}
          {/*url={shareUrl}*/}
          {/*className="Demo__some-network__share-count">*/}
          {/*{count => count}*/}
        {/*</LinkedinShareCount>*/}
      </div>
    );
  }
}

GoogleShare.propTypes = {};
GoogleShare.defaultProps = {};

export default GoogleShare;
