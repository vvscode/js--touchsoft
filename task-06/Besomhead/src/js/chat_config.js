/* exported config */
/* global configFactory */

var config = {
  chatFilePath:
    "https://rawgit.com/Besomhead/js--touchsoft/besomhead-task06-build/task-06/Besomhead/build/js/chat.js"
};

//= factories/config_factory.js
//= util/DOM_manager.js

window.addEventListener("load", function initPage() {
  configFactory.initListeners();
  configFactory.createCodeExample();
});
