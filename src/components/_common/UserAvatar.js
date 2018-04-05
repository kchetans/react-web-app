import React, {Component} from "react";
import {Avatar} from "material-ui";
import {colors_in_memory} from "../../constants/storage";
import {getColorForString} from "../../lib/navigation-utils";


export default class UserAvatar extends Component {

  render() {

    if (this.props.src) {
      return <Avatar style={{flexShrink: 0}} src={this.props.src}/>
    }

    if (this.props.name && this.props.name.length > 0) {
      let words = this.props.name.split(' ');
      let code = words[0].split('')[0];
      if (words.length >= 2) {
        code = code + '' + words[1].split('')[0];
      }
      code = code.toUpperCase();
      let color = getColorForString(code);
      return <Avatar style={{flexShrink: 0}} backgroundColor={color}>{code}</Avatar>
    }

    return null;
  }

}
