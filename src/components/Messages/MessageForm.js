import React from "react";
import { Segment, Button, Input } from "semantic-ui-react";

class MessageForm extends React.Component {
    render() {
        return (
            <Segment className="message__form">
                <Input
                    fluid
                    name="message"
                    style={{ marginBottom: '0.7em' }}
                    labelPosition="left"
                    placeholder="Let people know what you are thinking"
                />
                <Button.Group icon widths="2">
                    <Button
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