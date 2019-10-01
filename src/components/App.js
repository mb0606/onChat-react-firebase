import React from "react";
import { connect } from "react-redux";
import "./App.css";
import { Grid } from "semantic-ui-react";
import ColorPanel from "./ColorPanel/ColorPanel"
import SidePanel from "./SidePanel/SidePanel"
import Messages from "./Messages/Messages"
import MetaPanel from "./MetaPanel/MetaPanel"

const App = ({ currentUser }) => (
  <Grid columns="equal" className="app">
    <ColorPanel />
    <SidePanel currentUser={currentUser} />

    <Grid.Column style={{ marginLeft: 320 }} width={8}>
      <Messages />
    </Grid.Column>
    <Grid.Column width={2}>
      <MetaPanel />
    </Grid.Column>

  </Grid>

)
const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
})

export default connect(mapStateToProps)(App);
