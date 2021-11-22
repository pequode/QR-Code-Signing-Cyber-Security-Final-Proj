debug = false
async function postData(url = '', data = {}) {
  // Default options are marked with *
  parsedData = JSON.stringify(data)
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
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
async function sendData(srcs,data){
  await postData(srcs,data)
}
async function getIP() {
    dat = "";
    const ip = await $.getJSON("https://api.ipify.org?format=json",function(data) {
        dat = data.ip
    });
    return dat;
}
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
        // data.push({
        //   key: "ga_data",
        //   value: addData
        // })
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
      return data;
}

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
    // because unescape has been deprecated, replaced with decodeURI
    //return unescape(dc.substring(begin + prefix.length, end));
    return decodeURI(dc.substring(begin + prefix.length, end));
}
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
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
async function main(srcs){

  if(!beenHere()||debug){
    data1 = await getData();
    if(debug){
      console.log(beenHere(srcs),"been to page")
      console.log(data1)
    }
    await sendData(srcs,data1)
  }
  else{
    if(debug){
      console.log("neverBeenHere")
    }

  }
  if(!debug){
    window.location.replace("./index.html");
  }
}
