import React, {Component} from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import FacebookShare from "../../social-sharing/FacebookShare";
import LinkedInShare from "../../social-sharing/LinkedInShare";
import WhatsAppShare from "../../social-sharing/WhatsAppShare";
import {getBaseWebUrl} from "../../../lib/navigation-utils";
import GoogleShare from "../../social-sharing/GoogleShare";

class PromoteJob extends Component {

  state = {
    showPromote: false
  };

  handleOpen = () => {
    this.setState({showPromote: true});
  };

  handleClose = () => {
    this.setState({showPromote: false});
  };

  render() {
    let {showPromote = false} = this.state;
    let {job} = this.props;
    let {description, slug, job_id} = job || {};
    if (!slug)
      slug = job_id;
    let shareUrl = `${getBaseWebUrl()}/job/${slug}`;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.props.onClose}
      />
    ];

    return (
      <Dialog
        title="Promote you Job"
        actions={actions}
        modal={true}
        open={showPromote}
      >
        Share your Job, to attract more people.<br/><br/>
        <div className="d-flex justify-content-around">
          <FacebookShare size={48} shareUrl={shareUrl} title={description}/>
          <LinkedInShare size={48} shareUrl={shareUrl} title={description}/>
          <WhatsAppShare size={48} shareUrl={shareUrl} title={description}/>
          <GoogleShare size={48} shareUrl={shareUrl} title={description}/>
        </div>
      </Dialog>
    );
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props != nextProps) {
      let {showPromote} = nextProps;
      this.setState({showPromote});
    }
  }

}

PromoteJob.propTypes = {};
PromoteJob.defaultProps = {};

export default PromoteJob;
