import React from "react";
import { Link } from "react-router-dom";
import firebase from "../../firebase"
import { Grid, Form, Segment, Button, Header, Message, Image } from "semantic-ui-react"
import logo from "../../logo-image.jpg"
import "./Auth.css"

class SignUp extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",

  };
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }
  handleSubmit = (event) => {
    event.preventDefault();
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(createdUser => {
        console.log(createdUser);
      })
      .catch(err => {
        console.error(err);
      })
  }
  render() {

    const { username, email, password, passwordConfirmation } = this.state;
    return (
      <Grid textAlign="center" verticalAlign='middle' className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Image src={logo} centered size="small" />
          <Header as='h1' textAlign="center">
            ONCHAT
          </Header>
          <Header as='h2' textAlign="center">
            Sign Up
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input fluid name="username"
                value={username}
                icon="user" iconPosition="left"
                placeholder='Username' type="text"
                onChange={this.handleChange}
              />
              <Form.Input fluid name="email"
                value={email}
                icon="mail" iconPosition="left"
                placeholder='Email' type="email"
                onChange={this.handleChange}
              />
              <Form.Input fluid name='password'
                value={password}
                icon="lock" iconPosition="left"
                placeholder='Password' type="password"
                onChange={this.handleChange}
              />
              <Form.Input fluid name='passwordConfirmation'
                value={passwordConfirmation}
                icon="repeat" iconPosition="left"
                placeholder='Password Confirmation' type="password"
                onChange={this.handleChange}
              />
              <Button content='Submit' primary size="large" />
            </Segment>
            <Message>Already a user?  <Link to="/signin"> Sign In</Link></Message>
          </Form>
        </Grid.Column>
      </Grid>

    )
  }
}
export default SignUp;