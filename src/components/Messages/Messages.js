import React from "react";
import { Segment, Comment, MessageHeader } from "semantic-ui-react";

class Messages extends React.Component {
    render() {
        return (
            <React.Fragment>
                <MessagesHeader />>

                    <Segment>
                    <Comment.Group>
                        Messages
                    </Comment.Group>
                </Segment>


            </React.Fragment>
        )
    }
}

export default Messages;