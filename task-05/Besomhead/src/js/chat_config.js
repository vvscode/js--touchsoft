/* exported config */
/* global configFactory */

var config = {
  chatFilePath: "https://rawgit.com/Besomhead/js--touchsoft/besomhead-task05/task-05/Besomhead/src/js/chat.js"
};

//= factories/config_factory.js
//= util/DOM_manager.js


window.addEventListener("load", function initPage() {
  configFactory.initListeners();
  configFactory.createCodeExample();
});
