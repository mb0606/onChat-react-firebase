import React from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import firebase from "../../firebase"

class MessageForm extends React.Component {
    state = {
        message: '',
        laoding: false,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        errors: [],
    }
    handlesChange = event => {
        this.setState({ [event.tartget.name]: event.target.value })
    }
    createMessage = () => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            content: this.state.message,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.message,
            }
        };
        return message;

    }
    sendMessage = () => {
        const { messagesRef } = this.props;
        const { message, channel } = this.state;

        if (message) {
            this.setState({ loading: true });
            messagesRef
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({ loading: false, message: '', error: [] })
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        loading: false,
                        error: this.state.errors.concat(err),
                    })
                })
        }
    }

    render() {
        return (
            <Segment className="message__form">
                <Input
                    fluid
                    name="message"
                    onChange={this.handlesChange}
                    style={{ marginBottom: '0.7em' }}
                    labelPosition="left"
                    placeholder="Let people know what you are thinking"
                />
                <Button.Group icon widths="2">
                    <Button
                        onClick={this.sendMessage}
                        color="blue"
                        content="Add Reply"
                        labelPosition="left"
                        icon="edit"
                    />
                    <Button
                        color="teal"
                        content="Upload Media"
                        labelPosition="left"
                        icon="cloud upload"
                    />
                </Button.Group>
            </Segment>
        );
    }
}
export default MessageForm;