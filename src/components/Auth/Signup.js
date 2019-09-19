import React from "react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import { Grid, Form, Segment, Button, Header, Message, Image } from "semantic-ui-react";
import logo from "../../logo-5.png";
import md5 from 'md5';
import "./Auth.css"

class SignUp extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false,
    // gives us back a reference to the database which we 
    // can set
    userRef: firebase.database().ref("user")

  };
  isFormValid = () => {
    let errors = [];
    let error;
    if (this.isFormEmpty(this.state)) {
      error = { message: "Fill in all fields" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: "Password is invalid" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  }
  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return !username || !email || !password || !passwordConfirmation
  }
  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  }
  displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormValid())
      this.setState({ errors: [], loading: true })
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(createdUser => {
        // returned from firebase a user object
        console.log(createdUser);
        createdUser.user.updateProfile({
          displayName: this.state.username,
          photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
        })
          .then(() => {
            this.saveUser(createdUser).then(() => {
              console.log("user saved");
            })
            this.setState({ loading: false })
          })
          .catch(err => {
            this.setState({ errors: this.state.errors.concat(err), loading: false })
            console.error(err);
          })
      })
      .catch(err => {
        this.setState({ errors: this.state.errors.concat(err), loading: false })
        console.error(err);
      })
  }
  saveUser = (createdUser) => {
    // set an object on the userId
    return this.state.userRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
    })
  }
  handleInputError = (errors, inputName) => {
    return errors
      .some(error => error.message.toLowerCase().includes(inputName))
      ? "error"
      : ""
  }
  render() {

    const { username, email, password, passwordConfirmation, loading, errors } = this.state;
    return (
      <Grid textAlign="center" verticalAlign='middle' className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Image src={logo} centered size="small" />
          <Header as='h2' textAlign="left">
            SIGN UP
          </Header>
          {this.state.errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(this.state.errors)}
            </Message>
          )}
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
                className={this.handleInputError(errors, "email")}
              />
              <Form.Input fluid name='password'
                value={password}
                icon="lock" iconPosition="left"
                placeholder='Password' type="password"
                className={this.handleInputError(errors, "password")}
                onChange={this.handleChange}
              />
              <Form.Input fluid name='passwordConfirmation'
                value={passwordConfirmation}
                icon="repeat" iconPosition="left"
                placeholder='Password Confirmation' type="password"
                className={this.handleInputError(errors, "password")}

                onChange={this.handleChange}
              />
              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                content='Submit'
                primary size="large" />
            </Segment>
            <Message>Already a user?  <Link to="/signin"> Sign In</Link></Message>
          </Form>

        </Grid.Column>
      </Grid>

    )
  }
}
export default SignUp;