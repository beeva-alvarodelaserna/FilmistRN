import React, { Component } from 'react';

import {
  TouchableOpacity,
  Text,
  View,
  Alert,
  ToastAndroid,
  ScrollView,
  StyleSheet,
  Dimensions
} from 'react-native';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as historialActions from '../../../redux/actions/historialActions';

import * as firebase from 'firebase';
import * as loginService from '../../../services/login-service';
import * as settingsService from '../../../services/settings-service';
import * as themoviedb from '../../../services/movies-service';
import * as colors from '../../../common/colors';

import Checkbox from '../../../common/checkbox';
import Icon from 'react-native-vector-icons/MaterialIcons';

import RadioButtons from '../../../common/radio-buttons';

const { width, height } = Dimensions.get('window');

class Settings extends Component {

  constructor(props) {
    super(props);

    this.state = {
      allowExitApp: settingsService.getOptions().allowExitApp,
      radioButtons: [
        {id: 0, language: 'es', title: 'Español', state: settingsService.getOptions().lang === 'es' ? true : false},
        {id: 1, language: 'en', title: 'Inglés', state: settingsService.getOptions().lang === 'en' ? true : false},
        {id: 2, language: 'fr', title: 'Francés', state: settingsService.getOptions().lang === 'fr' ? true : false}
      ]
    };
  }

  _onActionSelected = (action) => {
    switch (action) {
      case 'left':
        themoviedb.getNavigator().pop();
        break;
      case 'right':
        break;
    }
  }

  _loggout() {
    loginService.logout().then(() => {
      // Clear states
      themoviedb.reset();

      // settingsService.reset(); // ????

      // redirect to Login
      themoviedb.getNavigator().resetTo({ index: 1, route: 'home'});
    }, (error) => {
      consoe.log(error.message);
    });
  }

  showLogout() {
    let user = firebase.auth().currentUser;

    if (!user) {
      return null;
    }

    return (
      <View>
        <Text style={styles.optionTitle}>Salir de Filmist</Text>
        <TouchableOpacity
          style={{minWidth: 300}}
          activeOpacity={0.9}
          onPress={this._loggout}>
          <View style={{paddingHorizontal: 15, paddingVertical: 20}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: colors.getList().white, fontWeight: '400', fontSize: 14}}>Cerrar sesión</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <ScrollView>

        <View style={{padding: 0}}>

          <View>
            <Text style={styles.optionTitle}>Cambia el idioma del contenido de la app</Text>
            <View style={{padding: 15}}>
              <RadioButtons options={this.state.radioButtons} />
            </View>
          </View>

          <View>
            <Text style={styles.optionTitle}>Evitar cerrar la app con el botón físico atrás</Text>
            <View style={{paddingHorizontal: 15, paddingVertical: 20}}>
              <Checkbox
                checked={this.state.allowExitApp}
                onChange={(checked) => {
                  let user = firebase.auth().currentUser;

                  if (user) {
                    this.setState({allowExitApp: !checked});
                    settingsService.setOption('allowExitApp', !this.state.allowExitApp);
                    firebase.database().ref('users/' + user.uid + '/settings/allowExitApp').set(!this.state.allowExitApp);
                  } else {

                    Alert.alert(
                      'Opción no disponible',
                      'Inicia sesión para poder cambiar y sincronizar opciones de configuración',
                      [
                        {
                          text: 'Iniciar sesión', onPress: () => {
                          themoviedb.getNavigator().push({index: 0.1, title: 'login'});
                        },
                          style: 'cancel' },
                        {
                          text: 'Cancelar', onPress: () => {
                          return true;
                        }
                        }
                      ]
                    );

                  }
                }} />
            </View>
          </View>

          {/*<View>
            <Text style={styles.optionTitle}>Eliminar últimas búsquedas</Text>
              <TouchableOpacity
                style={{minWidth: 300}}
                activeOpacity={0.9}
                onPress={() => {
                  let user = firebase.auth().currentUser;

                  themoviedb.clearHitorialList();

                  this.props.actions.historial.clear();

                  if (user) {
                    //firebase.database().ref('users/' + user.uid + '/historial').set(null);
                  }

                  ToastAndroid.show('Historial eliminado', ToastAndroid.SHORT);
                }}>
                <View style={{paddingHorizontal: 15, paddingVertical: 20}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{color: colors.getList().white, fontWeight: '400', fontSize: 14}}>Eliminar historial</Text>
                  </View>
                </View>
              </TouchableOpacity>
          </View>*/}

          { this.showLogout() }

        </View>

      </ScrollView>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  column: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  optionTitle: {
    padding: 15,
    color: '#FFF',
    fontSize: 15,
    backgroundColor: colors.getList().secondary,
  },
  optionText: {
    color: '#CCC',
  },
  userName: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 5
  },
  userEmail: {
    color: '#999',
    fontSize: 12
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
