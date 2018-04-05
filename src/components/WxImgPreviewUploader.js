import React from "react";
import Image_PlaceHodler from "../img/imageGalleryIcon.png";
import {getRedefineUrl, UPLOAD_IMAGE} from "../constants/urls";
import ApiBuilder from "./apiBuilder";

class WxImgPreviewUploader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      file: '', imagePreviewUrl: null
    }
  }

  handleFileSubmit = (e, value) => {
    let data = this.props.metadata || {};
    let {name} = data;
    let reader = new FileReader();
    let file = e.target.files[0];
    if (!file)
      return;

    let fileUpload = new FormData();
    fileUpload.append('upload', file);

    ApiBuilder.uploadImage(ApiBuilder.getApi(getRedefineUrl(UPLOAD_IMAGE, {tags: "profile_pic"})), {
      method: "POST",
      body: fileUpload
    }).then(res => {
      if (this.props.onChange)
        this.props.onChange(res)
    });

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    };

    reader.readAsDataURL(file)
  };

  render() {
    let {imageUrl, style} = this.props || {};
    let {width = 50, height = 50} = style || {};
    return (
      <div style={style}>
        <div className="file-upload">
          <input id="upload" className="file-upload__input" type="file" name="file"
                 onChange={this.handleFileSubmit}/>
          {
            this.state.imagePreviewUrl === null ?
              <img height={height} width={width}
                   src={imageUrl || Image_PlaceHodler} alt="default image"/>
              :
              <img id="blah" height={height} width={width} src={this.state.imagePreviewUrl}/>

          }
        </div>
      </div>
    )
  }
}

export default WxImgPreviewUploader;
