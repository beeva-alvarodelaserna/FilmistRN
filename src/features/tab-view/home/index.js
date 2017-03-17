import React, { Component } from 'react';

import {
  ListView,
  View,
  StyleSheet,
  ScrollView,
  InteractionManager
} from 'react-native';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as historialActions from '../../../redux/actions/historialActions';

import * as firebase from 'firebase';
import * as colors from '../../../common/colors';
import * as settingsService from '../../../services/settings-service';
import * as userService from '../../../services/user-service';
import * as themoviedb from '../../../services/movies-service';

import Loading from '../../../common/loading';
import CategoriesList from '../../../common/categories-list';
import MoviesListHorizontal from '../../../common/movie-list-horizontal';
import Featured from '../../../common/featured';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      allData: null,
      allLoaded: false
    };
  }

  componentWillMount() {
    themoviedb.getAllPopular().then((data) => {

      console.log(data);

      this.setState({
        allData: data,
        allLoaded: true,
      });
    });
  }

  render() {
    if (!this.state.allLoaded) {
      return (
        <View style={{marginTop: 20}}>
          <Loading color={colors.getList().app} />
        </View>
      );
    }

    return (
      <View renderToHardwareTextureAndroid={true} renderToHardwareTextureAndroid={true}>

        <ScrollView style={styles.containerLists}>

          <CategoriesList />

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
            list={ds.cloneWithRows(this.state.allData[2].results)}
            collection="top_rated"
            position="horizontal"
            {...this.props} />

          {/*<MoviesListHorizontal
            title="Películas recomendadas"
            type="movie"
            list={ds.cloneWithRows(this.state.allData[2].results)}
            collection="popular"
            position="horizontal"
            {...this.props} />*/}

          <MoviesListHorizontal
            title="Series top en Filmist"
            type="tv"
            list={ds.cloneWithRows(this.state.allData[3].results)}
            collection="popular"
            position="horizontal"
            {...this.props} />

          {/*<MoviesListHorizontal
            title="Descubre más series"
            type="tv"
            list={ds.cloneWithRows(this.state.allData[4].results)}
            collection="top_rated"
            position="horizontal"
            {...this.props} />*/}

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

function mapStateToProps(state, ownProps) {
  return {
     historial: state.historial
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      historial: bindActionCreators(historialActions, dispatch)
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
