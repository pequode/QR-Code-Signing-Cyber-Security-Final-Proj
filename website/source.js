debug = false// used to toggle conditionally writing to database and page forwarding
async function postData(url = '', data = {}) {
  // Default options are marked with *
  parsedData = data
  const response = await fetch(url, {

    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, nofalse-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: parsedData // body data type must match "Content-Type" header
  }).then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });

}
// sends data to web server
async function sendData(srcs,data){
  await postData(srcs,data)
}
// used to get client IP with the given api
async function getIP() {
    dat = "";
    const ip = await $.getJSON("https://api.ipify.org?format=json",function(data) {
        dat = data.ip
    });
    return dat;
}
// creates a data object
async function getData(){
      var data = {};
      ip = await getIP();
      data["IP"] = ip;

      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-XXXXX-Y', {
      'cookieName': 'gaCookie',
      'cookieDomain': 'auto',
      'cookieExpires': 60 * 60 * 24 * 28,  // Time in seconds.
      'cookieUpdate': 'false',
      'cookieFlags': 'SameSite=None; Secure',
      });
      ga('send', 'pageview');
      await ga(function(tracker) {
      // Logs the tracker created above to the console.
        var clientId = tracker.get('clientId');
        addData = {
           "name": tracker.get('name'),
           "CID" : tracker.get('clientId'),
           // "title":tracker.get('title')
        }
        data["ga_data"] = JSON.stringify(addData);
        var GA_LOCAL_STORAGE_KEY = 'ga:clientId';
        if (window.localStorage) {
          ga('create', 'UA-XXXXX-Y', {
            'storage': 'none',
            'clientId': localStorage.getItem(GA_LOCAL_STORAGE_KEY)
          });
          ga(function(tracker) {
            localStorage.setItem(GA_LOCAL_STORAGE_KEY, tracker.get('clientId'));
          });
        }
        else {
          ga('create', 'UA-XXXXX-Y', 'auto');
        }
        ga('send', 'pageview');
      });
      return JSON.stringify(data);
}
// gets a cookie if it exists
function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = dc.length;
        }
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
}
// function that sets cookies
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
// checks to see if there is a cookie if there is it returns True otherwise it sets it and returns false
function beenHere(src) {
    var myCookie = getCookie("beenToPage"+src);
    if (myCookie == null) {
        setCookie("beenToPage"+src, "True", 100);
        return false;
    }
    else{
      return true
    }
}
// the main function
async function main(srcs,ind = 0){
  if(!beenHere(srcs)||debug){
    data1 = await getData();
    if(debug){
      console.log(beenHere(srcs),"been to page")
      console.log(data1)
    }
    if(debug){
      console.log("what the heck",ind,ind==0)
    }
    sendData(srcs,data1)
  }
  else{
    if(debug){
      console.log("neverBeenHere")
    }

  }
  if(!debug && ind == 0){
    window.location.replace("./index.html");

  }
}
