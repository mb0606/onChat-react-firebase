import React from "react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import { Grid, Form, Segment, Button, Header, Message, Image } from "semantic-ui-react";
import logo from "../../logo-5.png";
import "./Auth.css"

class SignIn extends React.Component {
    state = {
        email: "",
        password: "",
        errors: [],
        loading: false,
    };

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    handleSubmit = (event) => {
        event.preventDefault();
        if (this.isFormValid(this.state))
            this.setState({ errors: [], loading: true });
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(signedInUser => {
                console.log(signedInUser);
                this.setState({ loading: false })
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errors: this.state.errors.concat(err),
                    loading: false,
                })
            })

    }
    isFormValid = ({ email, password }) => email && password;

    handleInputError = (errors, inputName) => {
        return errors
            .some(error => error.message.toLowerCase().includes(inputName))
            ? "error"
            : ""
    }
    render() {

        const { email, password, loading, errors } = this.state;
        return (
            <Grid textAlign="center" verticalAlign='middle' className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Image src={logo} centered size="small" />
                    <Header as='h2' textAlign="center">
                        Sign In
          </Header>
                    {this.state.errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(this.state.errors)}
                        </Message>
                    )}
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
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
                            <Button
                                disabled={loading}
                                className={loading ? "loading" : ""}
                                content='Submit'
                                primary size="large" />
                        </Segment>
                        <Message>Dont't have an accoutn?  <Link to="/signup"> Sign Up</Link></Message>
                    </Form>

                </Grid.Column>
            </Grid>

        )
    }
}

export default SignIn;