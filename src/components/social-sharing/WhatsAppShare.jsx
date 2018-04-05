import React, {Component} from "react";
import {WhatsappShareButton} from "react-share/lib/share-buttons";
import {generateShareIcon} from "react-share";
const WhatsappIcon = generateShareIcon('whatsapp');

class WhatsAppShare extends Component {
  render() {
    let {shareUrl, title, size = 32} = this.props;
    return (
      <div>
        <WhatsappShareButton
          url={shareUrl}
          quote={title}
          className="Demo__some-network__share-button">
          <WhatsappIcon
            size={size}
            round/>
        </WhatsappShareButton>
      </div>
    );
  }
}

WhatsAppShare.propTypes = {};
WhatsAppShare.defaultProps = {};

export default WhatsAppShare;
