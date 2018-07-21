/*global createOperatorsDashboard, AW*/

function handlerUrl(newUrl, url) {
  var blackBoard = document.getElementById("idBlackBoard");
  var newElem;
  var oldElem;
  var fil;
  if (newUrl.includes("operatorsDashboard")) {
    oldElem = document.getElementById("idNewEl");
    newElem = createOperatorsDashboard.createDashboard();
    blackBoard.replaceChild(newElem, oldElem);
    AW.ini();
  }
  if (newUrl.includes("configurator")) {
    oldElem = document.getElementById("idNewEl");
    newElem = configJS.create();
    blackBoard.replaceChild(newElem, oldElem);
    configJS.init();
    AW.remove();
  }
  if (newUrl.includes("aboutProject")) {
    oldElem = document.getElementById("idNewEl");
    newElem = aboutProject.init();
    blackBoard.replaceChild(newElem, oldElem);
    AW.remove();
  }
}

window.addEventListener("hashchange", function hashChange(event) {
  handlerUrl(event.newURL, event.oldURL);
});

window.onload = function onload() {
  handlerUrl(window.location.href);
  document
    .getElementById("idOperatorsDashboardWP")
    .addEventListener("click", function update(event) {
      var newUrl = event.target.getAttribute("href");
      event.preventDefault();
      window.location.hash = newUrl;
    });
  document
    .getElementById("idConfiguratorWP")
    .addEventListener("click", function update(event1) {
      var newUrl = event1.target.getAttribute("href");
      event1.preventDefault();
      window.location.hash = newUrl;
    });

  document
    .getElementById("idAboutProjectWP")
    .addEventListener("click", function update(event2) {
      var newUrl = event2.target.getAttribute("href");
      event2.preventDefault();
      window.location.hash = newUrl;
    });
};
