import React from "react";
import Base from "./Base";

class BaseAfterLogin extends React.Component {

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}

export default Base(BaseAfterLogin);
