import React, {Component} from 'react';
import {Paper} from "material-ui";
import loading_img from "../../img/ajax-loader.gif";

export default class LoaderCard extends Component{

  render(){

    let text = this.props.text;
    if(!text || text === '')
      text = 'Loading Please Wait ...';

    let _zDepth = 0;
    if(this.props.zDepth){
      _zDepth = this.props.zDepth
    }

    return (
      <Paper zDepth={_zDepth} className="p-16 text-center">
        <img src={loading_img} /> <br/>
        {text}
      </Paper>
    );
  }
}
