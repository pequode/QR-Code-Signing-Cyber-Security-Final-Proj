var div = document.getElementById('GFG_DIV');
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
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function beenHere(src) {
    var myCookie = getCookie(src);
    if (myCookie == null) {
        // setCookie("beenToPage"+src, "True", 100);
        return false;
    }
    else{
      return true
    }
}
function onSub(){
  setCookie("submitedForm", "True", 100);
  window.location.replace("./index.html");
}
function main(){
  var srcs = "submitedForm"
  if(beenHere(srcs)){
    div.remove();
  }
  else{
    if(debug){
      console.log("neverBeenHere")
    }
  }
}
