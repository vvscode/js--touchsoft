/* exported updatesManager */
/* global storageManager */

var updatesManager = (function updatesManagerModule() {
  var JSON_MARK = "data:";

  function UpdatesManager() {
    this.responseData = undefined;
  }

  UpdatesManager.prototype.getDataFromStorage = function getDataFromStorage(
    extraPath
  ) {
    var xhttp = new XMLHttpRequest();

    xhttp.addEventListener("readystatechange", function onDataReceived() {
      var response = xhttp.responseText;

      if (this.status && this.responseText) {
        if (
          response.lastIndexOf("event:") !== response.lastIndexOf("event: put")
        ) {
          return;
        }
        window.postMessage(
          JSON.parse(
            response.slice(
              response.lastIndexOf(JSON_MARK) + JSON_MARK.length,
              response.lastIndexOf("}") + 1
            )
          ),
          window.location
        );
      }
    });

    xhttp.open("GET", storageManager.getStoragePath(extraPath), true);
    xhttp.setRequestHeader("Accept", "text/event-stream");
    xhttp.send();
  };

  return new UpdatesManager();
})();
