import React from "react";
import { Menu, Icon, Label, Modal, Form, Input, Button } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux"
import { setCurrentChannel, setPrivateChannel } from "../../actions"

class Channels extends React.Component {
    state = {
        channels: [],
        activeChannel: "",
        user: this.props.currentUser,
        channel: null,
        channelName: "",
        channelDetails: "",
        channelsRef: firebase.database().ref("channels"),
        messagesRef: firebase.database().ref("messages"),
        typingRef: firebase.database().ref('typing'),
        notifications: [],
        modal: false,
        firstLoad: true,
    }
    componentDidMount() {
        this.addListeners();
    }
    componentWillUnmount() {
        this.removeListeners();
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on("child_added", snap => {
            loadedChannels.push(snap.val());
            this.setState({ channels: loadedChannels }, () => this.setDefaultChannel());
            this.addNotificationListener(snap.key);

        })
    }

    addNotificationListener = channelId => {
        this.state.messagesRef.child(channelId).on("value", snap => {
            if (this.state.channel) {
                this.handleNotifications(channelId, this.state.channel.id, this.state.notifications, snap);
            }
        });
    }

    handleNotifications = (channelId, currentChannelId, notifications, snap) => {
        let lastTotal = 0;

        let index = notifications.findIndex(notification => notification.id === channelId);

        if (index !== -1) {
            if (channelId !== currentChannelId) {
                lastTotal = notifications[index].total;

                if (snap.numChildren() - lastTotal > 0) {
                    notifications[index].count = snap.numChildren() - lastTotal;
                }
            }
            notifications[index].lastKnownTotal = snap.numChildren();
        } else {
            notifications.push({
                id: channelId,
                total: snap.numChildren(),
                lastKnowtotal: snap.numChildren(),
                count: 0
            });
        }
        this.setState({ notifications });
    }

    removeListeners = () => {
        this.state.channelsRef.off();
        this.state.channels.forEach(channel => {
            this.state.messagesRef.child(channel.id).off();
        });
    }
    setDefaultChannel = () => {
        const defaultChannel = this.state.channels[0];
        if (this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(defaultChannel);
            this.setActiveChannel(defaultChannel);
            this.setState({ channel: defaultChannel });
        }
        this.setState({ firstLoad: false })
    }
    changeChannel = channel => {
        // to set active on menu item
        this.setActiveChannel(channel);
        this.state.typingRef
            .child(this.state.channel.id)
            .child(this.state.user.uid)
            .remove()
        this.clearNotifications();
        // get from redux
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
        this.setState({ channel });
    }

    clearNotifications = () => {
        let index = this.state.notifications.findIndex(notification => notification.id === this.state.channel.id);

        if (index !== -1) {
            let updatedNotifications = [...this.state.notifications];
            updatedNotifications[index].total = this.state.notifications[index].lastKnownTotal;
            updatedNotifications[index].count = 0;
            this.setState({ notifications: updatedNotifications });
        }
    }
    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id })
    }

    getNotificationCount = channel => {
        let count = 0;

        this.state.notifications.forEach(notification => {
            if (notification.id === channel.id) {
                count = notification.count;
            }
        });
        if (count > 0) return count;

    }

    displayChannels = (channels) => {
        return channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => this.changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.8 }}
                active={channel.id === this.state.activeChannel}
            >
                {this.getNotificationCount(channel) && (
                    <Label color="red">{this.getNotificationCount(channel)}</Label>
                )}
                # {channel.name}
            </Menu.Item>
        ))
    }
    addChannel = () => {
        const { channelsRef, channelName, channelDetails, user } = this.state;
        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL,
            }
        }
        channelsRef
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({ channelName: "", channelDetails: "" });
                this.closeModal();

            })
            .catch(err => {
                console.error(err);
            })
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    handleSubmit = (event) => {
        event.preventDefault();
        if (this.isFormValid(this.state)) {
            this.addChannel();
        }
    }
    isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails


    openModal = () => this.setState({ modal: true })

    closeModal = () => this.setState({ modal: false })

    render() {
        const { channels, modal } = this.state;
        return (
            <React.Fragment>
                <Menu.Menu className="menu">
                    <Menu.Item style={{ color: "#000", fontWeight: "bold" }} onClick={this.openModal}>
                        <span style={{ color: "#000" }}>
                            CHANNELS
                        </span>{" "}
                        ({channels.length}) <Icon name="add" />
                    </Menu.Item>
                    {this.displayChannels(channels)}
                </Menu.Menu>
                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Add a Channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input
                                    fluid
                                    label="Name of Channel"
                                    name="channelName"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    fluid
                                    label="Channel Details"
                                    name="channelDetails"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>

                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="green" inverted onClick={this.handleSubmit}>
                            <Icon name="checkmark" />
                            Add
                        </Button>
                        <Button color="red" inverted onClick={this.closeModal}>
                            <Icon name="remove" />
                            Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment >
        )
    }
}
export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels);
