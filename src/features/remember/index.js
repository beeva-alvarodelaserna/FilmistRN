import React, { Component } from 'react';

import {
  View,
  Text,
  Image,
  Modal,
  TextInput,
  Keyboard,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import * as loginService from '../../services/login-service';
import * as themoviedb from '../../services/movies-service';
import * as colors from '../../common/colors';

import Loading from '../../common/loading';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Remember extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      showLoading: false
    };
  }

  _goBack() {
    themoviedb.getNavigator().pop();
  }

  _remember() {
    Keyboard.dismiss();

    if (this.state.email !== '' && this.state.email.length > 4) {
      this.setState({showLoading: true});

      loginService.retrievePassword(this.state.email)
        .then(() => {
          themoviedb.getNavigator().replace({ index: 0.1, title: 'login'});
        }, (error) => {
          if (error.code === 'auth/invalid-email') {
            alert('El formato de email introducido no es correcto');
          }
          if (error.code === 'auth/user-not-found') {
            alert('El email no pertenece a ningún usuario');
          }
          this.setState({showLoading: false});
        });
    } else {
      this.setState({showLoading: false});

      if (this.state.email === '') {
        alert('Tienes que introducir un email');
        return true;
      }
      if (this.state.email.length < 4) {
        alert('El formato de email introducido no es correcto');
      }
    }
  }

  showButtonLoading() {
    if (!this.state.showLoading) {
      return <Text style={styles.buttonTextClear}>CAMBIAR LA CONTRASEÑA</Text>;
    } else {
      return <Loading color="#FFF" size={19} />;
    }
  }

  renderButtonStyle() {
    if (this.state.email !== '' && this.state.email.length > 4) {
      return {
        marginTop: 30,
        paddingTop: 17,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 17,
        borderRadius: 3,
        borderWidth: 2,
        borderColor: colors.getList().app,
        backgroundColor: colors.getList().app,
        marginBottom: 20,
        minWidth: 300
      }
    } else {
      return {
        marginTop: 30,
        paddingTop: 17,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 17,
        borderRadius: 3,
        borderWidth: 2,
        borderColor: '#222',
        backgroundColor: '#222',
        marginBottom: 20,
        minWidth: 300
      }
    }
  }

  renderButtonOpacityStyle() {
    if (this.state.email !== '' && this.state.email.length > 4) {
      return 0.8;
    } else {
      return 1;
    }
  }

  render() {
    return(

      <View style={styles.container} renderToHardwareTextureAndroid={true}>

        <Text onPress={this._goBack.bind(this)} style={styles.textBack}>
          <Icon name="arrow-back" size={30} color="#FFF" />
        </Text>

        <Text style={styles.labelRemember}>Introduce tu email para que te enviemos un formulario de cambio de contraseña</Text>

        <TextInput
          style={styles.input}
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}
          autoFocus={true}
          placeholder="Email"
          placeholderTextColor="#666"
          onSubmitEditing={this._remember.bind(this)}
          returnKeyType="done"
          autoFocus={false}
        />

        <TouchableOpacity onPress={this._remember.bind(this)} style={this.renderButtonStyle()} activeOpacity={this.renderButtonOpacityStyle()}>
          {this.showButtonLoading()}
        </TouchableOpacity>

      </View>

    )
  }

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: colors.getList().primary,
    paddingTop: 10,
    padding: 30
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    backgroundColor: 'rgba(255,255,255,0.2)'
  },

  textBack: {
    marginTop: 24,
    paddingLeft: -5,
    marginBottom: 30,
  },

  arrowBack: {
    width: 30,
    height: 30
  },

  label: {
    textAlign: 'left',
    fontSize: 25,
    marginBottom: 30,
    color: colors.getList().white
  },

  labelRemember: {
    fontSize: 18,
    marginBottom: 30,
    color: colors.getList().white
  },

  input: {
    // height: 40,
    minWidth: 300,
    marginBottom: 25,
    fontSize: 15,
    paddingVertical: 10,
    color: colors.getList().white
  },

  button: {
    marginTop: 30,
    paddingTop: 17,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 17,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: colors.getList().app,
    backgroundColor: colors.getList().app,
    marginBottom: 20,
    minWidth: 300,
  },

  buttonClear: {
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


  buttonText: {
    color: '#444',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14
  },

  buttonTextClear: {
    color: colors.getList().white,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14
  }

});