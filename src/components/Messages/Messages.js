import React from "react";
import { connect } from "react-redux";
import { Segment, Comment } from "semantic-ui-react";
import MessageForm from "./MessageForm";
import MessagesHeader from "./MessagesHeader";
import Message from "./Message";
import Type from "./Typing";
import Skeleton from "./Skeleton"
import { setUserPosts } from "../../actions";
import firebase from "../../firebase";

class Messages extends React.Component {
    state = {
        messagesRef: firebase.database().ref('messages'),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        isChannelStarred: false,
        messages: [],
        messagesLoading: true,
        numUniqueUsers: '',
        searchTerm: '',
        searchLoading: false,
        searchResults: [],
        privateChannel: this.props.isPrivateChannel,
        privateMessagesRef: firebase.database().ref('privateMessages'),
        usersRef: firebase.database().ref('users'),
        typingRef: firebase.database().ref("typing"),
        connectedRef: firebase.database().ref(".info/connected"),
        listeners: [],
        typingUsers: []
    }
    componentDidMount() {
        const { channel, user, listeners } = this.state;
        if (channel && user) {
            this.removeListeners(listeners);
            this.addListeners(channel.id);
            this.addUserStarsListener(channel.id, user.uid);
        }
    }

    addToListeners = (id, ref, event) => {
        const index = this.state.listeners.findIndex(listener => {
            return listener.id === id && listener.ref === ref && listener.event === event;
        })

        if (index === -1) {
            const newListener = { id, ref, event };
            this.setState({ listeners: this.state.listeners.concat(newListener) });
        }
    }


    componentWillUnmount() {
        this.removeListeners(this.state.listeners);
        this.state.connectedRef.off();
    }

    removeListeners = listeners => {
        listeners.forEach(listener => {
            listener.ref.child(listener.id).off(listener.event);
        })
    }

    componentDidUpdate(preProps, prevState) {
        if (this.messagesEnd) {
            this.scrollToBottom();
        }
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
    addUserStarsListener = (channelId, userId) => {
        this.state.usersRef
            .child(userId)
            .child('starred')
            .once('value')
            .then(data => {
                if (data.val() !== null) {
                    const channelIds = Object.keys(data.val());
                    const prevStarred = channelIds.includes(channelId);
                    this.setState({ isChannelStarred: prevStarred });
                }
            })
    }
    displayChannelName = channel => channel ? `#${channel.name}` : "";

    addListeners = channelId => {
        this.addMessageListeners(channelId);
        this.addTypingListeners(channelId);
    }

    addTypingListeners = channelId => {
        let typingUsers = [];
        this.state.typingRef.child(channelId).on("child_added", snap => {
            if (snap.key !== this.state.user.uid) {
                typingUsers = typingUsers.concat({
                    id: snap.key,
                    name: snap.val()
                })
                this.setState({ typingUsers });
            }
        })

        this.addToListeners(channelId, this.state.typingRef, "child_added");

        this.state.typingRef.child(channelId).on("child_removed", snap => {
            const index = typingUsers.findIndex(user => user.id === snap.key);
            if (index !== -1) {
                typingUsers = typingUsers.filter(user => user.id !== snap.key);
                this.setState({ typingUsers });
            }
        })

        this.addToListeners(channelId, this.state.typingRef, "child_removed");

        this.state.connectedRef.on("value", snap => {
            if (snap.val() === true) {
                this.state.typingRef.child(channelId)
                    .child(this.state.user.uid)
                    .onDisconnect()
                    .remove(err => {
                        if (err !== null) {
                            console.error(err);
                        }
                    })
            }
        })

    }

    addMessageListeners = channelId => {
        let loadedMessages = [];
        const ref = this.getMessagesRef();
        ref.child(channelId)
            .on('child_added', snap => {
                loadedMessages.push(snap.val());
                this.setState({
                    messages: loadedMessages,
                    messagesLoading: false,
                })
                this.countUniqueUsers(loadedMessages);
                this.countUserPost(loadedMessages);
            })
        this.addToListeners(channelId, ref, "child_added");

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

    handleStar = () => {
        this.setState(prevState => ({
            isChannelStarred: !prevState.isChannelStarred
        }), () => this.starChannel());

    }
    starChannel = () => {
        if (this.state.isChannelStarred) {
            this.state.usersRef
                .child(`${this.state.user.uid}/starred`)
                .update({
                    [this.state.channel.id]: {
                        name: this.state.channel.name,
                        details: this.state.channel.details,
                        createdBy: {
                            name: this.state.channel.createdBy.name,
                            avatar: this.state.channel.createdBy.avatar
                        }
                    }
                })

        } else {
            this.state.usersRef
                .child(`${this.state.user.uid}/starred`)
                .child(this.state.channel.id)
                .remove(err => {
                    if (err != null) {
                        console.err(err)
                    }
                })
        }
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

    countUserPost = messages => {
        let userPosts = messages.reduce((acc, message) => {
            if (message.user.name in acc) {
                acc[message.user.name].count += 1;
            } else {
                acc[message.user.name] = {
                    avatar: message.user.avatar,
                    count: 1
                }
            }
            return acc;
        }, {});
        this.props.setUserPosts(userPosts);
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
    displayTypingUsers = users => {
        return users.length > 0 && users.map(user => (
            <div key={user.id} style={{ display: "flex", alignItems: "center", marginBottom: "0.2em" }}>
                <span className="user__typing"> {user.name} is typing </span><Type />

            </div>
        ))
    }

    displayMessageSkeleton = loading => (
        loading ? (
            <React.Fragment>
                {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} />
                ))}
            </React.Fragment>
        ) : null
    )

    render() {
        const {
            messagesRef, channel, user, messages, privateChannel,
            numUniqueUsers, searchTerm, searchResults, isChannelStarred,
            searchLoading, typingUsers, messagesLoading
        } = this.state;
        return (
            <React.Fragment >
                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                    numUniqueUsers={numUniqueUsers}
                    handleSearchChange={this.handleSearchChange}
                    searchLoading={searchLoading}
                    isPrivateChannel={privateChannel}
                    handleStar={this.handleStar}
                    isChannelStarred={isChannelStarred}
                />

                <Segment>
                    <Comment.Group className="messages">
                        {this.displayMessageSkeleton(messagesLoading)}
                        {searchTerm ?
                            this.displayMessages(searchResults) :
                            this.displayMessages(messages)
                        }
                        {this.displayTypingUsers(typingUsers)}
                        <div ref={node => (this.messagesEnd = node)}></div>
                    </Comment.Group>
                </Segment>

                <MessageForm
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    isPrivateChannel={privateChannel}
                    getMessagesRef={this.getMessagesRef}
                />

            </React.Fragment >
        )
    }
}

export default connect(null, { setUserPosts })(Messages);
