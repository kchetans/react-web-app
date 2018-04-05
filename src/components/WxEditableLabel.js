import React from "react";
import TextField from "material-ui/TextField";

/**
 * This is component used to edit label,
 * on click at label this will change to TextField
 */

let DEFAULT_VALUE = "";
class WxEditableLabel extends React.Component {

  state = {
    editable: false,
    value: DEFAULT_VALUE
  };

  componentDidMount() {
    let {value = DEFAULT_VALUE, editable = false} = this.props;
    this.setState({value, editable})
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props !== nextProps) {
      let {value, editable} = nextProps;
      if (value)
        this.setState({value});
    }
  }


  onValueChange = (event, value) => {
    let {onChange} = this.props;
    this.setState({value});
    if (onChange)
      onChange(event, value);
  };

  render() {
    let {editable, value} = this.state;
    let {
      classNameLabel, InputFieldInputStyle, InputFieldStyle, name, hintText, metadata, value: currentValue,
      ShowFloatingLabelText = true, fullWidth = false, multiLine = false, ...others
    } = this.props;
    let {floatingLabelText} = others;
    let {style} = metadata || {};
    if (editable) {
      return (
        <TextField
          name={name}
          floatingLabelText={floatingLabelText}
          style={InputFieldStyle}
          hintText={hintText}
          multiLine={multiLine}
          inputStyle={InputFieldInputStyle}
          fullWidth={fullWidth}
          onKeyDown={ (a) => {
            if (a.keyCode === 13)
              this.setState({editable: false})
          }}
          onBlur={() => this.setState({editable: false})}
          onChange={this.onValueChange}
          defaultValue={value}
          {...others}
        />
      )
    } else if (value || hintText) {
      return (
        <div onClick={() => this.setState({editable: true})}>
          {ShowFloatingLabelText ? <div><span className="h6">{floatingLabelText}</span><br /></div> : ''}
          <span style={style} className={classNameLabel}>
                      {value || hintText}
          </span>
        </div>
      )
    } else {
      return (<div></div>)
    }
  }
}


WxEditableLabel.propTypes = {
  // hintText: React.PropTypes.string.isRequired,
  // value   : React.PropTypes.string.isRequired,
  // onChange: React.PropTypes.func.isRequired,
};

export default  WxEditableLabel;
