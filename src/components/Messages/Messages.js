import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessageForm from "./MessageForm";
import MessagesHeader from "./MessagesHeader";
import Message from "./Message"
import firebase from "../../firebase"

class Messages extends React.Component {
    state = {
        messagesRef: firebase.database().ref('messages'),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        messages: [],
        messagesLoading: true,
        numUniqueUsers: '',
        searchTerm: '',
        searchLoading: false,
        searchResults: [],
        privateChannel: this.props.isPrivateChannel,
        privateMessagesRef: firebase.database().ref('privateMessages')
    }
    componentDidMount() {
        const { channel, user } = this.state;
        if (channel && user) {
            this.addListeners(channel.id);
        }
    }
    displayChannelName = channel => channel ? `#${channel.name}` : "";
    addListeners = channelId => {
        this.addMessageListeners(channelId);
    }
    addMessageListeners = channelId => {
        let loadedMessages = [];
        const ref = this.getMessagesRef();
        ref.child(channelId)
            .on('child_added', snap => {
                loadedMessages.push(snap.val());
                //console.log("Messages from firebase ", loadedMessages);
                this.setState({
                    messages: loadedMessages,
                    messagesLoading: false,
                })
                this.countUniqueUsers(loadedMessages);
            })
    }

    getMessagesRef = () => {
        const { messagesRef, privateMessagesRef, privateChannel } = this.state;
        return privateChannel ? privateMessagesRef : messagesRef;
    }
    handleSearchMessages = () => {
        const channelMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, 'gi');
        const searchResults = channelMessages.reduce((acc, message) => {
            if (message.content && (message.content.match(regex) || message.user.name.match(regex))) {
                acc.push(message);
            }
            return acc;
        }, [])
        this.setState({ searchResults })
        setTimeout(() => this.setState({ searchLoading: false }), 500)
    }
    handleSearchChange = event => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        }, () => this.handleSearchMessages())
    }
    countUniqueUsers = messages => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            //("in reduce", message.user.name)
            return acc;
        }, [])
        const numUniqueUsers = `${uniqueUsers.length} users`
        this.setState({ numUniqueUsers })
    }
    displayMessages = messages => {
        return messages.length > 0 && messages.map(message => {
            return <Message
                key={message.timestamp}
                message={message}
                user={this.state.user}

            />
        })
    }

    render() {
        const { messagesRef, channel, user, messages, privateChannel, numUniqueUsers, searchTerm, searchResults, searchLoading } = this.state;
        return (
            <React.Fragment>
                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                    numUniqueUsers={numUniqueUsers}
                    handleSearchChange={this.handleSearchChange}
                    searchLoading={searchLoading}
                    isPrivateChannel={privateChannel}
                />

                <Segment>
                    <Comment.Group className="messages">
                        {searchTerm ?
                            this.displayMessages(searchResults) :
                            this.displayMessages(messages)
                        }
                    </Comment.Group>
                </Segment>

                <MessageForm
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    isPrivateChannel={privateChannel}
                    getMessagesRef={this.getMessagesRef}
                />

            </React.Fragment>
        )
    }
}

export default Messages;
