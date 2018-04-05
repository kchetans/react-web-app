import React, {Component} from "react";
import {LinkedinShareButton} from "react-share/lib/share-buttons";
import {LinkedinShareCount} from "react-share/lib/share-counts";
import {generateShareIcon} from "react-share";
const LinkedinIcon = generateShareIcon('linkedin');

class LinkedInShare extends Component {
  render() {
    let {shareUrl, title, size = 32} = this.props;
    return (
      <div className="Demo__some-network">
        <LinkedinShareButton
          url={shareUrl}
          title={title}
          windowWidth={750}
          windowHeight={600}
          className="Demo__some-network__share-button">
          <LinkedinIcon
            size={size}
            round/>
        </LinkedinShareButton>

        {/*<LinkedinShareCount*/}
          {/*url={shareUrl}*/}
          {/*className="Demo__some-network__share-count">*/}
          {/*{count => count}*/}
        {/*</LinkedinShareCount>*/}
      </div>
    );
  }
}

LinkedInShare.propTypes = {};
LinkedInShare.defaultProps = {};

export default LinkedInShare;
