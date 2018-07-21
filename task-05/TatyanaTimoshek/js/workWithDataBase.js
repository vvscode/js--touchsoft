/*exported connectionsWithDataBase*/

var connectionsWithDataBase = (function connectionsWithDataBase() {
  var chatURL = "https://tanyachatfb.firebaseio.com";

  function dataProcessing(url, requestType, data) {
    var body;
    if (requestType !== "GET") {
      body = {
        method: requestType,
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      };
    } else {
      body = {
        method: requestType,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      };
    }
    return fetch(url, body)
      .then(function a(response) {
        return response.json();
      })
      .then(function b(res) {
        return res;
      });
  }

  function postDataXHR(url, requestType, data) {
    var request;
    return new Promise(function i(resolve) {
      request = new XMLHttpRequest();
      request.open(requestType, url, true);
      request.setRequestHeader("Accept", "application/json");
      request.setRequestHeader("Content-Type", "application/json");
      request.addEventListener("load", function j() {
        resolve(JSON.parse(request.response));
      });
      request.send(JSON.stringify(data));
    });
  }

  return {
    firebaseData: dataProcessing,
    url: chatURL,
    xhr: postDataXHR
  };
})();
