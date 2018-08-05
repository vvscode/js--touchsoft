/* exported configFactory */
/* global DM */
/* global config */

var configFactory = (function configFactoryModule(config) {
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
  var NETWORK_ID = "chat-configurator-network";
  var NETWORK_XHR_ID = "chat-configurator-network-xhr";
  var NETWORK_FETCH_ID = "chat-configurator-network-fetch";
  var UPDATES_ID = "chat-configurator-updates";
  var UPDATES_REFETCH_ID = "chat-configurator-updates-refetch";
  var UPDATES_LONG_POLLING_ID = "chat-configurator-updates-longpoll";
  var CODE_EXAMPLE_ID = "chat-configurator-code-source";
  var CODE_EXAMPLE_START = '<script src="' + config.chatFilePath + "?";
  var CODE_EXAMPLE_END = '"></script>';

  function ConfigFactory() {}

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

  function getSelectedButton(container) {
    var button;
    var divs = DM.getDOMChildrenByTag(container, "div");

    while (!button) {
      button = DM.getDOMChildrenByTag(divs.shift(), "input").find(
        function findSelected(el) {
          return el.checked;
        }
      );
    }

    return button;
  }

  function getSelectedValue(
    target,
    firstOption,
    firstValue,
    secondOption,
    secondValue
  ) {
    var emitter = getSelectedButton(target);
    var value = "";

    if (emitter.id === firstOption) {
      value = wrapWithQuotes(firstValue);
    } else if (emitter.id === secondOption) {
      value = wrapWithQuotes(secondValue);
    }

    return value;
  }

  function getNetworkRequestType() {
    return "requests=".concat(
      getSelectedValue(
        DM.getDOMElement(NETWORK_ID),
        NETWORK_XHR_ID,
        "xhr",
        NETWORK_FETCH_ID,
        "fetch"
      )
    );
  }

  function getUpdatesPolitics() {
    return "subscribeOnUpdates=".concat(
      getSelectedValue(
        DM.getDOMElement(UPDATES_ID),
        UPDATES_LONG_POLLING_ID,
        "longPolling",
        UPDATES_REFETCH_ID,
        "refetch"
      )
    );
  }

  ConfigFactory.prototype.createCodeExample = function createCodeExample() {
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
      "&",
      getUpdatesPolitics(),
      CODE_EXAMPLE_END
    ].join("");
  };

  ConfigFactory.prototype.initListeners = function initListeners() {
    DM.addListener(CHAT_TITLE_ID, EVENT_NAME, this.createCodeExample);
    DM.addListener(CHAT_URL_ID, EVENT_NAME, this.createCodeExample);
    DM.addListener(CHAT_CSS_CLASS_ID, EVENT_NAME, this.createCodeExample);
    DM.addListener(CHAT_POSITION_ID, EVENT_NAME, this.createCodeExample);
    DM.addListener(ALLOW_MINIMIZE_ID, EVENT_NAME, this.createCodeExample);
    DM.addListener(ALLOW_DRAG_ID, EVENT_NAME, this.createCodeExample);
    DM.addListener(SHOW_DATE_TIME_ID, EVENT_NAME, this.createCodeExample);
    DM.addListener(REQUIRE_NAME_ID, EVENT_NAME, this.createCodeExample);
    DM.addListener(NETWORK_ID, EVENT_NAME, this.createCodeExample);
    DM.addListener(UPDATES_ID, EVENT_NAME, this.createCodeExample);
  };

  return new ConfigFactory();
})(config);
