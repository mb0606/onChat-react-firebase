import React from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel"
import Channels from "./Channels"

class SidePanel extends React.Component {
    render() {
        const { currentUser } = this.props;
        return (
            <Menu
                size="large"
                fixed="left"
                vertical
                style={{ backgroundImage: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)", font: "1.2rem" }}
            >
                <UserPanel currentUser={currentUser} />
                <Channels currentUser={currentUser} />

            </Menu>
        )
    }
}

export default SidePanel;


