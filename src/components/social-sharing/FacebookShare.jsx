import React, {Component} from "react";
import {FacebookShareButton} from "react-share/lib/share-buttons";
import {generateShareIcon} from "react-share";
const FacebookIcon = generateShareIcon('facebook');

class FacebookShare extends Component {
  render() {
    let {shareUrl, title, size = 32, children} = this.props;
    return (
      <div>
        <FacebookShareButton
          url={shareUrl}
          quote={title}
          className="Demo__some-network__share-button">
          <FacebookIcon
            size={size}
            round/>
          {children}
        </FacebookShareButton>
      </div>
    );
  }
}

FacebookShare.propTypes = {};
FacebookShare.defaultProps = {};

export default FacebookShare;
