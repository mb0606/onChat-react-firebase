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
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";
import { setUser } from "./actions"

const store = createStore(rootReducer, composeWithDevTools());

// Create Stateless functional component for routes
class Root extends React.Component {
  componentDidMount() {
    console.log(this.props.isLoading)
    // listener to detect user in my app
    firebase.auth().onAuthStateChanged(user => {
      this.props.setUser(user);
      this.props.history.push("/");
    })
  }
  render() {
    return this.props.isLoading ? <Spinner /> : (

      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/signup" component={SignUp} />
        <Route path="/signin" component={SignIn} />
      </Switch>

    );
  }
}
const mapStateFromProps = state => ({
  isLoading: state.user.isLoading
});

// higher order component
const RootWithAuth = withRouter(connect(mapStateFromProps, { setUser })(Root));
// Render Root instead of App (App is route /)
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root"));

