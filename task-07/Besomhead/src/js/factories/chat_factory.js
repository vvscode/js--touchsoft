/* exported chatFactory */
/* global config */
/* global DM */
/* global messageFactory */
/* global storageManager HTTP_GET HTTP_POST HTTP_PUT */
/* global updatesManager */

var chatFactory = (function chatFactoryModule(config) {
  var USER_ID = "chat-user-id";
  var COLLAPSED = "chat-collapsed";
  var EXPANDED = "chat-expanded";
  var CHAT_ITEM = "chat";
  var MESSAGES_LIST = "chat-messages";
  var INPUT_BOX = "chat-input-box";
  var INPUT_TEXT = "chat-input-txt";
  var CHAT_MESSAGE_BUTTON_ID = "chat-message-button";
  var TOGGLE_BUTTON = "chat-toggle-button";
  var EXPAND_MARK = "[ ]";
  var COLLAPSE_MARK = "-";
  var months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря"
  ];
  var REPLY_TIMEOUT = 15000;
  var PATH_TO_STYLESHEET =
    "https://rawgit.com/Besomhead/js--touchsoft/besomhead-task07-build/task-07/Besomhead/build/css/chat_styles.css";
  var DEFAULT_USER_NAME = "Вы";
  var USER_NAME_FIELD = "userName";
  var CHAT_STATE_FIELD = "chatState";
  var MESSAGES_FIELD = "messages";
  var COMMANDS_FIELD = "commands";
  var READ_FIELD = "read";
  var ASK_USER_PROMPT_ID = "chat-username-prompt-container";
  var PROMPT_INPUT_ID = "chat-username-prompt-input";
  var PROMPT_CONFIRM_BUTTON_ID = "chat-username-prompt-button";
  var REQUEST_TIMEOUT = 3000;
  var ZERO_TIMEOUT = 0;
  var IP_INFO_PATH = "https://ipinfo.io/";
  var IP_API_PATH = "http://ip-api.com/";
  var GEO_IP_PATH = "https://geoip-db.com/";

  var userData;

  function ChatFactory() {}

  function getExtraPath(path) {
    return localStorage.getItem(USER_ID) + "/" + path;
  }

  function saveChatStateToStorage(state) {
    config.chatState = state;
    storageManager.sendRequestToStorage(
      getExtraPath(CHAT_STATE_FIELD),
      HTTP_PUT,
      state
    );
  }

  function collapseChat() {
    config.messagesLength = 0;
    DM.removeCSSClass(CHAT_ITEM, EXPANDED);
    DM.addCSSClass(CHAT_ITEM, COLLAPSED);
    DM.getDOMElement(TOGGLE_BUTTON).innerHTML = EXPAND_MARK;
    DM.removeDOMElement(CHAT_ITEM, MESSAGES_LIST);
    DM.removeDOMElement(CHAT_ITEM, INPUT_BOX);
    saveChatStateToStorage(COLLAPSED);
  }

  function appendMessagePart(container, innerHTML) {
    var el = DM.createDOMElement("div");

    el.innerHTML = innerHTML;
    DM.appendDOMElement(container, el);
  }

  function appendDateLegend(container, message) {
    var dayOfMonth = DM.createDOMElement("legend");

    dayOfMonth.innerHTML = message.day
      .toString()
      .concat(" ")
      .concat(months[+message.month]);
    DM.addCSSClass(dayOfMonth, "chat-day-of-month");
    DM.appendDOMElement(container, dayOfMonth);
  }

  function appendSingleMessage(container, message) {
    var containerId;
    var messagesContainer;

    containerId = CHAT_ITEM.concat("-")
      .concat(message.day)
      .concat("-")
      .concat(message.month);
    if (DM.getDOMElement(containerId) === null) {
      messagesContainer = DM.createDOMElement("div");
      messagesContainer.id = containerId;
      DM.addCSSClass(messagesContainer, "chat-messages-container");
      if (config.showDateTime === "true") {
        DM.addCSSClass(messagesContainer, "chat-messages-container-with-time");
        appendDateLegend(container, message);
      } else if (config.showDateTime === "false") {
        DM.addCSSClass(messagesContainer, "chat-messages-container-no-time");
      }
      DM.appendDOMElement(container, messagesContainer);
    }
    messagesContainer = DM.getDOMElement(containerId);
    if (config.showDateTime === "true") {
      appendMessagePart(messagesContainer, message.time);
    }
    appendMessagePart(messagesContainer, message.sender);
    appendMessagePart(messagesContainer, message.body);
  }

  function showMessages(container, messages) {
    var messagesKeys = Object.keys(messages);
    config.messagesLength = messagesKeys.length;
    messagesKeys.forEach(function showMessage(key) {
      appendSingleMessage(container, messages[key]);
    });
  }

  ChatFactory.prototype.appendMessages = function appendMessages(
    container,
    messages
  ) {
    if (messages) {
      showMessages(container, messages);
      return;
    }

    storageManager
      .sendRequestToStorage(getExtraPath(MESSAGES_FIELD), HTTP_GET, "")
      .then(function showMessagesInChat(data) {
        if (!data) {
          return;
        }
        showMessages(container, data);
      });
  };

  function appendMessagesList() {
    var messagesListContainer = DM.createDOMElement("div");

    messagesListContainer.id = MESSAGES_LIST;
    DM.addCSSClass(messagesListContainer, "chat-messages-external");
    DM.appendDOMElement(CHAT_ITEM, messagesListContainer);
  }

  function updateMessagesList() {
    if (config.chatState === COLLAPSED) {
      setTimeout(updateMessagesList, REPLY_TIMEOUT);
      return;
    }
    storageManager
      .sendRequestToStorage(getExtraPath(MESSAGES_FIELD), HTTP_GET, "")
      .then(function onMessagesReceived(data) {
        var messagesKeys = Object.keys(data).slice(1);

        setTimeout(updateMessagesList, REPLY_TIMEOUT);
        if (!data) {
          return;
        }
        if (config.messagesLength >= messagesKeys.length) {
          return;
        }
        messagesKeys
          .slice(config.messagesLength)
          .forEach(function appendMessage(key) {
            appendSingleMessage(DM.getDOMElement(MESSAGES_LIST), data[key]);
          });
        config.messagesLength = messagesKeys.length;
      });
  }

  function saveMessage(message) {
    storageManager.sendRequestToStorage(
      getExtraPath(MESSAGES_FIELD),
      HTTP_POST,
      message
    );
  }

  function getPositionClass() {
    var positionClass;

    if (config.position === "left") {
      positionClass = "chat-container-left";
    } else if (config.position === "right") {
      positionClass = "chat-container-right";
    }

    return positionClass;
  }

  function createPromptMarkup(header, message, placeholder) {
    var promptContainer = DM.createDOMElement("fieldset");
    var promptLegend = DM.createDOMElement("legend");
    var promptLabel = DM.createDOMElement("label");
    var promptInput = DM.createDOMElement("input");
    var promptConfirmButton = DM.createDOMElement("button");

    promptContainer.id = ASK_USER_PROMPT_ID;
    DM.addCSSClass(
      promptContainer,
      "chat-prompt-container",
      getPositionClass()
    );
    promptLegend.innerHTML = header || "Имя";
    promptInput.id = PROMPT_INPUT_ID;
    promptInput.placeholder = placeholder || "Имя пользователя";
    DM.addCSSClass(promptInput, "chat-prompt-input");
    promptLabel.for = promptInput.id;
    promptLabel.innerHTML = message || "Пожалуйста, представьтесь:";
    promptConfirmButton.id = PROMPT_CONFIRM_BUTTON_ID;
    DM.addCSSClass(promptConfirmButton, "chat-prompt-button");
    promptConfirmButton.innerHTML = "Сохранить";

    DM.appendDOMElement(promptContainer, promptLegend);
    DM.appendDOMElement(promptContainer, promptLabel);
    DM.appendDOMElement(promptContainer, promptInput);
    DM.appendDOMElement(promptContainer, promptConfirmButton);
    DM.appendDOMElement(CHAT_ITEM, promptContainer);
  }

  function getUserNameFromStorage() {
    storageManager
      .sendRequestToStorage(getExtraPath(USER_NAME_FIELD), HTTP_GET, "")
      .then(function saveUserName(data) {
        config.userName = data;
      });
  }

  function setOtherComponentsAvailability(isAvailable) {
    DM.getDOMElement(INPUT_TEXT).disabled = !isAvailable;
    DM.getDOMElement(CHAT_MESSAGE_BUTTON_ID).disabled = !isAvailable;
    if (DM.getDOMElement(TOGGLE_BUTTON) !== null) {
      DM.getDOMElement(TOGGLE_BUTTON).disabled = !isAvailable;
    }
  }

  function askUserName() {
    createPromptMarkup();
    setOtherComponentsAvailability(false);
    DM.addListener(PROMPT_CONFIRM_BUTTON_ID, "click", function saveUserName() {
      var userName = DM.getDOMElement(PROMPT_INPUT_ID).value;
      if (userName.length < 1) {
        return;
      }
      config.userName = userName;
      DM.removeDOMElement(CHAT_ITEM, ASK_USER_PROMPT_ID);
      setOtherComponentsAvailability(true);
      storageManager.sendRequestToStorage(
        getExtraPath(USER_NAME_FIELD),
        HTTP_PUT,
        config.userName
      );
    });
  }

  function setUserName() {
    getUserNameFromStorage();
    setTimeout(function ifNotAssign() {
      if (
        config.userName !== null &&
        config.userName !== undefined &&
        config.userName !== ""
      ) {
        return;
      }
      if (config.requireName === "true") {
        askUserName();
      } else {
        config.userName = DEFAULT_USER_NAME;
        storageManager.sendRequestToStorage(
          getExtraPath(USER_NAME_FIELD),
          HTTP_PUT,
          config.userName
        );
      }
    }, REQUEST_TIMEOUT);
  }

  function sendMessage() {
    var inputTextArea = DM.getDOMElement(INPUT_TEXT);
    var message;

    if (inputTextArea.value !== "") {
      message = messageFactory.getMessage(
        new Date(),
        config.userName.concat(":"),
        inputTextArea.value
      );
      inputTextArea.value = "";
      appendSingleMessage(DM.getDOMElement(MESSAGES_LIST), message);
      saveMessage(message);
      storageManager.sendRequestToStorage(
        getExtraPath(READ_FIELD),
        HTTP_PUT,
        false
      );
    }
  }

  function appendInputBox() {
    var inputMessageContainer = DM.createDOMElement("div");
    var inputTextArea = DM.createDOMElement("textarea");
    var messageButton = DM.createDOMElement("button");

    inputMessageContainer.id = INPUT_BOX;
    DM.addCSSClass(inputMessageContainer, "chat-input-container");
    inputTextArea.id = INPUT_TEXT;
    DM.addCSSClass(inputTextArea, "chat-input-textarea");
    DM.appendDOMElement(inputMessageContainer, inputTextArea);
    messageButton.id = CHAT_MESSAGE_BUTTON_ID;
    DM.addCSSClass(messageButton, "chat-message-button");
    messageButton.innerHTML = "Отправить";
    DM.addListener(messageButton, "click", sendMessage);
    DM.appendDOMElement(inputMessageContainer, messageButton);
    DM.appendDOMElement(CHAT_ITEM, inputMessageContainer);
  }

  function expandChat() {
    DM.removeCSSClass(CHAT_ITEM, COLLAPSED);
    DM.addCSSClass(CHAT_ITEM, EXPANDED);
    if (config.allowMinimize === "true") {
      DM.getDOMElement(TOGGLE_BUTTON).innerHTML = COLLAPSE_MARK;
    }
    appendMessagesList();
    if (userData && userData.messages) {
      showMessages(DM.getDOMElement(MESSAGES_LIST), userData.messages);
    }
    appendInputBox();
    if (
      config.userName === "" ||
      config.userName === null ||
      config.userName === undefined
    ) {
      setUserName();
    }
    saveChatStateToStorage(EXPANDED);
  }

  function markUserCommandAsShown(userCommand, commandKey) {
    userCommand.shown = true;
    storageManager.sendRequestToStorage(
      getExtraPath(COMMANDS_FIELD + "/" + commandKey + "/shown"),
      HTTP_PUT,
      userCommand.shown
    );
  }

  function saveUserCommandResult(userCommand, commandKey, result) {
    storageManager.sendRequestToStorage(
      getExtraPath(COMMANDS_FIELD + "/" + commandKey + "/result"),
      HTTP_PUT,
      result
    );
  }

  function askUser(userCommand, commandKey) {
    if (DM.getDOMElement(ASK_USER_PROMPT_ID)) {
      return;
    }
    markUserCommandAsShown(userCommand, commandKey);
    if (config.chatState === COLLAPSED) {
      expandChat();
    }
    createPromptMarkup.apply(this, userCommand.params);
    DM.addListener(PROMPT_CONFIRM_BUTTON_ID, "click", function saveResult() {
      if (!DM.getDOMElement(PROMPT_INPUT_ID).value) {
        return;
      }
      saveUserCommandResult(
        userCommand,
        commandKey,
        DM.getDOMElement(PROMPT_INPUT_ID).value
      );
      DM.removeDOMElement(CHAT_ITEM, ASK_USER_PROMPT_ID);
    });
  }

  function getUserInfo(userCommand, commandKey) {
    var service = userCommand.params.shift();

    markUserCommandAsShown(userCommand, commandKey);
    switch (service) {
      case IP_INFO_PATH:
        storageManager
          .getDataFromService(service)
          .then(function saveResult(data) {
            saveUserCommandResult(
              userCommand,
              commandKey,
              JSON.stringify(data, null, 2)
            );
          });
        break;
      case IP_API_PATH:
        storageManager
          .getDataFromService(service + "json")
          .then(function saveResult(data) {
            saveUserCommandResult(
              userCommand,
              commandKey,
              JSON.stringify(data, null, 2)
            );
          });
        break;
      case GEO_IP_PATH:
        storageManager
          .getDataFromService(service + "json/")
          .then(function saveResult(data) {
            saveUserCommandResult(
              userCommand,
              commandKey,
              JSON.stringify(data, null, 2)
            );
          });
        break;
      default:
    }
  }

  function runUserCommand(userCommand, commandKey) {
    var commandMethod;

    if (userCommand.shown) {
      return;
    }

    switch (userCommand.type) {
      case "user-info":
        commandMethod = getUserInfo;
        break;
      case "ask-user":
        commandMethod = askUser;
        break;
      default:
    }
    setTimeout(commandMethod.bind(this, userCommand, commandKey), ZERO_TIMEOUT);
  }

  function applyUpdates(event) {
    var data = event.data.data;
    var path = event.data.path;
    var pathFragments = path.split("/").slice(1);
    var dataKey;

    if (path === "/") {
      userData = data;
      if(!userData.commands){
        userData.commands = {};
      }
      if (config.chatState === COLLAPSED) {
        return;
      }
      chatFactory.appendMessages(
        DM.getDOMElement(MESSAGES_LIST),
        userData.messages
      );
      if (userData.commands) {
        Object.keys(userData.commands).forEach(function runCommand(commandKey) {
          runUserCommand(userData.commands[commandKey], commandKey);
        });
      }
      return;
    }

    switch (pathFragments.shift()) {
      case MESSAGES_FIELD:
        userData.messages[pathFragments.shift()] = data;
        if (data.sender.indexOf(config.userName) !== -1) {
          return;
        }
        if (config.chatState === COLLAPSED) {
          return;
        }
        appendSingleMessage(DM.getDOMElement(MESSAGES_LIST), data);
        break;
      case COMMANDS_FIELD:
        dataKey = pathFragments.shift();
        if (pathFragments.shift()) {
          return;
        }
        userData.commands[dataKey] = data;
        runUserCommand(data, dataKey);
        break;
      default:
    }
  }

  function updateCommands() {
    storageManager
      .sendRequestToStorage(getExtraPath(COMMANDS_FIELD), HTTP_GET, "")
      .then(function onCommandsReceived(data) {
        var commandsKeys = Object.keys(data);

        setTimeout(updateCommands, REPLY_TIMEOUT);
        if (!data) {
          return;
        }
        if (config.commandsLength >= commandsKeys.length) {
          return;
        }
        commandsKeys
          .slice(config.commandsLength)
          .forEach(function runCommand(key) {
            runUserCommand(data[key], key);
          });
        config.commandsLength = commandsKeys.length;
      });
  }

  ChatFactory.prototype.subscribeOnUpdates = function subscribeOnUpdates() {
    if (config.updates === "refetch") {
      updateMessagesList();
      updateCommands();
    } else if (config.updates === "longPolling") {
      window.addEventListener("message", applyUpdates);
      updatesManager.getDataFromStorage(getExtraPath(""));
    }
  };

  function getChatStateFromStorage() {
    storageManager
      .sendRequestToStorage(getExtraPath(CHAT_STATE_FIELD), HTTP_GET, "")
      .then(function saveChatState(data) {
        config.chatState = data;
      });
  }

  function initChatState() {
    getChatStateFromStorage();
    setTimeout(function resolveChatState() {
      if (
        config.chatState === null ||
        config.chatState === undefined ||
        config.chatState === ""
      ) {
        saveChatStateToStorage(COLLAPSED);
      } else if (config.chatState === EXPANDED) {
        expandChat();
      }
      DM.addCSSClass(CHAT_ITEM, config.chatState);
    }, REQUEST_TIMEOUT);
  }

  function changeChatState() {
    switch (config.chatState) {
      case COLLAPSED:
        expandChat();
        break;
      case EXPANDED:
        collapseChat();
        break;
      default:
        throw new Error(
          "Unexpected key/value pair: " + CHAT_ITEM + "/" + config.chatState
        );
    }
  }

  ChatFactory.prototype.appendStylesheet = function appendStylesheet() {
    var styleElement = DM.createDOMElement("link");

    styleElement.rel = "stylesheet";
    styleElement.type = "text/css";
    styleElement.href = PATH_TO_STYLESHEET;
    DM.appendDOMElement(document.head, styleElement);
  };

  function appendToggleButton(container) {
    var toggleButton = DM.createDOMElement("button");
    DM.addCSSClass(toggleButton, TOGGLE_BUTTON);
    toggleButton.id = TOGGLE_BUTTON;
    toggleButton.innerHTML =
      config.chatState === EXPANDED ? COLLAPSE_MARK : EXPAND_MARK;
    DM.addListener(toggleButton, "click", changeChatState);
    DM.appendDOMElement(container, toggleButton);
  }

  function setDragHandler(container) {
    function getCoordinates(elem) {
      var box = elem.getBoundingClientRect();
      return {
        top: box.top + window.pageYOffset,
        left: box.left + window.pageXOffset
      };
    }

    DM.addListener(container, "mousedown", function onMouseDown(event) {
      var chat = DM.getDOMElement(CHAT_ITEM);
      var coordinates = getCoordinates(chat);
      var shiftX = event.pageX - coordinates.left;
      var shiftY = event.pageY - coordinates.top;
      var mouseMoveHandler;
      var mouseUpHandler;

      if (event.target.tagName === "BUTTON") {
        return;
      }

      function moveAt(e) {
        chat.style.left = e.pageX - shiftX + "px";
        chat.style.top = e.pageY - shiftY + "px";
      }

      mouseMoveHandler = function onMouseMove(e) {
        moveAt(e);
      };
      mouseUpHandler = function onMouseUp() {
        DM.removeListener(document, "mousemove", mouseMoveHandler);
        DM.removeListener(container, "mouseup", mouseUpHandler);
      };
      moveAt(event);
      DM.addListener(document, "mousemove", mouseMoveHandler);
      DM.addListener(container, "mouseup", mouseUpHandler);
    });

    DM.addListener(container, "dragstart", function onDragStart() {
      return false;
    });
  }

  ChatFactory.prototype.createChatMarkup = function createChatMarkup() {
    var container = DM.createDOMElement("fieldset");
    var legend = DM.createDOMElement("legend");
    var toggleButtonContainer = DM.createDOMElement("div");

    container.id = CHAT_ITEM;
    DM.addCSSClass(
      container,
      "chat-container",
      getPositionClass(),
      config.cssClass
    );
    legend.innerHTML = config.chatTitle;
    DM.addCSSClass(legend, "chat-legend");
    container.appendChild(legend);
    DM.addCSSClass(toggleButtonContainer, "chat-toggle-button-container");
    if (config.allowDrag === "true") {
      DM.addCSSClass(
        toggleButtonContainer,
        "chat-toggle-button-container-drag"
      );
      setDragHandler(toggleButtonContainer);
    }
    if (config.allowMinimize === "true") {
      appendToggleButton(toggleButtonContainer);
    } else if (config.allowMinimize === "false") {
      saveChatStateToStorage(EXPANDED);
    }
    DM.appendDOMElement(container, toggleButtonContainer);
    DM.appendDOMElement(document.body, container);
    initChatState();
  };

  function getParamsFromRequest() {
    var script = document.currentScript.src;
    return script
      .substr(script.indexOf("?") + 1)
      .split("&")
      .reduce(function reducer(param, el) {
        var parts = el.split("=");
        var value = decodeURIComponent(parts[1]);
        param[decodeURIComponent(parts[0])] = value.substr(1, value.length - 2);
        return param;
      }, {});
  }

  ChatFactory.prototype.setConfig = function setConfig() {
    var requestConfig = getParamsFromRequest();
    var propertyValue;

    Object.keys(requestConfig).forEach(function applyProperties(key) {
      propertyValue = requestConfig[key];
      if (propertyValue !== "") {
        config[key] = propertyValue;
      }
    });
  };

  ChatFactory.prototype.setUniqueUserID = function setUniqueUserID() {
    if (localStorage.getItem(USER_ID) === null) {
      localStorage.setItem(USER_ID, "user".concat(Date.now().toString()));
    }
  };

  return new ChatFactory();
})(config);
