import React from "react";
import { Grid, Header, Image, Dropdown, Modal, Icon, Input, Button } from "semantic-ui-react";
import firebase from "../../firebase";
import logoBlk from "../../logo-2.png";
import { connect } from "react-redux";

class UserPanel extends React.Component {
    state = {
        user: this.props.currentUser,
        modal: false
    }

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false })

    dropdownOptions = () => [
        {
            key: "user",
            text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
            disable: "true"
        },
        {
            key: "avatar",
            text: <span onClick={this.openModal}>Change Avatar</span>

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
        const { user, modal } = this.state;
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
                    <Modal basic open={modal} onClose={this.closeModal}>
                        <Modal.Header>Change Avatar</Modal.Header>
                        <Modal.Content>
                            <Input
                                fluid
                                type="file"
                                label="New Avatar"
                                name="previewImage"
                            />
                            <Grid centered stackable columes={2}>
                                <Grid.Row centered>
                                    <Grid.Column className="ui center aligned grid">
                                        {/* Image Preview */}
                                    </Grid.Column>
                                    <Grid.Column>
                                        {/* Cropped image */}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="green" inverted>
                                <Icon name="save" /> Change Avatar
                            </Button>
                            <Button color="green" inverted>
                                <Icon name="image" /> Preview
                            </Button>
                            <Button color="red" onClick={this.closeModal} inverted>
                                <Icon name="remove" /> Cancel
                            </Button>

                        </Modal.Actions>
                    </Modal>
                </Grid.Column>
            </Grid>
        )
    }
}

export default UserPanel;