/* exported serviceFactory */
/* global DM */
/* global CONFIGURATOR_PATH DASHBOARD_PATH ABOUT_PATH */

var serviceFactory = (function ServiceFactory() {
  var self = this;

  function addSourceToIFrame(source) {
    DM.getDOMElement("service-selected-content-container").src = source;
  }

  this.appendSelectedContent = function appendSelectedContent(hash) {
    switch (hash) {
      case "#configurator":
        addSourceToIFrame(CONFIGURATOR_PATH);
        break;
      case "#dashboard":
        addSourceToIFrame(DASHBOARD_PATH);
        break;
      case "#about":
        addSourceToIFrame(ABOUT_PATH);
        break;
      default:
    }
  };

  this.appendContent = function appendContent(event) {
    if (event.target.tagName !== "BUTTON") {
      return;
    }
    if (event.target.value === window.location.hash) {
      return;
    }

    self.appendSelectedContent(event.target.value);
    window.location.hash = event.target.value;
  };

  return self;
})();
