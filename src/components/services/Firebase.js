import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCXjn2HJ0euD_e9uhNG966zv_F69ozJETE",
    authDomain: "mychat-49839.firebaseapp.com",
    databaseURL: "https://mychat-49839-default-rtdb.firebaseio.com"
  };
  firebase.initializeApp(config);
  export const auth = firebase.auth;
  export const db = firebase.database();