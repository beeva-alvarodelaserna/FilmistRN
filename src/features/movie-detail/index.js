import React, { Component } from 'react';

import {
  Text,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Share,
  InteractionManager
} from 'react-native';

import * as themoviedb from '../../services/movies-service';
import * as colors from '../../common/colors';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../../common/header';
import Loading from '../../common/loading';
import Score from '../../common/score';

import MoviesListHorizontal from '../../common/movie-list-horizontal';

const { width, height } = Dimensions.get('window');

export default class MovieDetail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      // movie: null,
      // loaded: false,
      movie: themoviedb.getCurrentMovie(),
      loaded: true,
      overviewNumberLines: 2
    }
  }

  componentDidMount() {
    // InteractionManager.runAfterInteractions(() => {
    themoviedb.getMovie('movie', themoviedb.getCurrentMovie().id).then((data) => {
      data.runtime = data.runtime === 0 ? 90 : data.runtime;
      this.setState({
        movie: data,
        loaded: true
      });
    });
    // });
  }

  _onActionSelected = (action) => {
    switch (action) {
      case 'left':
        themoviedb.getNavigator().pop();
        break;
      case 'right':
        this.share();
        break;
    }
  }

  share() {
    Share.share({
      message: 'Te recomiendo esta película: https://filmist.es/movies/' + this.state.movie.id
    })
    .then(() => console.log('ok'))
    .catch((error) => this.setState({result: 'error: ' + error.message}));
  }

  _onExtendOverview = () => {
    if (this.state.overviewNumberLines <= 2) {
      this.setState({overviewNumberLines: 100});
    } else {
      this.setState({overviewNumberLines: 2});
      // _scrollView.scrollTo({y: 0, x: 0, animated: true});
    }

  }

  _renderMoreLinesText = () => {
    if (this.state.overviewNumberLines <= 2) {
      return 'LEER MÁS';
    } else {
      return 'LEER MENOS';
    }
  }

  _renderMoreLinesIcon = () => {
    if (this.state.overviewNumberLines <= 2) {
      return 'expand-more';
    } else {
      return 'expand-less';
    }
  }

  render() {

    if (!this.state.loaded) {
      return (
        <View style={{backgroundColor: colors.getList().primary, height: height}}>

          <View style={{backgroundColor: colors.getList().secondary, height: 220}}>
            <Header
              isTransparent={true}
              title=""
              actions={{ left: { icon: 'arrow-back' }, right: { icon: 'share' } }}
              onActionSelected={this._onActionSelected.bind(this)} />
          </View>

          <View style={{position: 'absolute', top: 130, left: 15, width: 110, height: 150}}>
            <View style={{width: 110, height: 150, backgroundColor: '#111', borderRadius: 3, borderWidth: 1, borderColor: '#111', backfaceVisibility: 'hidden'}}></View>
          </View>

          <View style={{padding: 0, marginTop: 60}}>

            <View style={styles.infoContainer}>
              <Text style={styles.infoItemFake}><Icon name='thumb-up' /> 0</Text>
              <Text style={styles.infoItemFake}><Icon name='favorite' /> 0</Text>
              <Text style={styles.infoItemFake}><Icon name='timelapse' /> 0</Text>
            </View>

            <View style={{padding: 15}}>
              <View style={{marginVertical: 10, marginBottom: 20}}>
                <Text style={{width: width-200, height: 20, backgroundColor: '#222'}}></Text>
              </View>
              <View>
                <Text style={{width: width-150, height: 20, backgroundColor: colors.getList().secondary, marginBottom: 10}}></Text>
                <Text style={{width: width-40, height: 20, backgroundColor: colors.getList().secondary, marginBottom: 10}}></Text>
                <Text style={{width: width-40, height: 20, backgroundColor: colors.getList().secondary, marginBottom: 10}}></Text>
                <Text style={{width: width-40, height: 20, backgroundColor: colors.getList().secondary, marginBottom: 10}}></Text>
              </View>
            </View>
            <View style={{height: height, backgroundColor: '#000', paddingHorizontal: 15, paddingVertical: 20}}>
              <Text style={{width: width-150, height: 20, backgroundColor: '#111', marginBottom: 10}}></Text>
              <Text style={{width: width-150, height: 20, backgroundColor: '#111', marginBottom: 10}}></Text>
              <Text style={{width: width-150, height: 20, backgroundColor: '#111', marginBottom: 10}}></Text>
              <Text style={{width: width-150, height: 20, backgroundColor: '#111', marginBottom: 10}}></Text>
            </View>
          </View>

          {/* <Loading position="center" /> */}

        </View>
      )
    }

    themoviedb.setHistorialList(this.state.movie);

    return (

      <ScrollView
        // ref={(scrollView) => { _scrollView = scrollView; }}
        style={{ backgroundColor: colors.getList().primary, height: height }}>

        <View>

          <Image
            resizeMode={'cover'}
            style={{height: 220, backfaceVisibility: 'hidden'}}
            source={{uri: 'http://image.tmdb.org/t/p/w500' + this.state.movie.backdrop_path}}>
            <View style={{position: 'absolute', top: 0, left:0 , width: width, height: 220, backgroundColor: 'rgba(0, 0, 0, 0.15)'}}></View>
            <Header
              isTransparent={true}
              title=""
              actions={{ left: { icon: 'arrow-back' }, right: { icon: 'share' } }}
              onActionSelected={this._onActionSelected.bind(this)} />
          </Image>

        </View>

        {/*<View style={{position: 'absolute', top: 120, left: 15, width: 110, height: 150}}>
          <Image
            resizeMode={'cover'}
            style={{width: 110, height: 160, borderRadius: 3, borderWidth: 1, borderColor: colors.getList().primary, backfaceVisibility: 'hidden'}}
            source={{uri: 'http://image.tmdb.org/t/p/w150' + this.state.movie.poster_path}} />
        </View>*/}

        <View style={{padding: 0, marginTop: 0}}>

          {/*<View style={styles.infoContainer}>
            <Text style={styles.infoItem}><Icon name='thumb-up' color='#4CAF50' size={15} /> {this.state.movie.vote_average}</Text>
            <Text style={styles.infoItem}><Icon name='favorite' color='#F44336' size={15} /> {this.state.movie.vote_count}</Text>
            <Text style={styles.infoItem}><Icon name='timelapse' color='#03A9F4'size={15} /> {this.state.movie.runtime}</Text>
          </View>*/}

          <View style={{padding: 15}}>
            <Text style={{fontSize: 19, fontWeight: '600', color: '#FFF', marginBottom: 10}}>
              {this.state.movie.title}
            </Text>

            <Score score={this.state.movie.vote_average} />

            <Text
              numberOfLines={this.state.overviewNumberLines}
              style={{fontSize: 15, lineHeight: 26, fontWeight: '300', color: '#FFF', marginTop: 10, marginBottom: 0, textAlign: 'auto' }}>
              {this.state.movie.overview.length > 0 ? this.state.movie.overview : 'Sinopsis no disponible'}
            </Text>

            <View style={{paddingVertical: 10}}></View>

            {

              this.state.movie.overview.length > 0 ?

                <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}
                  onPress={this._onExtendOverview}
                  activeOpacity={0.9}>
                  <Text style={{textAlign: 'center', color: "#555", fontSize: 12}}>
                    {this._renderMoreLinesText()}
                  </Text>
                  <Icon color="#555" name={this._renderMoreLinesIcon()} style={{fontSize: 25}} />
                </TouchableOpacity> : null

            }

          </View>

        </View>

        <View style={styles.extendInfo}>
          <View style={styles.extendInfoRow}>
            <Text style={styles.extendInfoTitle}>Título original</Text><Text style={styles.extendInfoText}>{this.state.movie.original_title}</Text>
          </View>
          <View style={styles.extendInfoRow}>
            <Text style={styles.extendInfoTitle}>Duración</Text><Text style={styles.extendInfoText}>{this.state.movie.runtime} minutos</Text>
          </View>
          <View style={styles.extendInfoRow}>
            <Text style={styles.extendInfoTitle}>Estreno</Text><Text style={styles.extendInfoText}>{this.state.movie.release_date.split('-')[2]}/{this.state.movie.release_date.split('-')[1]}/{this.state.movie.release_date.split('-')[0]}</Text>
          </View>
          <View style={styles.extendInfoRow}>
            <Text style={styles.extendInfoTitle}>Director</Text><Text style={styles.extendInfoText}>-</Text>
          </View>
          <View style={styles.extendInfoRow}>
            <Text style={styles.extendInfoTitle}>Guión</Text><Text style={styles.extendInfoText}>-</Text>
          </View>
          <View style={styles.extendInfoRow}>
            <Text style={styles.extendInfoTitle}>Música</Text><Text style={styles.extendInfoText}>-</Text>
          </View>
          <View style={styles.extendInfoRow}>
            <Text style={styles.extendInfoTitle}>Fotografía</Text><Text style={styles.extendInfoText}>-</Text>
          </View>
        </View>

        <View>
          {/* Actores*/}
        </View>

        <View>
          {/* Generos */}
        </View>

        <MoviesListHorizontal
          title="Descubre del mismo género"
          type="movie"
          collection="similar"
          position="horizontal"
          {...this.props} />

        <View style={{paddingVertical: 10}}></View>

      </ScrollView>

    )

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgFake: {
    height: 220,
  },
  button: {
    backgroundColor: '#AAA',
    padding: 20
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 200,
    position: 'absolute',
    top: -48,
    left: 140,
  },
  infoItem: {
    fontSize: 15,
    marginBottom: 10,
    backgroundColor: colors.getList().secondary,
    padding: 10,
    color: '#FFF',
    minWidth: 60,
    textAlign: 'center',
    marginRight: 10,
    borderRadius: 3
  },
  infoItemFake: {
    fontSize: 15,
    marginBottom: 10,
    backgroundColor: colors.getList().secondary,
    padding: 10,
    color: colors.getList().secondary,
    minWidth: 60,
    textAlign: 'center',
    marginRight: 10,
    borderRadius: 3
  },
  extendInfo: {
    elevation: 10,
    backgroundColor: '#171717',
    padding: 15,
    marginBottom: 10
  },
  extendInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 5
  },
  extendInfoTitle: {
    color: '#999',
    minWidth: 130
  },
  extendInfoText: {
    color: '#FFF'
  },
});
