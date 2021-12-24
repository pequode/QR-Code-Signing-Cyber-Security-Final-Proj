const firebase = require("firebase");
  // Required for side-effects
require("firebase/firestore");

var fss = require('fs');
let rawdata = fss.readFileSync('FBConf.json');// done to not release API KEY
let FBConf = JSON.parse(rawdata);

// set up firebase auth
const firebaseConfig = {
  apiKey: FBConf["apiKey"],
  authDomain: FBConf["authDomain"],
  projectId: FBConf["projectId"],
  storageBucket: FBConf["storageBucket"],
  messagingSenderId: FBConf["messagingSenderId"],
  appId: FBConf["appId"],
  measurementId: FBConf["measurementId"]
};
// create firebase aoo
const apps = firebase.initializeApp(firebaseConfig);
var db = firebase.firestore(apps);

// pull all data from firebase table with non servey data
async function getDocData(){
  var result;
  await db.collection("clientInfo").get().then((res) =>{
    // console.log(res.size);
    // console.log(res._delegate._snapshot.docChanges);
    result = res._delegate._snapshot.docChanges;
  });
  return result;
}
// pull data from firebase with servey responses
async function getServeyData(){
  var result;
  await db.collection("surveyInfo").get().then((res) =>{
    // console.log(res.size);
    // console.log(res);
    result = res._delegate._snapshot.docChanges;
  });
  return result;
}
// create web server
const express = require("express");
// create post request handler
const bodyParser = require('body-parser');
const app = express();

// get timestamp
function convertToUSTFromEpoch(instring) {
  var d = new Date(); // The 0 there is the key, which sets the date to the epoch
  d.getUTCDate();
  return d;
}
// create data packet to be entered into firebase from the post reqest
function makeData(req,res,source){

  cookieNeeded = JSON.stringify(req.headers.cookie);
  //JOHNS PROUD WORK
  // There was a lot of code here, check history for example of it, was taken out so that we could avoid reaching our database limits
  // the code here parsed the cooke and then wrote it to the firestore db
  
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
}
// writes data to a json file with non servey data
async function writeDocData(){
  var data = await getDocData();
  var fs = require('fs');
  fs.writeFile('./resultDoc.json', JSON.stringify(data), 'utf8',function(err) {
      if (err) throw err;
      console.log('complete');
      }
  );
}
// writes servey data to a different json
async function writeSurveyData(){
  var data = await getServeyData();
  var fs = require('fs');
  fs.writeFile('./resultServey.json', JSON.stringify(data), 'utf8',function(err) {
      if (err) throw err;
      console.log('complete');
      }
  );
}
// done locally the process env port is for our CI
app.listen(process.env.PORT || 3000, () => {
  console.log("Application started and Listening on port 3000");
});

app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
//think this maybe incorrect paridime
// home page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
  res.sendFile(__dirname + "/gotcha.html");
  res.sendFile(__dirname + "/game.html");
  res.sendFile(__dirname + "/basketBall.html");
  res.sendFile(__dirname + "/source.js");

});
// used to get data from firebase without paying for firebase
app.get("/getJson", (req, res) => {
    res.sendFile(__dirname + "/index.html");
    writeDocData()
});
// same
app.get("/getJsonSurvey", (req, res) => {
    res.sendFile(__dirname + "/index.html");
    writeSurveyData()
});
//one of the sources
app.post('/basketBall', function (req, res) {
   makeData(req,res,"BBall QRCode");

});
// a different source
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

// this used when form submit on main page
// app.post('/formSubmit', function (req, res) {
app.post('/formSubmit', (req, res) => {

  res.sendFile(__dirname + "/index.html");
  var data = req.body
  // db.collection("surveyInfo").add({
  //   How: JSON.stringify(data.other[0]),
  //   Level: JSON.stringify(data.other[1]),
  //   Thoughts: JSON.stringify(data.misc)
  //   });
  console.log(data);
});
