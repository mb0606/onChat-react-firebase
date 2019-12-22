import React from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel"
import Channels from "./Channels"
import DirectMessages from "./DirectMessages"
import Starred from "./Starred"

class SidePanel extends React.Component {
    render() {
        const { currentUser, primaryColor } = this.props;
        return (
            <Menu
                size="large"
                fixed="left"
                vertical
                style={{ backgroundImage: `linear-gradient(120deg, ${primaryColor} 0%, #ebedee 100%)`, font: "1.2rem" }}
            >
                <UserPanel currentUser={currentUser} />
                <Starred currentUser={currentUser} />
                <Channels currentUser={currentUser} />
                <DirectMessages currentUser={currentUser} />

            </Menu>
        )
    }
}

export default SidePanel;


