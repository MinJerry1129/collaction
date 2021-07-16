import { decode, encode } from 'base-64';
import './timerConfig';
global.addEventListener = (x) => x;
if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC9kwY95ZZNcvkTR3DJDkr4LM0G6mko-3Y",
  authDomain: "collaction-app-ce0d1.firebaseapp.com",
  projectId: "collaction-app-ce0d1",
  storageBucket: "collaction-app-ce0d1.appspot.com",
  messagingSenderId: "204491248566",
  appId: "1:204491248566:web:eac80cc13f2c64ab9d6717",
  measurementId: "G-547Z906GTF"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export { firebase };
