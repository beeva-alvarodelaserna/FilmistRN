import * as firebase from 'firebase';
import * as userService from './user-service';
import * as themoviedb from './movies-service';

export const init = () => {
  const config = {
    apiKey: "AIzaSyDIe9_h-URUmCp4pp464W6yayC6SifNd-4",
    authDomain: "filmist-react-native.firebaseapp.com",
    databaseURL: "https://filmist-react-native.firebaseio.com",
    storageBucket: "filmist-react-native.appspot.com",
    messagingSenderId: "489986447626"
  };

  firebase.initializeApp(config);
}

export const login = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email,password);
}

export const register = (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
}

export const retrievePassword = (email) => {
  return firebase.auth().sendPasswordResetEmail(email);
}

export const logout = (user) => {
  return firebase.auth().signOut();
}
