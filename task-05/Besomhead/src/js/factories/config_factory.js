/* exported configFactory */
/* global DM */
/* global config */

var configFactory = (function ConfigFactory(config) {

  var EVENT_NAME = "change";
  var CHAT_TITLE_ID = "chat-configurator-chat-title";
  var CHAT_URL_ID = "chat-configurator-chat-url";
  var CHAT_CSS_CLASS_ID = "chat-configurator-chat-css-class";
  var CHAT_POSITION_RIGHT_ID = "chat-configurator-chat-position-right";
  var CHAT_POSITION_LEFT_ID = "chat-configurator-chat-position-left";
  var CHAT_POSITION_ID = "chat-configurator-chat-position";
  var ALLOW_MINIMIZE_ID = "chat-configurator-ui-minimize";
  var ALLOW_DRAG_ID = "chat-configurator-ui-drag";
  var REQUIRE_NAME_ID = "chat-configurator-ui-require-name";
  var SHOW_DATE_TIME_ID = "chat-configurator-ui-show-date";
  var NETWORK_XHR_ID = "chat-configurator-network-xhr";
  var NETWORK_FETCH_ID = "chat-configurator-network-fetch";
  var CODE_EXAMPLE_ID = "chat-configurator-code-source";
  var CODE_EXAMPLE_START = '<script src="' + config.chatFilePath + "?";
  var CODE_EXAMPLE_END = '"></script>';

  var self = this;

  function wrapWithQuotes(str) {
    return "'".concat(str).concat("'");
  }

  function getInputValue(componentID) {
    return wrapWithQuotes(DM.getDOMElement(componentID).value);
  }

  function getChatPosition() {
    var position = "position=";

    if (DM.getDOMElement(CHAT_POSITION_RIGHT_ID).selected) {
      position = position.concat(wrapWithQuotes("right"));
    } else if (DM.getDOMElement(CHAT_POSITION_LEFT_ID).selected) {
      position = position.concat(wrapWithQuotes("left"));
    }

    return position;
  }

  function getCheckBoxValue(componentID) {
    return DM.getDOMElement(componentID).checked
      ? wrapWithQuotes("true")
      : wrapWithQuotes("false");
  }

  function getNetworkRequestType() {
    var requestType = "requests=";

    if (DM.getDOMElement(NETWORK_XHR_ID).checked) {
      requestType = requestType.concat(wrapWithQuotes("xhr"));
    } else if (DM.getDOMElement(NETWORK_FETCH_ID).checked) {
      requestType = requestType.concat(wrapWithQuotes("fetch"));
    }

    return requestType;
  }

  this.createCodeExample = function createCodeExample() {
    DM.getDOMElement(CODE_EXAMPLE_ID).value = [
      CODE_EXAMPLE_START,
      "chatTitle=",
      getInputValue(CHAT_TITLE_ID),
      "&",
      "chatURL=",
      getInputValue(CHAT_URL_ID),
      "&",
      "cssClass=",
      getInputValue(CHAT_CSS_CLASS_ID),
      "&",
      getChatPosition(),
      "&",
      "allowMinimize=",
      getCheckBoxValue(ALLOW_MINIMIZE_ID),
      "&",
      "allowDrag=",
      getCheckBoxValue(ALLOW_DRAG_ID),
      "&",
      "requireName=",
      getCheckBoxValue(REQUIRE_NAME_ID),
      "&",
      "showDateTime=",
      getCheckBoxValue(SHOW_DATE_TIME_ID),
      "&",
      getNetworkRequestType(),
      CODE_EXAMPLE_END
    ].join("");
  };

  this.initListeners = function initListeners() {
    DM.addListener(CHAT_TITLE_ID, EVENT_NAME, self.createCodeExample);
    DM.addListener(CHAT_URL_ID, EVENT_NAME, self.createCodeExample);
    DM.addListener(CHAT_CSS_CLASS_ID, EVENT_NAME, self.createCodeExample);
    DM.addListener(CHAT_POSITION_ID, EVENT_NAME, self.createCodeExample);
    DM.addListener(ALLOW_MINIMIZE_ID, EVENT_NAME, self.createCodeExample);
    DM.addListener(ALLOW_DRAG_ID, EVENT_NAME, self.createCodeExample);
    DM.addListener(SHOW_DATE_TIME_ID, EVENT_NAME, self.createCodeExample);
    DM.addListener(REQUIRE_NAME_ID, EVENT_NAME, self.createCodeExample);
    DM.addListener(NETWORK_XHR_ID, EVENT_NAME, self.createCodeExample);
    DM.addListener(NETWORK_FETCH_ID, EVENT_NAME, self.createCodeExample);
  };

  return self;
})(config);
