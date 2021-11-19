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
const bodyParser = require('body-parser');
const app = express();

app.listen(3000, () => {
  console.log("Application started and Listening on port 3000");
});

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
//think this maybe incorrect paridime
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
  res.sendFile(__dirname + "/gotcha.html");
  res.sendFile(__dirname + "/game.html");
  res.sendFile(__dirname + "/BasketBall.html");
  console.log(req,res);
});
app.post('/gottaDash', function (req, res) {

   console.log(req);
   // console.log(req,res);
   res.sendStatus(200);
   // res.send(__dirname + "/index.html");
});
// function sendCookie(clientID){
//   db.collection("clientID").add({clientCookie: clientID});
// }
