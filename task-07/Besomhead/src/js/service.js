/* exported CONFIGURATOR_PATH DASHBOARD_PATH ABOUT_PATH */
/* global serviceFactory */
/* global DM */

var CONFIGURATOR_PATH =
  "https://rawgit.com/Besomhead/js--touchsoft/besomhead-task07-build/task-07/Besomhead/build/html/chat_configurator.html";
// "../html/chat_configurator.html";
var DASHBOARD_PATH =
  "https://rawgit.com/Besomhead/js--touchsoft/besomhead-task07-build/task-07/Besomhead/build/html/dashboard.html";
// "../html/dashboard.html";
var ABOUT_PATH =
  "https://rawgit.com/Besomhead/js--touchsoft/besomhead-task07-build/task-07/Besomhead/build/html/about.html";
// "../html/about.html";

//= util/DOM_manager.js
//= factories/service_factory.js

window.addEventListener("load", function init() {
  DM.addListener(
    "service-buttons-container",
    "click",
    serviceFactory.appendContent
  );
  serviceFactory.appendSelectedContent(window.location.hash);
});
