/* exported serviceFactory */
/* global DM */
/* global CONFIGURATOR_PATH DASHBOARD_PATH ABOUT_PATH */

var serviceFactory = (function serviceFactoryModule() {
  function ServiceFactory() {}

  function addSourceToIFrame(source) {
    DM.getDOMElement("service-selected-content-container").src = source;
  }

  ServiceFactory.prototype.appendSelectedContent = function appendSelectedContent(
    hash
  ) {
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

  ServiceFactory.prototype.appendContent = function appendContent(event) {
    if (event.target.tagName !== "BUTTON") {
      return;
    }
    if (event.target.value === window.location.hash) {
      return;
    }

    serviceFactory.appendSelectedContent(event.target.value);
    window.location.hash = event.target.value;
  };

  return new ServiceFactory();
})();
