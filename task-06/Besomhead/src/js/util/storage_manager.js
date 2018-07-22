/* exported storageManager */
/* exported HTTP_GET HTTP_POST HTTP_PUT */
/* global config */

var HTTP_GET = "GET";
var HTTP_POST = "POST";
var HTTP_PUT = "PUT";
var REQUEST_FETCH = "fetch";
var REQUEST_XHR = "xhr";

var storageManager = (function storageManagerModule(config) {
  function StorageManager() {}

  StorageManager.prototype.getStoragePath = function getStoragePath(extraPath) {
    return config.chatURL + extraPath + ".json";
  };

  function getRequestConfigObj(requestMethod, data) {
    var configObj = {
      method: requestMethod,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };

    if (requestMethod !== HTTP_GET) {
      configObj.body = JSON.stringify(data);
    }

    return configObj;
  }

  function sendRequestToStorageByFetch(extraPath, requestMethod, data) {
    return fetch(
      storageManager.getStoragePath(extraPath),
      getRequestConfigObj(requestMethod, data)
    )
      .then(function getResponse(response) {
        return response.json();
      })
      .then(function getResponseData(responseData) {
        return responseData;
      });
  }

  function sendRequestToStorageByXHR(extraPath, method, data) {
    return new Promise(function sendXHRRequest(resolve, reject) {
      var xhr = new XMLHttpRequest();

      xhr.open(method, storageManager.getStoragePath(extraPath), true);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.addEventListener("load", function onLoad() {
        resolve(JSON.parse(xhr.response));
      });
      xhr.addEventListener("error", function onError() {
        reject(xhr.statusText);
      });
      xhr.send(JSON.stringify(data));
    });
  }

  StorageManager.prototype.sendRequestToStorage = function sendRequestToStorage(
    extraPath,
    method,
    data
  ) {
    var response;

    if (config.requests === REQUEST_FETCH) {
      response = sendRequestToStorageByFetch(extraPath, method, data);
    } else if (config.requests === REQUEST_XHR) {
      response = sendRequestToStorageByXHR(extraPath, method, data);
    }

    return response;
  };

  return new StorageManager();
})(config);
