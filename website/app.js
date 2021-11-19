// const firebase = require("firebase");
// // Required for side-effects
// require("firebase/firestore");




// const firebaseApp = firebase.initializeApp({
//   apiKey: "AIzaSyBF2qjk9bdvX_QINMEJYiOY1Oxa1tr0Bjo",
//   authDomain: "ec521project.firebaseapp.com",
//   projectId: "ec521project"
// });

// var db = firebase.firestore();

const express = require("express");
const app = express();

app.listen(3000, () => {
  console.log("Application started and Listening on port 3000");
});

app.use(express.static(__dirname));
//think this maybe incorrect paridime
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
  res.sendFile(__dirname + "/gotcha.html");
  res.sendFile(__dirname + "/game.html");
});

// function sendCookie(clientID){
//   db.collection("clientID").add({clientCookie: clientID});
// }

