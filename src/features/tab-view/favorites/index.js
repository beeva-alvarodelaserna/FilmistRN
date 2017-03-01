import React, { Component } from 'react';

import {
  ListView,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  StyleSheet
} from 'react-native';

import * as firebase from 'firebase';
import * as colors from '../../../common/colors';
import * as themoviedb from '../../../services/movies-service';
import * as userService from '../../../services/user-service';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import FavoriteList from './favorite-list';

export default class Favorites extends Component {

  constructor(props) {
    super(props);

    this.state = {
      saved: [],
      viewed: [],
      favorite: []
    };
  }

  componentDidMount() {
    let user = firebase.auth().currentUser;

    firebase.database().ref('users/' + user.uid + '/list/favorite').on('value', (snapshot) => {
      if (snapshot.val()) {
        let favoritesListLimit = [];

        for (let i = 0; i < snapshot.val().length; i++) {
          if (i < 5) {
            favoritesListLimit.unshift(snapshot.val()[i]);
          }
        }

        this.setState({
          favorite: favoritesListLimit
        });
      } else {
        this.setState({
          favorite: []
        });
      }
    });

    firebase.database().ref('users/' + user.uid + '/list/saved').on('value', (snapshot) => {
      if (snapshot.val()) {
        this.setState({
          saved: snapshot.val().reverse()
        });
      } else {
        this.setState({
          saved: []
        });
      }
    });

    firebase.database().ref('users/' + user.uid + '/list/viewed').on('value', (snapshot) => {
      if (snapshot.val()) {
        this.setState({
          viewed: snapshot.val().reverse()
        });
      } else {
        this.setState({
          viewed: []
        });
      }
    });

  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <FavoriteList title="Las quiero ver" list={this.state.saved} type="saved" />
        <FavoriteList title="Las he visto" list={this.state.viewed} type="viewed" />
        <FavoriteList title="Mis favoritas" list={this.state.favorite} type="favorite" />
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
