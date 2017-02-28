import * as firebase from 'firebase';

import React, { Component } from 'react';

import {
  ListView,
  TouchableOpacity,
  Text,
  Image,
  Platform,
  Alert,
  AsyncStorage,
  ScrollView,
  View,
  StyleSheet
} from 'react-native';

import * as settingsService from '../../../services/settings-service';
import * as themoviedb from '../../../services/movies-service';
import * as userService from '../../../services/user-service';
import * as loginService from '../../../services/login-service';
import * as colors from '../../../common/colors';

import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Historial from '../../../common/historial';

export default class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      avatarSource: settingsService.getOptions().avatar,
      name: userService.getCurrentUser().displayName,
      email: userService.getCurrentUser().email,
      saved: 0,
      viewed: 0,
      favorite: 0
    }
  }

  componentWillMount() {

    //
    //
    // TODO: peta la primera al guardar en 'list'
    //
    //

    let user = firebase.auth().currentUser;

    firebase.database().ref('users/' + user.uid + '/list/favorite').on('value', (snapshot) => {
      if (snapshot.val()) {
        this.setState({
          favorite: snapshot.val().length
        });
      } else {
        this.setState({
          favorite: 0
        });
      }
    });

    firebase.database().ref('users/' + user.uid + '/list/saved').on('value', (snapshot) => {
      if (snapshot.val()) {
        this.setState({
          saved: snapshot.val().length
        });
      } else {
        this.setState({
          saved: 0
        });
      }
    });

    firebase.database().ref('users/' + user.uid + '/list/viewed').on('value', (snapshot) => {
      if (snapshot.val()) {
        this.setState({
          viewed: snapshot.val().length
        });
      } else {
        this.setState({
          viewed: 0
        });
      }
    });

  }

  imageChange() {
    Alert.alert(
      'Cambiar imagen',
      '',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Ask me later pressed'),
          style: 'cancel'
        },
        {
          text: 'Galería',
          onPress: () => this.galeryOption()
        },
        {
          text: 'Cámara',
          onPress: () => this.cameraOption()
        }
      ],
      { cancelable: true }
    )
  }

  cameraOption() {
    ImagePicker.openCamera({
      width: 120,
      height: 120,
      cropping: true,
      includeBase64: true
    }).then(image => {
      this.saveImageSelected(image);
    });
  }

  galeryOption() {
    ImagePicker.openPicker({
      width: 120,
      height: 120,
      cropping: true,
      includeBase64: true
    }).then(image => {
      this.saveImageSelected(image);
    });
  }

  saveImageSelected(image) {
    let user = firebase.auth().currentUser;

    firebase.database().ref('users/' + user.uid + '/settings/avatar').set({
      uri: 'data:image/jpeg;base64,' + image.data
    });

    settingsService.setOption('avatar', { uri: 'data:image/jpeg;base64,' + image.data });

    this.setState({ avatarSource: { uri: 'data:image/jpeg;base64,' + image.data }});
  }

  renderAvatar() {
    if (this.state.avatarSource) {
      return (
        <TouchableOpacity onPress={this.imageChange.bind(this)}>
          <Image
            resizeMode={'cover'}
            style={{width: 100, height: 100, borderRadius: 50, backfaceVisibility: 'hidden', marginBottom: 20}}
            source={this.state.avatarSource} />
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity onPress={this.imageChange.bind(this)}>
          <View style={{flexDirection: 'column', alignItems: 'center', backgroundColor: colors.getList().secondary, width: 100, height: 100, borderRadius: 50, marginBottom: 20}}>
            <Text style={{marginTop: 25}}>
              <Icon name="face" color="#CCC" size={50} />
            </Text>
          </View>
        </TouchableOpacity>
      )
    }
  }

  render() {
    return (
      <ScrollView>

        <View style={{paddingHorizontal: 10, paddingVertical: 30}}>
          <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            {this.renderAvatar()}
            <View>
              <Text style={styles.userName}>{this.state.name}</Text>
              <Text style={styles.userEmail}>{this.state.email}</Text>
            </View>
          </View>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-around', backgroundColor: colors.getList().secondary, marginBottom: 15, paddingVertical: 20}}>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#FFF', textAlign: 'center', marginRight: 10}}><Icon name="bookmark" size={27} color={colors.getList().white} /></Text>
            <Text style={{color: '#FFF', textAlign: 'center', marginBottom: 0, fontSize: 18}}>{this.state.saved}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#FFF', textAlign: 'center',  marginRight: 10}}><Icon name="eye" size={27} color={colors.getList().white} /></Text>
            <Text style={{color: '#FFF', textAlign: 'center', marginBottom: 0, fontSize: 18}}>{this.state.viewed}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#FFF', textAlign: 'center',  marginRight: 10}}><Icon name="star" size={27} color={colors.getList().white} /></Text>
            <Text style={{color: '#FFF', textAlign: 'center', marginBottom: 0, fontSize: 18}}>{this.state.favorite}</Text>
          </View>
        </View>

        <Historial title="Lo último que has visto" />

      </ScrollView>

    )
  }

}

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    // paddingHorizontal: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
    // marginBottom: 15
  },
  optionTitle: {
    padding: 15,
    color: '#FFF',
    fontSize: 15,
    backgroundColor: colors.getList().secondary,
    // marginBottom: 10
  },
  optionText: {
    color: '#CCC',
    // paddingLeft: 20
  },
  userName: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center'
  },
  userEmail: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center'
  }
});

