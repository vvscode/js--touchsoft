/* exported DM */

var DM = (function DOMManagerModule() {
  function DOMManager() {}

  DOMManager.prototype.getDOMElement = function getElement(idtf) {
    return typeof idtf === "string" ? document.getElementById(idtf) : idtf;
  };
  DOMManager.prototype.getDOMChildrenByTag = function getChildrenByTagName(
    root,
    tag
  ) {
    return Array.from(this.getDOMElement(root).getElementsByTagName(tag));
  };
  DOMManager.prototype.getDOMChildrenByClass = function getChildrenByClassName(
    root,
    className
  ) {
    return Array.from(DM.getDOMElement(root).getElementsByClassName(className));
  };
  DOMManager.prototype.createDOMElement = document.createElement.bind(document);
  DOMManager.prototype.appendDOMElement = function append(root, element) {
    DM.getDOMElement(root).appendChild(element);
  };
  DOMManager.prototype.removeDOMElement = function remove(root, element) {
    DM.getDOMElement(root).removeChild(DM.getDOMElement(element));
  };
  DOMManager.prototype.addListener = function addEventListener(
    root,
    event,
    callback
  ) {
    DM.getDOMElement(root).addEventListener(event, callback);
  };
  DOMManager.prototype.removeListener = function removeEventListener(
    root,
    event,
    callback
  ) {
    DM.getDOMElement(root).removeEventListener(event, callback);
  };
  DOMManager.prototype.addCSSClass = function addCSSClass(root) {
    Array.from(arguments)
      .slice(1)
      .forEach(function addClasses(className) {
        DM.getDOMElement(root).classList.add(className);
      });
  };
  DOMManager.prototype.removeCSSClass = function removeCSSClass(
    root,
    className
  ) {
    DM.getDOMElement(root).classList.remove(className);
  };

  return new DOMManager();
})();
