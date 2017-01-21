import React, { Component } from 'react';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ListView,
  StyleSheet,
  Dimensions,
  InteractionManager
} from 'react-native';

import * as themoviedb from '../services/movies-service.js';
import * as colors from './colors';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Loading from './loading';

const { width, height } = Dimensions.get('window');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var movies = [];
var page = 2;

export default class MoviesList extends Component {

  constructor(props) {
    super(props);

    if (typeof this.props.list !== 'undefined') {
      movies = this.props.list;
    }

    this.state = {
      dataMovies: typeof this.props.list === 'undefined' ? [] : this.props.list
    };
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.loadMovies();
    });
  }

  loadMovies() {

    if (this.props.collection === 'similar') {
      themoviedb.getSimilar(this.props.type, themoviedb.getCurrentMovie().id).then((data) => {
        movies = [];
        movies = data;
        page   = 2;
        this.setState({ 'dataMovies': ds.cloneWithRows(data) });
      });
    }

    if (this.props.collection === 'search') {
      themoviedb.search(this.props.query).then((data) => {
        movies = [];
        movies = data;
        page   = 2;
        this.setState({ 'dataMovies': ds.cloneWithRows(data) });
      });
    }

    if (this.props.collection !== 'similar' && this.props.collection !== 'search') {
      themoviedb.getPopular(this.props.type, this.props.collection).then((data) => {
        movies = [];
        movies = data;
        page   = 2;
        this.setState({ 'dataMovies': ds.cloneWithRows(data) });
      });
    }


  }

  _onSelectMovie(movie) {
    // themoviedb.getMovie('movie', movie.id).then((data) => {
    //   data.runtime = data.runtime === 0 ? 90 : data.runtime;
    //   themoviedb.setCurrentMovie(data);
    //   themoviedb.getNavigator().push({index: 2, route: 'movie-detail'});
    // });

    themoviedb.setCurrentMovie(movie);
    themoviedb.getNavigator().push({index: 2, route: 'movie-detail'});
  }

  renderMovieList(movie) {
    return(
      <View>
        <TouchableOpacity
          style={{marginHorizontal: 0, marginTop: 0, borderTopWidth: 15, borderColor: colors.getList().primary}}
          onPress={this._onSelectMovie.bind(this, movie)}
          activeOpacity={0.9}>
          <View style={{flexDirection: 'row', backgroundColor: colors.getList().secondary}}>
            <Image
              resizeMode={'cover'}
              style={{width: 100, height: 150, marginRight: 10, backfaceVisibility: 'hidden'}}
              source={{uri: 'http://image.tmdb.org/t/p/w150' + movie.poster_path}} />
            <View>
              <Text style={{color: '#FFF', fontSize: 16, fontWeigth: 300, lineHeight: 25, width: width - 150}}>{movie.title}</Text>
              <Text style={{color: '#999', fontSize: 14, lineHeight: 25}}>{movie.release_date.split('-')[0]}</Text>
              <Text style={{color: '#FFF', fontSize: 16, marginTop: 20}}>{movie.vote_average}</Text>
              <Text style={{color: '#FFF', fontSize: 16, marginTop: 5}}>{movie.vote_count}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  infiniteScroll = () => {
    if (this.props.collection === 'similar') {
      themoviedb.getSimilar(this.props.type, themoviedb.getCurrentMovie().id, page).then((data) => {
        Array.prototype.push.apply(movies, data);
        this.setState({ 'dataMovies': ds.cloneWithRows(movies) });
        page++;
      });
    }

    if (this.props.collection === 'search') {
      themoviedb.search(this.props.query, page).then((data) => {
        Array.prototype.push.apply(movies, data);
        this.setState({ 'dataMovies': ds.cloneWithRows(movies) });
        page++;
      });
    }

    themoviedb.getPopular(this.props.type, this.props.collection, page).then((data) => {
      Array.prototype.push.apply(movies, data);
      this.setState({ 'dataMovies': ds.cloneWithRows(movies) });
      page++;
    });

  }

  renderScrollMovieList() {
    if (this.state.dataMovies.length === 0) {
      return (
        <Loading />
      )
    }

    return (
      <View style={{paddingBottom: 80, paddingHorizontal: 15, backgroundColor: colors.getList().primary}}>
        <ListView
          ref={(scrollView) => { _scrollView = scrollView; }}
          initialListSize={1}
          style={{backgroundColor: colors.getList().primary }}
          dataSource={this.state.dataMovies}
          renderRow={(rowData) => this.renderMovieList(rowData)}
          onEndReached={this.infiniteScroll}
          showsVerticalScrollIndicator={false}
          horizontal={false} />
      </View>
    )
  }

  render() {
    return (
      <View>
        {this.renderScrollMovieList()}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  title: {
    color: '#DDD',
    fontWeight: '300',
    paddingTop: 5,
    paddingLeft: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  titleVertical: {
    color: '#FFF',
    // backgroundColor: colors.getList().primary,
    fontWeight: '300',
    paddingTop: 5,
    paddingLeft: 15,
    fontSize: 16,
    marginBottom: 15
  },
  viewAll: {
    color: colors.getList().app,
    fontSize: 11,
    marginTop: 3,
    marginRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    minWidth: 80,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.getList().app,
    textAlign: 'center'
  },
  movie: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 5,
    borderTopWidth: 2,
    borderBottomWidth: 2,
  },
});