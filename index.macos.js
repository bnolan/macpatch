/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import cheerio from 'cheerio-without-node-native';
import { AppRegistry, StyleSheet, ScrollView, Image, Text, View } from 'react-native';
const Entities = require('html-entities').AllHtmlEntities;

export default class macpatch extends Component {
  constructor () {
    super()

    this.state = {
      messages: []
    }
  }

  componentDidMount () {
    fetch('http://localhost:8027/public?limit=200')
      .then((r) => r.text())
      .then((body) => {
        const $ = cheerio.load(body)

        const messages = [];

        Array.from($('tr.msg-row')).forEach((row) => {
          const message = {
            avatar: $(row).find('img').attr('src'),
            author: $(row).find('.msg-left').text(),
            body: $(row).next().find('.msg-content').html(),
            actions: $(row).find('.msg-right').html()
          }

          if (!message.body) {
            return;
          }

          if (message.actions.match(/markdown/)) {
          } else {
            return;
          }

          messages.push(message);
        })

        this.setState({messages});
      })
  }

  render() {
    const messages = this.state.messages.map((m) => {
      const uri = `http://localhost:8027${m.avatar}`;

      return (
        <View key={m.body} style={styles.message}>
          <Image
            style={styles.messageAvatar}
            source={{uri}} />
          <View style={styles.messageContent}>
            <Text style={styles.messageAuthor}>{m.author}:</Text>
            <Text>{Entities.decode(m.body.replace(/<.+?>/g, ' ')).replace(/[\n\r\s]+/g, ' ').replace(/^[\n\r\s]+/, '')}</Text>
          </View>
        </View>
      );
    });

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Macpatch
          </Text>
        </View>

        <ScrollView style={styles.container}>
          <View>
            { messages }
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  header: {
    backgroundColor: '#6A8CD2'
  },
  headerText: {
    fontSize: 18,
    color: '#ffffff',
    padding: 6,
    paddingTop: 20
  },
  message: {
    borderBottomWidth: 1,
    borderColor: '#cccccc',
    backgroundColor: 'white',
    padding: 6,
    flexDirection: 'row'
  },
  messageAvatar: {
    width: 48,
    height: 48,
    borderRadius: 4,
    margin: 4
  },
  messageContent: {
    flexDirection: 'column',
    flex: 1,
    marginLeft: 4
  },
  messageAuthor: {
    fontWeight: 'bold',
    color: '#555555'
  },
  welcome: {
    fontSize: 20,
    padding: 6,
    paddingTop: 40,
    color: '#555555'
  }
});

AppRegistry.registerComponent('macpatch', () => macpatch);
