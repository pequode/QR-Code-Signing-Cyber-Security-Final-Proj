async function postData(url = '', data = {}) {
  // Default options are marked with *
  parsedData = JSON.stringify(data)
  console.log(parsedData)
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
function sendData(srcs,data){
  postData(srcs, {"key":JSON.stringify(data)})
  window.location.replace("./index.html");
}
function getData(){
  var data = "nosne";
  $.get("https://ipinfo.io", function(response) {
          data = response.ip;
      }, "json")
  return data;
}
