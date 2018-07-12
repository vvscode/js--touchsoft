/* exported DM */

var DM = (function DOMManager() {
  this.getDOMElement = function getElement(idtf) {
    return typeof idtf === "string" ? document.getElementById(idtf) : idtf;
  };
  this.getDOMChildrenByTag = function getChildrenByTagName(root, tag) {
    return Array.from(this.getDOMElement(root).getElementsByTagName(tag));
  };
  this.getDOMChildrenByClass = function getChildrenByClassName(
    root,
    className
  ) {
    return Array.from(
      this.getDOMElement(root).getElementsByClassName(className)
    );
  };
  this.createDOMElement = document.createElement.bind(document);
  this.appendDOMElement = function append(root, element) {
    this.getDOMElement(root).appendChild(element);
  };
  this.removeDOMElement = function remove(root, element) {
    this.getDOMElement(root).removeChild(this.getDOMElement(element));
  };
  this.addListener = function addEventListener(root, event, callback) {
    this.getDOMElement(root).addEventListener(event, callback);
  };
  this.removeListener = function removeEventListener(root, event, callback) {
    this.getDOMElement(root).removeEventListener(event, callback);
  };
  this.addCSSClass = function addCSSClass(root) {
    var self = this;
    Array.from(arguments)
      .slice(1)
      .forEach(function addClasses(className) {
        self.getDOMElement(root).classList.add(className);
      });
  };
  this.removeCSSClass = function removeCSSClass(root, className) {
    this.getDOMElement(root).classList.remove(className);
  };

  return this;
})();
