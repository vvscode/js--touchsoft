/* global dashboardFactory */
/* exported config */

var REQUEST_INTERVAL = 15000;

var config = {
  operatorName: "Operator",
  chatURL: "https://besomhead-chat.firebaseio.com/",
  requests: "fetch"
};

//= util/message_factory.js
//= util/DOM_manager.js
//= util/storage_manager.js
//= factories/dashboard_factory.js

window.addEventListener("load", function initDashboard() {
  dashboardFactory.loadUsersList();
  dashboardFactory.initListeners();
  setInterval(dashboardFactory.checkUpdates, REQUEST_INTERVAL);
});
