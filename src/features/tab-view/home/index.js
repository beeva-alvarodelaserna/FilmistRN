import * as firebase from 'firebase';

import React, { Component } from 'react';

import {
  ListView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ScrollView,
  InteractionManager
} from 'react-native';

import * as settingsService from '../../../services/settings-service';
import * as userService from '../../../services/user-service';
import * as themoviedb from '../../../services/movies-service';

import Loading from '../../../common/loading';
import CategoriesList from '../../../common/categories-list';
import MoviesListHorizontal from '../../../common/movie-list-horizontal';
import Featured from '../../../common/featured';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      allData: null,
      allLoaded: false
    };
  }

  componentWillMount() {
    let user         = firebase.auth().currentUser;
    let featuredRef = firebase.database().ref('featured');

    // InteractionManager.runAfterInteractions(() => {
      themoviedb.getAllPopular().then((data) => {

        featuredRef.on('value', (snapshot) => {
          this.setState({
            featureData: {
              title: snapshot.val().title,
              subtitle: snapshot.val().subtitle,
              background: snapshot.val().background,
              visible: snapshot.val().visible,
            },
            allData: data,
            allLoaded: true,
          });
        });

        // this.setState({
        //   allData: data,
        //   allLoaded: true,
        // });

      });
    // });
  }

  render() {
    if (!this.state.allLoaded) {
      return (
        <View style={{marginTop: 20}}>
          <Loading />
        </View>
      )
    }

    return (
      <View renderToHardwareTextureAndroid={true}>

        <ScrollView style={styles.containerLists}>

          <CategoriesList {...this.props} />

          <Featured data={this.state.featureData} />

          <MoviesListHorizontal
            title="Ahora en los cines"
            type="movie"
            list={ds.cloneWithRows(this.state.allData[0].results)}
            collection="now_playing"
            position="horizontal"
            {...this.props} />

          <MoviesListHorizontal
            title="Próximos estrenos"
            type="movie"
            list={ds.cloneWithRows(this.state.allData[1].results)}
            collection="upcoming"
            position="horizontal"
            {...this.props} />

          <MoviesListHorizontal
            title="Películas top en Filmist"
            type="movie"
            list={ds.cloneWithRows(this.state.allData[3].results)}
            collection="top_rated"
            position="horizontal"
            {...this.props} />

          <MoviesListHorizontal
            title="Películas recomendadas"
            type="movie"
            list={ds.cloneWithRows(this.state.allData[2].results)}
            collection="popular"
            position="horizontal"
            {...this.props} />

          <MoviesListHorizontal
            title="Series top en Filmist"
            type="tv"
            list={ds.cloneWithRows(this.state.allData[3].results)}
            collection="popular"
            position="horizontal"
            {...this.props} />

          <MoviesListHorizontal
            title="Descubre más series"
            type="tv"
            list={ds.cloneWithRows(this.state.allData[3].results)}
            collection="top_rated"
            position="horizontal"
            {...this.props} />


          <View style={{paddingVertical: 15}}></View>

        </ScrollView>
      </View>
    )

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerLists: {
    paddingTop: 10
  },
  button: {
    margin: 7,
    padding: 5,
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    borderRadius: 3,
  },
});
