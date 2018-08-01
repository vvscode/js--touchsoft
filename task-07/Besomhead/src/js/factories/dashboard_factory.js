/* exported dashboardFactory */
/* global messageFactory */
/* global DM */
/* global storageManager HTTP_POST HTTP_PUT */
/* global config */
/* global updatesManager */

var dashboardFactory = (function dashboardFactoryModule(config) {
  var DEFAULT_USERNAME = "Вы";
  var USER_ONLINE_TIMEOUT = 120000;
  var USERS_LIST_CONTAINER_ID = "operators-dashboard-users-list-container";
  var SELECTED_USER_CONTAINER_ID =
    "operators-dashboard-selected-user-container";
  var SELECTED_USER_INNER_ID = "operators-dashboard-selected-user-inner";
  var USER_CHAT_MESSAGES_ID = "operators-dashboard-user-chat-messages";
  var USER_CHAT_INPUT_ID = "operators-dashboard-user-chat-input";
  var SELECTED_USER_CONTROL_ID = "operators-dashboard-selected-user-control";
  var SELECTED_USER_CONTROL_DIALOG_ID =
    "operators-dashboard-selected-user-control-dialog";
  var SELECTED_USER_CONTROL_DIALOG_INPUT_ID =
    "operators-dashboard-selected-user-control-dialog-input";
  var IP_INFO_PATH = "https://ipinfo.io/";
  var IP_API_PATH = "http://ip-api.com/";
  var GEO_IP_PATH = "https://geoip-db.com/";
  var COMMANDS_PANEL_ID = "dashboard-selected-user-commands-panel";
  var COMMAND_SELECT_ID = "operators-dashboard-command-select";
  var SELECT_OPTION_ID_TEMPLATE = "operators-dashboard-command-";
  var PARAM_BUTTON_ID_TEMPLATE = "operators-dashboard-selected-user-param-";
  var FIRST_PARAM_BUTTON_ID = PARAM_BUTTON_ID_TEMPLATE + "1";
  var SECOND_PARAM_BUTTON_ID = PARAM_BUTTON_ID_TEMPLATE + "2";
  var THIRD_PARAM_BUTTON_ID = PARAM_BUTTON_ID_TEMPLATE + "3";
  var LOG_PANEL_ID = "operators-dashboard-selected-user-commands-log";
  var SINGLE_USER_CLASS_NAME = "dashboard-single-user-container";
  var UNREAD_CLASS_NAME = "dashboard-single-user-container-unread";
  var ONLINE_CLASS_NAME = "dashboard-user-status-online";
  var OFFLINE_CLASS_NAME = "dashboard-user-status-offline";
  var LESS = -1;
  var MORE = 1;

  var usersData;
  var paramIndex;
  var command = {
    type: "",
    params: []
  };

  function DashboardFactory() {}

  function closeSelectedUserContainer() {
    DM.removeDOMElement(SELECTED_USER_CONTAINER_ID, SELECTED_USER_INNER_ID);
  }

  function getUserID(userContainer) {
    return DM.getDOMChildrenByTag(userContainer, "label").find(function findID(
      field
    ) {
      return field.hidden;
    }).innerHTML;
  }

  function appendSingleMessage(message) {
    var messages = DM.getDOMElement(USER_CHAT_MESSAGES_ID);
    var sender = DM.createDOMElement("div");
    var body = DM.createDOMElement("div");

    sender.innerHTML = message.sender;
    body.innerHTML = message.body;

    DM.appendDOMElement(messages, sender);
    DM.appendDOMElement(messages, body);
  }

  function sendMessage(userContainer) {
    var inputValue = DM.getDOMElement(USER_CHAT_INPUT_ID).value;
    var operatorMessage;

    if (inputValue === "") {
      return;
    }
    operatorMessage = messageFactory.getMessage(
      new Date(),
      config.operatorName + ":",
      inputValue
    );
    DM.getDOMElement(USER_CHAT_INPUT_ID).value = "";
    storageManager.sendRequestToStorage(
      getUserID(userContainer) + "/messages",
      HTTP_POST,
      operatorMessage
    );
  }

  function createUserChatContainer(userContainer) {
    var userChatContainer = DM.createDOMElement("fieldset");
    var userChatLegend = DM.createDOMElement("legend");
    var userChatMessagesList = DM.createDOMElement("div");
    var userChatMessageInput = DM.createDOMElement("textarea");
    var userChatSendButton = DM.createDOMElement("button");

    DM.addCSSClass(userChatContainer, "dashboard-selected-user-chat-container");
    userChatLegend.innerHTML = "Чат";
    userChatMessagesList.id = USER_CHAT_MESSAGES_ID;
    DM.addCSSClass(
      userChatMessagesList,
      "dashboard-selected-user-chat-messages"
    );
    userChatMessageInput.id = USER_CHAT_INPUT_ID;
    DM.addCSSClass(userChatMessageInput, "dashboard-selected-user-chat-input");
    userChatMessageInput.placeholder = "Новое сообщение пользователю";
    DM.addCSSClass(userChatSendButton, "dashboard-selected-user-chat-button");
    userChatSendButton.innerHTML = "Send";
    DM.addListener(
      userChatSendButton,
      "click",
      sendMessage.bind(null, userContainer)
    );

    DM.appendDOMElement(userChatContainer, userChatLegend);
    DM.appendDOMElement(userChatContainer, userChatMessagesList);
    DM.appendDOMElement(userChatContainer, userChatMessageInput);
    DM.appendDOMElement(userChatContainer, userChatSendButton);

    return userChatContainer;
  }

  function removeDialog() {
    if (!DM.getDOMElement(SELECTED_USER_CONTROL_DIALOG_ID)) {
      return;
    }

    DM.removeDOMElement(
      SELECTED_USER_CONTROL_ID,
      SELECTED_USER_CONTROL_DIALOG_ID
    );
  }

  function saveParamAndClose(param) {
    command.params[paramIndex] = param;
    removeDialog();
  }

  function setServiceName(event) {
    var emitter = event.target;

    saveParamAndClose(
      DM.getDOMChildrenByTag(emitter.parentNode, "label").find(
        function findLabel(label) {
          return label.for === emitter.id;
        }
      ).innerHTML
    );
  }

  function createDialogContainer(dialogMessage) {
    var container = DM.createDOMElement("div");
    var dialogLabel = DM.createDOMElement("label");

    container.id = SELECTED_USER_CONTROL_DIALOG_ID;
    DM.addCSSClass(container, "dashboard-selected-user-control-dialog");
    dialogLabel.innerHTML = dialogMessage;

    DM.appendDOMElement(container, dialogLabel);
    DM.appendDOMElement(SELECTED_USER_CONTROL_ID, container);

    return container;
  }

  function askServiceName() {
    var optionsContainer = DM.createDOMElement("div");
    var radioButton;
    var buttonLabel;
    var index = 0;

    DM.addCSSClass(
      optionsContainer,
      "dashboard-selected-user-control-dialog-options"
    );
    [IP_INFO_PATH, IP_API_PATH, GEO_IP_PATH].forEach(function appendRadios(
      serviceName
    ) {
      radioButton = DM.createDOMElement("input");
      radioButton.type = "radio";
      radioButton.id =
        "operators-dashboard-selected-user-control-dialog-option-" + ++index;
      radioButton.name = "service";
      DM.addListener(radioButton, "click", setServiceName);
      buttonLabel = DM.createDOMElement("label");
      buttonLabel.innerHTML = serviceName;
      buttonLabel.for = radioButton.id;

      DM.appendDOMElement(optionsContainer, radioButton);
      DM.appendDOMElement(optionsContainer, buttonLabel);
    });

    DM.appendDOMElement(
      createDialogContainer("What service do you want to use?"),
      optionsContainer
    );
  }

  function askPromptParam(dialogMessage) {
    var dialog;
    var inputField = DM.createDOMElement("input");
    var submitButton = DM.createDOMElement("button");

    removeDialog();
    dialog = createDialogContainer(dialogMessage);
    inputField.id = SELECTED_USER_CONTROL_DIALOG_INPUT_ID;
    DM.addCSSClass(inputField, "dashboard-selected-user-control-dialog-input");
    submitButton.innerHTML = "Save";
    DM.addCSSClass(
      submitButton,
      "dashboard-selected-user-control-dialog-button"
    );
    DM.addListener(submitButton, "click", function saveParam() {
      saveParamAndClose(
        DM.getDOMElement(SELECTED_USER_CONTROL_DIALOG_INPUT_ID).value
      );
    });

    DM.appendDOMElement(dialog, inputField);
    DM.appendDOMElement(dialog, submitButton);
  }

  function askDialogHeader() {
    askPromptParam("What header do you want?");
  }

  function setParamIndex(index) {
    paramIndex = index;
  }

  function appendParamsButtons(container) {
    var index = 0;
    var button;

    [
      FIRST_PARAM_BUTTON_ID,
      SECOND_PARAM_BUTTON_ID,
      THIRD_PARAM_BUTTON_ID
    ].forEach(function createParamButtons(buttonID) {
      button = DM.createDOMElement("button");
      button.id = buttonID;
      DM.addCSSClass(button, "dashboard-selected-user-param-button");
      DM.addListener(button, "click", setParamIndex.bind(this, index));
      button.innerHTML = "Param" + ++index;
      DM.appendDOMElement(container, button);
    });
  }

  function getSelectedOption(select) {
    return DM.getDOMChildrenByTag(select, "option").find(function findSelected(
      option
    ) {
      return option.selected;
    });
  }

  function setParamsAvailability(isAvailable) {
    DM.getDOMElement(SECOND_PARAM_BUTTON_ID).disabled = !isAvailable;
    DM.getDOMElement(THIRD_PARAM_BUTTON_ID).disabled = !isAvailable;
  }

  function changeFirstParamListener(toRemove, toAdd) {
    DM.removeListener(FIRST_PARAM_BUTTON_ID, "click", toRemove);
    DM.addListener(FIRST_PARAM_BUTTON_ID, "click", toAdd);
  }

  function resetParamButtons() {
    [
      FIRST_PARAM_BUTTON_ID,
      SECOND_PARAM_BUTTON_ID,
      THIRD_PARAM_BUTTON_ID
    ].forEach(function resetButtons(buttonID, idIndex) {
      var button = DM.getDOMElement(buttonID);
      var replacement = button.cloneNode();

      replacement.innerHTML = button.innerHTML;
      replacement.disabled = false;
      replacement.addEventListener("click", setParamIndex.bind(this, idIndex));
      button.parentNode.replaceChild(replacement, button);
    });
  }

  function onCommandSelected(event) {
    var target = getSelectedOption(event.target);
    var commandName = target.id.slice(
      target.id.indexOf(SELECT_OPTION_ID_TEMPLATE) +
        SELECT_OPTION_ID_TEMPLATE.length
    );

    removeDialog();
    switch (commandName) {
      case "ask-user":
        command.type = commandName;
        setParamsAvailability(true);
        changeFirstParamListener(askServiceName, askDialogHeader);
        DM.addListener(
          SECOND_PARAM_BUTTON_ID,
          "click",
          askPromptParam.bind(this, "What message do you want to show?")
        );
        DM.addListener(
          THIRD_PARAM_BUTTON_ID,
          "click",
          askPromptParam.bind(this, "What placeholder do you want?")
        );
        break;
      case "user-info":
        command.type = commandName;
        setParamsAvailability(false);
        changeFirstParamListener(askDialogHeader, askServiceName);
        break;
      default:
        resetParamButtons();
    }
  }

  function createCommandsSelect() {
    var commandsSelect = DM.createDOMElement("select");
    var option;

    commandsSelect.id = COMMAND_SELECT_ID;
    DM.addCSSClass(commandsSelect, "dashboard-selected-user-command-select");
    ["Select command", "User Info", "Ask User"].forEach(function createOptions(
      name
    ) {
      option = DM.createDOMElement("option");
      option.id =
        SELECT_OPTION_ID_TEMPLATE + name.toLowerCase().replace(" ", "-");
      option.innerHTML = name;
      DM.appendDOMElement(commandsSelect, option);
    });
    DM.addListener(commandsSelect, "change", onCommandSelected);

    return commandsSelect;
  }

  function sendCommand() {
    storageManager.sendRequestToStorage(
      getUserID(DM.getDOMElement(SELECTED_USER_INNER_ID)) + "/commands",
      HTTP_POST,
      messageFactory.getCommandMessage(new Date(), command.type, command.params)
    );
    command.params = [];
  }

  function getCommandsPanel() {
    var commandsPanel = DM.createDOMElement("div");
    var runCommandButton = DM.createDOMElement("button");

    commandsPanel.id = COMMANDS_PANEL_ID;
    DM.addCSSClass(commandsPanel, "dashboard-selected-user-commands-panel");
    DM.addCSSClass(runCommandButton, "dashboard-selected-user-run-button");
    runCommandButton.innerHTML = "Run";

    DM.appendDOMElement(commandsPanel, createCommandsSelect());
    appendParamsButtons(commandsPanel);
    DM.appendDOMElement(commandsPanel, runCommandButton);
    DM.addListener(runCommandButton, "click", sendCommand);

    return commandsPanel;
  }

  function appendSingleCommand(logPanel, userCommand) {
    var date = DM.createDOMElement("div");
    var signature = DM.createDOMElement("div");
    var result = DM.createDOMElement("div");

    date.innerHTML = userCommand.date;
    signature.innerHTML =
      userCommand.type + ' ("' + userCommand.params.join('","') + '")';
    result.innerHTML = userCommand.result;

    DM.appendDOMElement(logPanel, date);
    DM.appendDOMElement(logPanel, signature);
    DM.appendDOMElement(logPanel, result);
  }

  function appendUserCommands(userContainer, logPanel) {
    var userID = getUserID(userContainer);
    var userCommands = usersData[userID].commands;

    if (!userCommands) {
      return;
    }
    Object.keys(userCommands).forEach(function appendUserCommand(key) {
      if (!userCommands[key].result) {
        return;
      }
      appendSingleCommand(logPanel, userCommands[key]);
    });
  }

  function createUserControllerContainer(userContainer) {
    var userControllerContainer = DM.createDOMElement("fieldset");
    var userControllerLegend = DM.createDOMElement("legend");
    var commandsLabel = DM.createDOMElement("label");
    var logLabel = DM.createDOMElement("label");
    var logPanel = DM.createDOMElement("div");

    userControllerContainer.id = SELECTED_USER_CONTROL_ID;
    DM.addCSSClass(
      userControllerContainer,
      "dashboard-selected-user-controller"
    );
    userControllerLegend.innerHTML = "Control";
    commandsLabel.innerHTML = "Command:";
    commandsLabel.for = COMMANDS_PANEL_ID;
    logLabel.for = LOG_PANEL_ID;
    logLabel.innerHTML = "Log:";
    logPanel.id = LOG_PANEL_ID;
    DM.addCSSClass(logPanel, "dashboard-selected-user-commands-log");
    DM.appendDOMElement(userControllerContainer, userControllerLegend);
    DM.appendDOMElement(userControllerContainer, commandsLabel);
    DM.appendDOMElement(userControllerContainer, getCommandsPanel());
    DM.appendDOMElement(userControllerContainer, logLabel);
    DM.appendDOMElement(userControllerContainer, logPanel);
    appendUserCommands(userContainer, logPanel);

    return userControllerContainer;
  }

  function appendSelectedUserContainer(userContainer) {
    var selectedUserContainer = DM.createDOMElement("fieldset");
    var userContainerLegend = DM.createDOMElement("legend");
    var userContainerCloseButton = DM.createDOMElement("button");
    var userIDField = DM.createDOMElement("label");
    var userContainersInner = DM.createDOMElement("div");

    selectedUserContainer.id = SELECTED_USER_INNER_ID;
    DM.addCSSClass(
      selectedUserContainer,
      "dashboard-selected-user-container-inner"
    );
    userContainerLegend.innerHTML =
      "Active: " +
      DM.getDOMChildrenByTag(userContainer, "label").shift().innerHTML;
    userContainerCloseButton.innerHTML = "x";
    DM.addCSSClass(
      userContainerCloseButton,
      "dashboard-selected-user-container-button"
    );
    DM.addListener(
      userContainerCloseButton,
      "click",
      closeSelectedUserContainer
    );
    DM.addCSSClass(
      userContainersInner,
      "dashboard-selected-user-controls-container"
    );
    userIDField.innerHTML = getUserID(userContainer);
    userIDField.hidden = true;

    DM.appendDOMElement(
      userContainersInner,
      createUserChatContainer(userContainer)
    );
    DM.appendDOMElement(
      userContainersInner,
      createUserControllerContainer(userContainer)
    );
    DM.appendDOMElement(selectedUserContainer, userContainerLegend);
    DM.appendDOMElement(selectedUserContainer, userContainerCloseButton);
    DM.appendDOMElement(selectedUserContainer, userContainersInner);
    DM.appendDOMElement(selectedUserContainer, userIDField);
    DM.appendDOMElement(SELECTED_USER_CONTAINER_ID, selectedUserContainer);
  }

  function appendSelectedUserMessages(userContainer) {
    var messages = usersData[getUserID(userContainer)].messages;

    if (!messages) {
      return;
    }
    Object.keys(messages).forEach(function appendMessage(key) {
      appendSingleMessage(messages[key]);
    });
  }

  function sendReadMarkToStorage(userContainer) {
    storageManager.sendRequestToStorage(
      getUserID(userContainer) + "/read",
      HTTP_PUT,
      true
    );
  }

  function selectUser(event) {
    if (!event.target.classList.contains(SINGLE_USER_CLASS_NAME)) {
      return;
    }
    if (DM.getDOMElement(SELECTED_USER_INNER_ID)) {
      closeSelectedUserContainer();
    }
    DM.removeCSSClass(event.target, UNREAD_CLASS_NAME);

    appendSelectedUserContainer(event.target);
    appendSelectedUserMessages(event.target);
    sendReadMarkToStorage(event.target);
  }

  function isUserOnline(user) {
    var lastMessage;
    var lastMessageTime;
    var lastMessageDate;
    var messagesKeys;

    if (!user.messages) {
      return false;
    }
    messagesKeys = Object.keys(user.messages);
    lastMessage = user.messages[messagesKeys.pop()];
    while (
      lastMessage &&
      lastMessage.sender === config.operatorName.concat(":")
    ) {
      lastMessage = user.messages[messagesKeys.pop()];
    }
    if (!lastMessage) {
      return false;
    }
    lastMessageTime = lastMessage.time.split(":");
    lastMessageDate = new Date(
      new Date().getFullYear(),
      Number(lastMessage.month),
      Number(lastMessage.day),
      Number(lastMessageTime.shift()),
      Number(lastMessageTime.shift())
    );

    return new Date() - lastMessageDate <= USER_ONLINE_TIMEOUT;
  }

  function setUserStatus(statusContainer, classToRemove, classToAdd) {
    DM.removeCSSClass(statusContainer, classToRemove);
    DM.addCSSClass(statusContainer, classToAdd);
  }

  function appendSingleUser(user, generated) {
    var userElement = DM.createDOMElement("div");
    var userNameElement = DM.createDOMElement("label");
    var generatedField = DM.createDOMElement("label");
    var chatStateElement = DM.createDOMElement("label");
    var userStatusElement = DM.createDOMElement("div");

    DM.addCSSClass(userElement, SINGLE_USER_CLASS_NAME);
    if (!user.read) {
      DM.addCSSClass(userElement, UNREAD_CLASS_NAME);
    }
    userNameElement.innerHTML =
      user.userName === undefined || user.userName === DEFAULT_USERNAME
        ? generated
        : user.userName;
    generatedField.innerHTML = generated;
    generatedField.hidden = true;
    DM.addCSSClass(userStatusElement, "dashboard-user-status");
    if (isUserOnline(user)) {
      setUserStatus(userStatusElement, ONLINE_CLASS_NAME, ONLINE_CLASS_NAME);
    } else {
      setUserStatus(userStatusElement, OFFLINE_CLASS_NAME, OFFLINE_CLASS_NAME);
    }
    chatStateElement.innerHTML = user.chatState;

    DM.appendDOMElement(userElement, userNameElement);
    DM.appendDOMElement(userElement, generatedField);
    DM.appendDOMElement(userElement, userStatusElement);
    DM.appendDOMElement(userElement, chatStateElement);
    DM.addListener(USERS_LIST_CONTAINER_ID, "click", selectUser);
    DM.appendDOMElement(USERS_LIST_CONTAINER_ID, userElement);

    return userElement;
  }

  DashboardFactory.prototype.loadUsersList = function loadUsersList(users) {
    Object.keys(users).forEach(function appendUser(key) {
      appendSingleUser(users[key], key);
    });
  };

  function clearUsers(usersContainers) {
    var containers =
      usersContainers ||
      DM.getDOMChildrenByClass(USERS_LIST_CONTAINER_ID, SINGLE_USER_CLASS_NAME);

    containers.forEach(function clearUsersList(userContainer) {
      DM.removeDOMElement(USERS_LIST_CONTAINER_ID, userContainer);
    });

    return containers;
  }

  function filterUsers(event) {
    var filterValue = event.target.value.toLowerCase();
    var usersContainers = DM.getDOMChildrenByClass(
      USERS_LIST_CONTAINER_ID,
      SINGLE_USER_CLASS_NAME
    );

    if (filterValue === "") {
      clearUsers(usersContainers);
      dashboardFactory.loadUsersList(usersData);
      return;
    }
    usersContainers.forEach(function filter(userContainer) {
      if (
        DM.getDOMChildrenByTag(userContainer, "label")
          .shift()
          .innerHTML.toLowerCase()
          .indexOf(filterValue) === -1
      ) {
        DM.removeDOMElement(USERS_LIST_CONTAINER_ID, userContainer);
      }
    });
  }

  function sortUsersByUserName(container1, container2) {
    return DM.getDOMChildrenByTag(container1, "label")
      .shift()
      .innerHTML.toLowerCase() <
      DM.getDOMChildrenByTag(container2, "label")
        .shift()
        .innerHTML.toLowerCase()
      ? LESS
      : MORE;
  }

  function sortUsersByOnlineStatus(container) {
    return DM.getDOMChildrenByTag(container, "div")
      .shift()
      .classList.contains(ONLINE_CLASS_NAME)
      ? LESS
      : MORE;
  }

  function sortUsersByChatState(container) {
    return DM.getDOMChildrenByTag(container, "label").pop().innerHTML ===
      "chat-expanded"
      ? LESS
      : MORE;
  }

  function sortUsersByUnread(container) {
    return container.classList.contains(UNREAD_CLASS_NAME) ? LESS : MORE;
  }

  function sortUsers(event) {
    var selected = DM.getDOMChildrenByTag(event.target, "option").find(
      function getSelected(option) {
        return option.selected;
      }
    );
    var containers = clearUsers();

    function sortByAndAppend(sortFunc) {
      containers.sort(sortFunc);
      containers.forEach(function appendContainers(container) {
        DM.appendDOMElement(USERS_LIST_CONTAINER_ID, container);
      });
    }
    switch (selected.innerHTML) {
      case "User Name":
        sortByAndAppend(sortUsersByUserName);
        break;
      case "Online":
        sortByAndAppend(sortUsersByOnlineStatus);
        break;
      case "Chat state":
        sortByAndAppend(sortUsersByChatState);
        break;
      case "Unread":
        sortByAndAppend(sortUsersByUnread);
        break;
      default:
        dashboardFactory.loadUsersList(usersData);
    }
  }

  function clearFilter(event) {
    event.target.value = "";
    clearUsers();
    dashboardFactory.loadUsersList(usersData);
  }

  DashboardFactory.prototype.initListeners = function initListeners() {
    DM.addListener(
      "operators-dashboard-users-filter-bar",
      "change",
      filterUsers
    );
    DM.addListener(
      "operators-dashboard-users-filter-bar",
      "focus",
      clearFilter
    );
    DM.addListener("operators-dashboard-users-sort-bar", "change", sortUsers);
  };

  function getUser(key) {
    if (!usersData[key]) {
      usersData[key] = {
        chatState: "chat-collapsed",
        read: "true"
      };
    }

    return usersData[key];
  }

  function getUserContainer(userKey, user) {
    var userContainer;

    userContainer = DM.getDOMChildrenByClass(
      USERS_LIST_CONTAINER_ID,
      SINGLE_USER_CLASS_NAME
    ).find(function findContainer(container) {
      return getUserID(container) === userKey;
    });
    if (!userContainer) {
      userContainer = appendSingleUser(user, userKey);
    }

    return userContainer;
  }

  function manageUserOnline(key) {
    var userStatusElement = DM.getDOMChildrenByTag(
      getUserContainer(key, usersData[key]),
      "div"
    ).shift();
    setUserStatus(userStatusElement, OFFLINE_CLASS_NAME, ONLINE_CLASS_NAME);
    setTimeout(
      setUserStatus.bind(
        this,
        userStatusElement,
        ONLINE_CLASS_NAME,
        OFFLINE_CLASS_NAME
      ),
      USER_ONLINE_TIMEOUT
    );
  }

  function updateUserReadStatus(key, value) {
    var container = getUserContainer(key, getUser(key));

    usersData[key].read = value;
    if (value) {
      DM.removeCSSClass(container, UNREAD_CLASS_NAME);
    } else {
      DM.addCSSClass(container, UNREAD_CLASS_NAME);
    }
  }

  function updateUserChatState(key, value) {
    var container = getUserContainer(key, getUser(key));

    usersData[key].chatState = value;
    DM.getDOMChildrenByTag(container, "label").pop().innerHTML = value;
  }

  function updateUserMessages(key, message, messageKey) {
    if (!usersData[key].messages) {
      usersData[key].messages = {};
    }
    usersData[key].messages[messageKey] = message;
    if (!DM.getDOMElement(SELECTED_USER_INNER_ID)) {
      return;
    }
    if (getUserID(SELECTED_USER_INNER_ID) === key) {
      sendReadMarkToStorage(getUserContainer(key, usersData[key]));
      appendSingleMessage(message);
    }
  }

  function updateUserName(key, name) {
    var container = getUserContainer(key, getUser(key));

    usersData[key].userName = name;
    DM.getDOMChildrenByTag(container, "label").shift().innerHTML = name;
  }

  function updateCommands(key, commandResult, commandKey) {
    var userCommands = usersData[key].commands;

    userCommands[commandKey].result = commandResult;
    if (!DM.getDOMElement(SELECTED_USER_INNER_ID)) {
      return;
    }
    if (getUserID(SELECTED_USER_INNER_ID) !== key) {
      return;
    }
    appendSingleCommand(
      DM.getDOMElement(LOG_PANEL_ID),
      userCommands[commandKey]
    );
  }

  function saveEmptyCommand(userKey, commandKey, userCommand) {
    var user = usersData[userKey];

    if (!user.commands) {
      user.commands = {};
    }
    user.commands[commandKey] = userCommand;
  }

  function applyUpdates(event) {
    var pathFragments = event.data.path.split("/").slice(1);
    var fragment = pathFragments.shift();
    var commandKey;
    var data = event.data.data;
    var isUpdateFromUser = true;

    if (fragment === "") {
      dashboardFactory.loadUsersList(data);
      usersData = data;
    } else if (fragment.match(/user\d{13,}/)) {
      switch (pathFragments.shift()) {
        case "read":
          if (data === true) {
            isUpdateFromUser = false;
          }
          updateUserReadStatus(fragment, data);
          break;
        case "chatState":
          updateUserChatState(fragment, data);
          break;
        case "messages":
          if (data.sender.indexOf(config.operatorName) !== -1) {
            isUpdateFromUser = false;
          }
          updateUserMessages(fragment, data, pathFragments.shift());
          break;
        case "userName":
          updateUserName(fragment, data);
          break;
        case "commands":
          commandKey = pathFragments.pop();
          if (commandKey !== "result") {
            saveEmptyCommand(fragment, commandKey, data);
            isUpdateFromUser = false;
            return;
          }
          isUpdateFromUser = true;
          updateCommands(fragment, data, pathFragments.shift());
          break;
        default:
      }
      if (isUpdateFromUser) {
        manageUserOnline(fragment);
      }
    }
  }

  DashboardFactory.prototype.subscribeOnUpdates = function subscribeOnUpdates() {
    window.addEventListener("message", applyUpdates, false);
    updatesManager.getDataFromStorage("");
  };

  return new DashboardFactory();
})(config);
