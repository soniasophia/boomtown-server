import admin from 'firebase-admin';
var serviceAccount = require("./firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://boomtown-df72a.firebaseio.com"
});

export default admin;