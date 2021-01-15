import React, { Component } from "react";

import { StyleSheet, Text, View } from "react-native";

import {
  ImageBackground,
  ListView,
  Tile,
  Title,
  Subtitle,
  Overlay,
  Screen,
  NavigationBar,
} from "@shoutem/ui";

export default class PodList extends Component {
  getPodcasts() {
    return require("../assets/podcasts.json");
  }

  renderRow(podcast) {
    return (
      <Tile>
        <Title>{podcast.name}</Title>
      </Tile>
    );
  }

  render() {
    return (
      <Screen>
        <NavigationBar title="PODCASTS" />
        <ListView
          data={this.getPodcasts()}
          renderRow={(podcast) => this.renderRow(podcast)}
        />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
});
