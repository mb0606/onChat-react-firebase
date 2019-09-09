import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import SignUp from "./components/Auth/SignUp";
import SignIn from "./components/Auth/SignIn";
import firebase from "./firebase";

import 'semantic-ui-css/semantic.min.css'

// Setup routing
import { withRouter } from "react-router";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(() => { }, composeWithDevTools());

// Create Stateless functional component for routes
class Root extends React.Component {
  componentDidMount() {
    // listener to detect user in my app
    firebase.auth().onAuthStateChanged(user => {
      this.props.history.push("/");
    })
  }
  render() {
    return (

      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/signup" component={SignUp} />
        <Route path="/signin" component={SignIn} />
      </Switch>

    );
  }
}

// higher order component
const RootWithAuth = withRouter(Root);
// Render Root instead of App (App is route /)
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
