import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";

// Setup routing
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Create Stateless functional component for routes
const Root = () => {
  <Router>
    <Switch>
      <Route path="/" components={App} />
    </Switch>
  </Router>;
};

// Render Root instead of App (App is route /)
ReactDOM.render(<Root />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
