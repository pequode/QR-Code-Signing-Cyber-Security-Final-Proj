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

async function getDocData(){
  var result;
  await db.collection("clientInfo").get().then((res) =>{
    console.log(res.size);
    console.log(res._delegate._snapshot.docChanges);
    result = res._delegate._snapshot.docChanges;
  });
  return result;
}
async function getServeyData(){
  var result;
  await db.collection("surveyInfo").get().then((res) =>{
    console.log(res.size);
    console.log(res);
    result = res._delegate._snapshot.docChanges;
  });
  return result;
}
const express = require("express");
const bodyParser = require('body-parser');
const app = express();

function convertToUSTFromEpoch(instring) {

  var d = new Date(); // The 0 there is the key, which sets the date to the epoch
  d.getUTCDate();
  return d;
}
function makeData(req,res,source){

  cookieNeeded = JSON.stringify(req.headers.cookie);
  //JOHNS PROUD WORK
  i = cookieNeeded.indexOf("gaCookie");
  str1 = "";
  for(j = i+15; j < cookieNeeded.length; j++){
    if(cookieNeeded[j] == ";"){
      break;
    }
    else{
      str1 += cookieNeeded[j];
    }
  }
  // Mobile: JSON.stringify(req.headers['sec-ch-ua-mobile']),
  // Platform: JSON.stringify(req.headers['sec-ch-ua-platform']),
  // db.collection("clientInfo").add({
  //   Cookies: str1,
  //   IP: req.body,
  //   Source: JSON.stringify(source),
  //   User: JSON.stringify(req.headers['user-agent']),
  //   Time: JSON.stringify(convertToUSTFromEpoch(str1))
  //   });
  console.log("Cookie sent");
  // getDocData();
}
async function writeDocData(){
  var data = await getDocData();
  var fs = require('fs');
  fs.writeFile('./resultDoc.json', JSON.stringify(data), 'utf8',function(err) {
      if (err) throw err;
      console.log('complete');
      }
  );
}
async function writeSurveyData(){
  var data = await getServeyData();
  var fs = require('fs');
  fs.writeFile('./resultServey.json', JSON.stringify(data), 'utf8',function(err) {
      if (err) throw err;
      console.log('complete');
      }
  );
}

app.listen(process.env.PORT || 3000, () => {
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
  res.sendFile(__dirname + "/basketBall.html");
  res.sendFile(__dirname + "/source.js");

});
app.get("/getJson", (req, res) => {
    res.sendFile(__dirname + "/index.html");
    writeDocData()
});

app.get("/getJsonSurvey", (req, res) => {
    res.sendFile(__dirname + "/index.html");
    writeSurveyData()
});

app.post('/basketBall', function (req, res) {
   makeData(req,res,"BBall QRCode");

});
app.post('/Amazon', function (req, res) {
   makeData(req,res,"Amazon QRCode");
});
app.post('/gamers', function (req, res) {
  makeData(req,res,"Game Link");
});
app.post('/party', function (req, res) {
   makeData(req,res,"Party QRCode");
});
app.post('/class', function (req, res) {
   makeData(req,res,"Class QRCode");
});
app.post('/party', function (req, res) {
   makeData(req,res,"Striped Out QRsubPath");
});
// app.post('/formSubmit', function (req, res) {
app.post('/formSubmit', (req, res) => {

  res.sendFile(__dirname + "/index.html");
  // res.writeHead(302, {
  //     location: "localhost:3000"+__dirname + "/index.html",
  //   });
  // res.end();
  var data = req.body
  // db.collection("surveyInfo").add({
  //   How: JSON.stringify(data.other[0]),
  //   Level: JSON.stringify(data.other[1]),
  //   Thoughts: JSON.stringify(data.misc)
  //   });
  console.log(data);
});
