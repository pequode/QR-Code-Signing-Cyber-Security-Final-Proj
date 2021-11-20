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
function makeData(req,res,source){
  var data = req
  console.log(data,source);
}
app.listen(3000, () => {
  console.log("Application started and Listening on port 3000");
});

app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
//think this maybe incorrect paridime
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
  res.sendFile(__dirname + "/gotcha.html");
  res.sendFile(__dirname + "/game.html");
  res.sendFile(__dirname + "/BasketBall.html");
  console.log(req,res);
});

app.post('/basketBall', function (req, res) {
   makeData(req,res,"BBall");

});
app.post('/Amazon', function (req, res) {
   makeData(req,res,"Amazon");
});
app.post('/gamers', function (req, res) {
  makeData(req,res,"gamers");
});
app.post('/party', function (req, res) {
   makeData(req,res,"party");
});
// app.post('/formSubmit', function (req, res) {
app.post('/formSubmit', (req, res) => {
  res.sendFile(__dirname + "/index.html");
  res.sendFile(__dirname + "/gotcha.html");
  res.sendFile(__dirname + "/game.html");
  res.writeHead(302, {
      location: "localhost:3000"+__dirname + "/index.html",
    });
  res.end();
  var data = req.body
  console.log(data);
});

// function sendCookie(clientID){
//   db.collection("clientID").add({clientCookie: clientID});
// }
