import React from "react";
import { connect } from "react-redux";
import "./App.css";
import { Grid } from "semantic-ui-react";
import ColorPanel from "./ColorPanel/ColorPanel"
import SidePanel from "./SidePanel/SidePanel"
import Messages from "./Messages/Messages"
import MetaPanel from "./MetaPanel/MetaPanel"

const App = ({ currentUser,
  currentChannel,
  isPrivateChannel,
  userPosts,
  secondaryColor,
  primaryColor }) => (
    <Grid columns="equal" className="app" style={{ backgroundImage: `linear-gradient(120deg, ${secondaryColor} 0%, #ebedee 100%)` }}>
      <ColorPanel
        key={currentUser && currentUser.name}
        currentUser={currentUser} />
      <SidePanel
        key={currentUser && currentUser.uid}
        currentUser={currentUser}
        primaryColor={primaryColor}
      />

      <Grid.Column style={{ marginLeft: 320 }} width={8}>
        <Messages
          key={currentChannel && currentChannel.name}
          currentChannel={currentChannel}
          currentUser={currentUser}
          isPrivateChannel={isPrivateChannel}
        />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel
          key={currentChannel && currentChannel.id}
          currentChannel={currentChannel}
          isPrivateChannel={isPrivateChannel}
          userPosts={userPosts}
        />
      </Grid.Column>

    </Grid>

  )
const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  userPosts: state.channel.userPosts,
  primaryColor: state.colors.primaryColor,
  secondaryColor: state.colors.secondaryColor
})

export default connect(mapStateToProps)(App);
