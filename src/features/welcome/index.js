import * as firebase from 'firebase';

import React, { Component } from 'react';

import {
  StatusBar,
  View,
  Text,
  Image,
  StyleSheet,
  AsyncStorage,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import * as loginService from '../../services/login-service';
import * as settingsService from '../../services/settings-service';
import * as userService from '../../services/user-service';
import * as moviesService from '../../services/movies-service';
import * as colors from '../../common/colors';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Loading from '../../common/loading';

const { width, height } = Dimensions.get('window');

export default class Welcome extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showWelcome: false
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        userService.setCurrentUser(user);
        firebase.database().ref('users/' + user.uid).on('child_added', (data) => {
          if (data.val() && typeof data.val() !== 'undefined' && data.val() !== '') {
            settingsService.setOption('lang', data.val().lang);
            settingsService.setOption('allowExitApp', data.val().allowExitApp);
            settingsService.setOption('avatar', data.val().avatar);
            // moviesService.init();
            moviesService.getNavigator().resetTo({index: 1, title: 'home'});
          }
        });
      } else {
        this.setState({showWelcome: true});
      }
    });
  }

  _goTo(route) {
    if (route === 'login') {
      moviesService.getNavigator().push({index: 0.1, title: 'login'});
    } else {
      moviesService.getNavigator().push({index: 0.2, title: 'register'});
    }
  }

  render() {

    if (this.state.showWelcome) {
      return (
        <View style={styles.container} renderToHardwareTextureAndroid={true}>

          <Image source={require('../../assets/img/logo.png')} style={styles.logo}/>

          <Text style={styles.welcome1}>
            Bienvenido a Filmist
          </Text>

          <Text style={styles.welcome2}>
            Busca, sincroniza y comparte tus películas y series favoritas
          </Text>

          <TouchableOpacity
            onPress={this._goTo.bind(this, 'login')}
            style={styles.buttonDark}
            activeOpacity={0.9}>
            <Text style={styles.textLight}>
              INICIAR SESIÓN
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this._goTo.bind(this, 'register')}
            style={styles.button}
            activeOpacity={0.9}>
            <Text style={styles.text}>
              REGÍSTRATE
            </Text>
          </TouchableOpacity>

        </View>
      )
    } else {
      return (
        <View style={{backgroundColor: colors.getList().primary, height: height}}>
          <Loading position="center" />
        </View>
      );
    }

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.getList().primary,
    padding: 30
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20
  },
  welcome1: {
    color: colors.getList().white,
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 35,
    marginBottom: 5
  },
  welcome2: {
    color: colors.getList().white,
    textAlign: 'left',
    fontSize: 20,
    marginBottom: 40
  },
  button: {
    paddingTop: 17,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 17,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: colors.getList().app,
    backgroundColor: colors.getList().primary,
    marginBottom: 20,
    minWidth: 300
  },
  buttonDark: {
    paddingTop: 17,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 17,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: colors.getList().app,
    backgroundColor: colors.getList().app,
    marginBottom: 15,
    minWidth: 300
  },
  text: {
    color: colors.getList().app,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14
  },
  textLight: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14
  }
});
