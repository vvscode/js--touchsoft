/* exported CONFIGURATOR_PATH DASHBOARD_PATH ABOUT_PATH */
/* global serviceFactory */
/* global DM */

var CONFIGURATOR_PATH = "../html/chat_configurator.html";
var DASHBOARD_PATH = "../html/dashboard.html";
var ABOUT_PATH = "../html/about.html";

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
