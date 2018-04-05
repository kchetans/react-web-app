import React, {Component} from "react";
import {eventEmitter} from "../../dispatcher";
import {SHOW_SNACK_BAR, HIDE_SNACK_BAR} from "../../constants/events";


let getErrorMessage = (error) => {
    if (error) {
        if (typeof  error == 'object') {
            if (error.errors && error.errors[0] && error.errors[0].message)
                return error.errors[0].message;
        } else if (typeof error == 'string') {
            return error;
        }
    }
    return "SOME ERROR ERROR OCCURRED";
};

export default class SnackBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            showSnackBar: false,
            timer: this.props.timer || 4000
        };
    }

    componentDidMount() {
        eventEmitter.addListener(SHOW_SNACK_BAR, (error) => {
            let message = getErrorMessage(error);
            this.setState({showSnackBar: true, text: message});
            setTimeout(() => {
                this.setState({showSnackBar: false, text: ''});
            }, this.state.timer);

        });
        eventEmitter.addListener(HIDE_SNACK_BAR, () => {
            this.setState({showSnackBar: false})
        });
    }

    render() {
        const {showSnackBar} = this.state;
        const snackbarStyle = {
            position: "fixed",
            left: "20px",
            bottom: "20px",
            background: "#404040",
            color: "#fff",
            padding: "14px",
            WebkitTransition: "translate 0.3s cubic-bezier(0, 0, 0.30, 1)",
            transition: "translate 0.3s cubic-bezier(0, 0, 0.30, 1)",
            fontWeight: "500",
            textTransform: "initial",
            willChange: "transform",
            whiteSpace: "nowrap",
            transform: "translateY(20px)",
            WebkitTransform: "translateY(20px)",
            boxShadow: "0 0 2px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.24)",
            fontSize: "14px",
            opacity: 0,
            borderRadius: "3px",
            display: "-webkit-box",
            display: "-ms-flexbox",
            display: "flex",
            WebkitBoxAlign: "center",
            msFlexAlign: "center",
            alignItems: "center",
            WebkitBoxPack: "justify",
            msFlexPack: "justify",
            justifyContent: "space-between",
            lineHeight: "20px",
            zIndex: 1000
        };

        if (showSnackBar) {
            snackbarStyle.opacity = 1;
            snackbarStyle.transform = "translateY(0)";
        }

        return (
            <div style={snackbarStyle}>
                {this.state.text}
            </div>
        );
    }
};
