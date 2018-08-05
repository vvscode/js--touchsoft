/* exported config */
/* global configFactory */

var config = {
  chatFilePath:
    "https://rawgit.com/Besomhead/js--touchsoft/besomhead-task07-build/task-07/Besomhead/build/js/chat.js"
};

//= factories/config_factory.js
//= util/DOM_manager.js

window.addEventListener("load", function initPage() {
  configFactory.initListeners();
  configFactory.createCodeExample();
});
