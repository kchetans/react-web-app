import React from "react";
import Base from "./Base";

class BaseBeforeLogin extends React.Component {

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}

export default Base(BaseBeforeLogin);


