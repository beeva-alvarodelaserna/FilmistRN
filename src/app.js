import React, { Component } from 'react';

import {
  StatusBar,
  Navigator,
  BackAndroid,
  Platform,
  View,
  Alert,
  StyleSheet,
} from 'react-native';

import * as themoviedb from './services/movies-service';
import * as colors from './common/colors';

import Login from './features/login';
import TabView from './features/tab-view';
import MovieDetail from './features/movie-detail';
import TopList from './features/top-list';
import Search from './features/search';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 1
    }
  }

  componentDidMount() {

    themoviedb.init();

    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', () => {
        let fakeSwitchExit = themoviedb.getAllowExitApp();

        if (this.state.currentIndex > 1 || fakeSwitchExit) {
          themoviedb.getNavigator().pop();
        } else {
          Alert.alert(
            'Salir',
            '¿Realmente quieres salir?',
            [
              {text: 'No', onPress: () => { return false }, style: 'cancel' },
              {text: 'Sí', onPress: () => BackAndroid.exitApp() }
            ]
          );
        }

        return true;
      });
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
  }

  handleBackButton() {
    return false;
  }

  navigatorRenderScene(route, navigator) {

    this.state.currentIndex = route.index;

    themoviedb.setNavigator(navigator);

    switch (route.index) {
      case 0:
        return <Login />;
      case 1:
        return (
          <TabView />
        );
      case 2:
        return (
          <MovieDetail />
        );
      case 3:
        return(
          <Search />
        );
      case 4:
        return(
          <TopList />
        );
    }

  }

  render() {
    return (
      <View style={styles.container} renderToHardwareTextureAndroid={true}>

        <StatusBar hidden={false} backgroundColor={colors.getList().statusBar} translucent={true} />

        <Navigator
          ref="navigator"
          initialRoute={{ index: 1 }}
          renderScene={this.navigatorRenderScene.bind(this)}
          configureScene={(route) => Navigator.SceneConfigs.FloatFromBottomAndroid }
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.getList().primary
  }
});
