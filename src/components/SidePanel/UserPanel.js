import React from "react";
import { Grid, Header, Image, Dropdown } from "semantic-ui-react";
import firebase from "../../firebase";
import logoBlk from "../../logo-2.png";
import { connect } from "react-redux";
import { combineReducers } from "../../../../../../../../Library/Caches/typescript/3.6/node_modules/redux";
class UserPanel extends React.Component {
    state = {
        user: this.props.currentUser
    }


    dropdownOptions = () => [
        {
            key: "user",
            text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
            disable: "true"
        },
        {
            key: "avatar",
            text: <span>Change Avatar</span>
        },
        {
            key: "signout",
            text: <span onClick={this.handleSignout}>Sign Out</span>
        }
    ]
    handleSignout = () => {
        // remove token from local storage
        firebase.auth()
            .signOut()
            .then(() => console.log("Signout"))
    }

    render() {
        const { user } = this.state;
        console.log(this.props.currentUser)
        return (
            <Grid style={{ background: "$ddd" }}>
                <Grid.Column>
                    <Grid.Row style={{ padding: "1.3em 1em .5em 2em", margin: 0 }}>
                        <Image src={logoBlk} size='tiny' />
                    </Grid.Row>
                    {/* User Dropdown */}
                    <Grid.Row style={{ padding: "0.2em 1.7em 5em 2.7em", margin: 0 }}>
                        <Header floated="left" style={{ padding: "0.35" }} as="h4">
                            <Dropdown trigger={
                                <span>
                                    <Image src={user.photoURL} spaced="right" avatar />
                                    {user.displayName}
                                </span>
                            } options={this.dropdownOptions()} />
                        </Header>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        )
    }
}

export default UserPanel;