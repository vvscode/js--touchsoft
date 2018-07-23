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
    return Array.from(
      this.getDOMElement(root).getElementsByClassName(className)
    );
  };
  DOMManager.prototype.createDOMElement = document.createElement.bind(document);
  DOMManager.prototype.appendDOMElement = function append(root, element) {
    this.getDOMElement(root).appendChild(element);
  };
  DOMManager.prototype.removeDOMElement = function remove(root, element) {
    this.getDOMElement(root).removeChild(this.getDOMElement(element));
  };
  DOMManager.prototype.addListener = function addEventListener(
    root,
    event,
    callback
  ) {
    this.getDOMElement(root).addEventListener(event, callback);
  };
  DOMManager.prototype.removeListener = function removeEventListener(
    root,
    event,
    callback
  ) {
    this.getDOMElement(root).removeEventListener(event, callback);
  };
  DOMManager.prototype.addCSSClass = function addCSSClass(root) {
    var self = this;
    Array.from(arguments)
      .slice(1)
      .forEach(function addClasses(className) {
        self.getDOMElement(root).classList.add(className);
      });
  };
  DOMManager.prototype.removeCSSClass = function removeCSSClass(
    root,
    className
  ) {
    this.getDOMElement(root).classList.remove(className);
  };

  return new DOMManager();
})();
