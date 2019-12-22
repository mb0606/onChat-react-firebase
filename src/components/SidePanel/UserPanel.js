import React from "react";
import AvatarEditor from "react-avatar-editor";
import { Grid, Header, Image, Dropdown, Modal, Icon, Input, Button } from "semantic-ui-react";
import firebase from "../../firebase";
import logoBlk from "../../logo-2.png";
import { connect } from "react-redux";

class UserPanel extends React.Component {
    state = {
        user: this.props.currentUser,
        modal: false,
        previewImage: "",
        croppedImage: "",
        blob: ""
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
    handleChangeFile = event => {
        const file = event.target.files[0];
        const reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
            reader.addEventListener("load", () => {
                this.setState({ previewImage: reader.result });
            })
        }
    }
    handleCropImage = () => {
        if (this.avatarEditor) {
            this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
                let imageUrl = URL.createObjectURL(blob);
                this.setState({
                    croppedImage: imageUrl,
                    blob
                })
            });
        }
    }

    render() {
        const { user, modal, previewImage, croppedImage } = this.state;
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
                                onChange={this.handleChangeFile}
                            />
                            <Grid centered stackable columns={2}>
                                <Grid.Row centered>
                                    <Grid.Column className="ui center aligned grid">
                                        {previewImage && (
                                            <AvatarEditor
                                                ref={node => (this.avatarEditor = node)}
                                                image={previewImage}
                                                width={120}
                                                height={120}
                                                border={50}
                                                scale={1.2}
                                            />
                                        )}
                                    </Grid.Column>
                                    <Grid.Column>
                                        {croppedImage && (
                                            <Image
                                                style={{ margin: "3.5em auto" }}
                                                width={100}
                                                height={100}
                                                src={croppedImage} />
                                        )}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                            {croppedImage && (<Button color="green" inverted>
                                <Icon name="save" /> Change Avatar
                            </Button>)}
                            <Button color="green" inverted onClick={this.handleCropImage}>
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