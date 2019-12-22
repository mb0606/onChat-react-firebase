import React from "react";
import { connect } from "react-redux";
import { Segment, Comment } from "semantic-ui-react";
import MessageForm from "./MessageForm";
import MessagesHeader from "./MessagesHeader";
import Message from "./Message";
import Type from "./Typing"
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
        usersRef: firebase.database().ref('users')
    }
    componentDidMount() {
        const { channel, user } = this.state;
        if (channel && user) {
            this.addListeners(channel.id);
            console.log("this is the user =====> ", user)
            this.addUserStarsListener(channel.id, user.uid);
        }
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
                this.countUserPost(loadedMessages);
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

    render() {
        const {
            messagesRef, channel, user, messages, privateChannel,
            numUniqueUsers, searchTerm, searchResults, isChannelStarred, searchLoading
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
                        {searchTerm ?
                            this.displayMessages(searchResults) :
                            this.displayMessages(messages)
                        }
                        <div style={{ dislay: "flex", alignItems: "center" }}>
                            <span className="user__typing"> marco is typing</span>
                            <Type />
                        </div>
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
