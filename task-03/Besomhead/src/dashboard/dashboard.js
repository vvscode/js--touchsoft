var HTTP_GET = "GET";
var HTTP_POST = "POST";
var HTTP_PUT = "PUT";
var DEFAULT_USERNAME = "Вы";
var USER_ONLINE_TIMEOUT = 120000;
var REQUEST_INTERVAL = 15000;
var USERS_LIST_CONTAINER_ID = "operators-dashboard-users-list-container";
var SELECTED_USER_CONTAINER_ID = "operators-dashboard-selected-user-container";
var SELECTED_USER_INNER_ID = "operators-dashboard-selected-user-inner";
var USER_CHAT_MESSAGES_ID = "operators-dashboard-user-chat-messages";
var USER_CHAT_INPUT_ID = "operators-dashboard-user-chat-input";
var SINGLE_USER_CLASS_NAME = "dashboard-single-user-container";
var UNREAD_CLASS_NAME = "dashboard-single-user-container-unread";
var ONLINE_CLASS_NAME = "dashboard-user-status-online";
var OFFLINE_CLASS_NAME = "dashboard-user-status-offline";
var LESS = -1;
var MORE = 1;

var config = {
  operatorName: "Operator",
  storageURL: "https://besomhead-chat.firebaseio.com/"
};
var getDOMElement = function getElement(idtf) {
  return typeof idtf === "string" ? document.getElementById(idtf) : idtf;
};
var getDOMChildrenByTag = function getChildrenByTagName(root, tag) {
  return Array.from(getDOMElement(root).getElementsByTagName(tag));
};
var getDOMChildrenByClass = function getChildrenByClassName(root, className) {
  return Array.from(getDOMElement(root).getElementsByClassName(className));
};
var createDOMElement = document.createElement.bind(document);
var appendDOMElement = function append(root, element) {
  getDOMElement(root).appendChild(element);
};
var removeDOMElement = function remove(root, element) {
  getDOMElement(root).removeChild(getDOMElement(element));
};

function getCurrentTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();

  return (hours < 10 ? "0" : "")
    .concat(hours.toString())
    .concat(":")
    .concat(minutes < 10 ? "0" : "")
    .concat(minutes.toString());
}

function Message(date, sender, body) {
  this.day = date.getDate();
  this.month = date.getMonth();
  this.time = getCurrentTime(date);
  this.sender = sender;
  this.body = body;
}

function getStoragePath(extraPath) {
  return config.storageURL + extraPath + ".json";
}

function getRequestBody(method, data) {
  return method === HTTP_GET ? null : JSON.stringify(data);
}

function sendRequestToStorage(extraPath, method, data) {
  return fetch(getStoragePath(extraPath), {
    method: method,
    body: getRequestBody(method, data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(function getResponse(response) {
      return response.json();
    })
    .then(function getResponseData(responseData) {
      return responseData;
    });
}

function closeSelectedUserContainer() {
  removeDOMElement(SELECTED_USER_CONTAINER_ID, SELECTED_USER_INNER_ID);
}

function getUserID(userContainer) {
  return getDOMChildrenByTag(getDOMElement(userContainer), "label")
    .filter(function filterFields(field) {
      return field.hidden;
    })
    .shift().innerHTML;
}

function appendSingleMessage(message) {
  var messages = getDOMElement(USER_CHAT_MESSAGES_ID);
  var sender = createDOMElement("div");
  var body = createDOMElement("div");

  sender.innerHTML = message.sender;
  body.innerHTML = message.body;

  appendDOMElement(messages, sender);
  appendDOMElement(messages, body);
}

function sendMessage(userContainer) {
  var operatorMessage = new Message(
    new Date(),
    config.operatorName + ":",
    getDOMElement(USER_CHAT_INPUT_ID).value
  );
  appendSingleMessage(operatorMessage);
  getDOMElement(USER_CHAT_INPUT_ID).value = "";
  sendRequestToStorage(
    getUserID(userContainer) + "/messages",
    HTTP_POST,
    operatorMessage
  );
}

function createUserChatContainer(userContainer) {
  var userChatContainer = createDOMElement("fieldset");
  var userChatLegend = createDOMElement("legend");
  var userChatMessagesList = createDOMElement("div");
  var userChatMessageInput = createDOMElement("textarea");
  var userChatSendButton = createDOMElement("button");

  userChatContainer.className = "dashboard-selected-user-chat-container";
  userChatLegend.innerHTML = "Чат";
  userChatMessagesList.id = USER_CHAT_MESSAGES_ID;
  userChatMessagesList.className = "dashboard-selected-user-chat-messages";
  userChatMessageInput.id = USER_CHAT_INPUT_ID;
  userChatMessageInput.className = "dashboard-selected-user-chat-input";
  userChatMessageInput.placeholder = "Новое сообщение пользователю";
  userChatSendButton.className = "dashboard-selected-user-chat-button";
  userChatSendButton.innerHTML = "Send";
  userChatSendButton.addEventListener(
    "click",
    sendMessage.bind(null, userContainer)
  );

  appendDOMElement(userChatContainer, userChatLegend);
  appendDOMElement(userChatContainer, userChatMessagesList);
  appendDOMElement(userChatContainer, userChatMessageInput);
  appendDOMElement(userChatContainer, userChatSendButton);

  return userChatContainer;
}

function createUserControllerContainer() {
  var userControllerContainer = createDOMElement("fieldset");
  var userControllerLegend = createDOMElement("legend");

  userControllerContainer.className = "dashboard-selected-user-controller";
  userControllerLegend.innerHTML = "Control";
  appendDOMElement(userControllerContainer, userControllerLegend);

  return userControllerContainer;
}

function appendSelectedUserContainer(userContainer) {
  var selectedUserContainer = createDOMElement("fieldset");
  var userContainerLegend = createDOMElement("legend");
  var userContainerCloseButton = createDOMElement("button");
  var userIDField = createDOMElement("label");
  var userContainersInner = createDOMElement("div");

  selectedUserContainer.id = SELECTED_USER_INNER_ID;
  selectedUserContainer.className = "dashboard-selected-user-container-inner";
  userContainerLegend.innerHTML =
    "Active: " + getDOMChildrenByTag(userContainer, "label").shift().innerHTML;
  userContainerCloseButton.innerHTML = "x";
  userContainerCloseButton.className =
    "dashboard-selected-user-container-button";
  userContainerCloseButton.addEventListener(
    "click",
    closeSelectedUserContainer
  );
  userContainersInner.className = "dashboard-selected-user-controls-container";
  userIDField.innerHTML = getUserID(userContainer);
  userIDField.hidden = true;

  appendDOMElement(userContainersInner, createUserChatContainer(userContainer));
  appendDOMElement(userContainersInner, createUserControllerContainer());
  appendDOMElement(selectedUserContainer, userContainerLegend);
  appendDOMElement(selectedUserContainer, userContainerCloseButton);
  appendDOMElement(selectedUserContainer, userContainersInner);
  appendDOMElement(selectedUserContainer, userIDField);
  appendDOMElement(SELECTED_USER_CONTAINER_ID, selectedUserContainer);
}

function appendSelectedUserMessages(userContainer) {
  sendRequestToStorage(
    getUserID(userContainer) + "/messages",
    HTTP_GET,
    ""
  ).then(function appendMessages(data) {
    if (!data) {
      return;
    }
    Object.keys(data).forEach(function appendMessage(key) {
      appendSingleMessage(data[key]);
    });
  });
}

function sendReadMarkToStorage(userContainer) {
  sendRequestToStorage(getUserID(userContainer) + "/read", HTTP_PUT, true);
}

function selectUser(event) {
  if (!event.target.classList.contains(SINGLE_USER_CLASS_NAME)) {
    return;
  }
  if (getDOMElement(SELECTED_USER_INNER_ID)) {
    closeSelectedUserContainer();
  }
  event.target.classList.remove(UNREAD_CLASS_NAME);

  appendSelectedUserContainer(event.target);
  appendSelectedUserMessages(event.target);
  sendReadMarkToStorage(event.target);
}

function isUserOnline(user) {
  var lastMessage;
  var lastMessageTime;
  var lastMessageDate;

  if (!user.messages) {
    return false;
  }
  lastMessage = user.messages[Object.keys(user.messages).pop()];
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

function appendSingleUser(user, generated) {
  var userElement = createDOMElement("div");
  var userNameElement = createDOMElement("label");
  var generatedField = createDOMElement("label");
  var chatStateElement = createDOMElement("label");
  var userStatusElement = createDOMElement("div");

  userElement.className = SINGLE_USER_CLASS_NAME;
  if (!user.read) {
    userElement.classList.add(UNREAD_CLASS_NAME);
  }
  userNameElement.innerHTML =
    user.userName === undefined || user.userName === DEFAULT_USERNAME
      ? generated
      : user.userName;
  generatedField.innerHTML = generated;
  generatedField.hidden = true;
  userStatusElement.className = "dashboard-user-status";
  if (isUserOnline(user)) {
    userStatusElement.classList.add(ONLINE_CLASS_NAME);
  } else {
    userStatusElement.classList.add(OFFLINE_CLASS_NAME);
  }
  chatStateElement.innerHTML = user.chatState;

  appendDOMElement(userElement, userNameElement);
  appendDOMElement(userElement, generatedField);
  appendDOMElement(userElement, userStatusElement);
  appendDOMElement(userElement, chatStateElement);
  getDOMElement(USERS_LIST_CONTAINER_ID).addEventListener("click", selectUser);
  appendDOMElement(USERS_LIST_CONTAINER_ID, userElement);
}

function loadUsersList() {
  sendRequestToStorage("", HTTP_GET, "").then(function appendUsersToPage(data) {
    Object.keys(data).forEach(function appendUSer(key) {
      appendSingleUser(data[key], key);
    });
  });
}

function clearUsers(usersContainers) {
  var containers =
    usersContainers ||
    getDOMChildrenByClass(USERS_LIST_CONTAINER_ID, SINGLE_USER_CLASS_NAME);

  containers.forEach(function clearUsersList(userContainer) {
    removeDOMElement(USERS_LIST_CONTAINER_ID, userContainer);
  });

  return containers;
}

function filterUsers(event) {
  var filterValue = event.target.value.toLowerCase();
  var usersContainers = getDOMChildrenByClass(
    USERS_LIST_CONTAINER_ID,
    SINGLE_USER_CLASS_NAME
  );

  if (filterValue === "") {
    clearUsers(usersContainers);
    loadUsersList();
    return;
  }
  usersContainers.forEach(function filter(userContainer) {
    if (
      getDOMChildrenByTag(userContainer, "label")
        .shift()
        .innerHTML.toLowerCase()
        .indexOf(filterValue) === -1
    ) {
      removeDOMElement(USERS_LIST_CONTAINER_ID, userContainer);
    }
  });
}

function sortUsersByUserName(container1, container2) {
  return getDOMChildrenByTag(container1, "label")
    .shift()
    .innerHTML.toLowerCase() <
    getDOMChildrenByTag(container2, "label")
      .shift()
      .innerHTML.toLowerCase()
    ? LESS
    : MORE;
}

function sortUsersByOnlineStatus(container) {
  return getDOMChildrenByTag(container, "div")
    .shift()
    .classList.contains(ONLINE_CLASS_NAME)
    ? LESS
    : MORE;
}

function sortUsersByChatState(container) {
  return getDOMChildrenByTag(container, "label").pop().innerHTML ===
    "chat-expanded"
    ? LESS
    : MORE;
}

function sortUsersByUnread(container) {
  return container.classList.contains(UNREAD_CLASS_NAME) ? LESS : MORE;
}

function sortUsers(event) {
  var selected = getDOMChildrenByTag(event.target, "option").filter(
    function getSelected(option) {
      return option.selected;
    }
  );
  var containers = clearUsers();

  function sortByAndAppend(sortFunc) {
    containers.sort(sortFunc);
    containers.forEach(function appendContainers(container) {
      appendDOMElement(USERS_LIST_CONTAINER_ID, container);
    });
  }
  switch (selected.shift().innerHTML) {
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
      loadUsersList();
  }
}

function initListeners() {
  getDOMElement("operators-dashboard-users-filter-bar").addEventListener(
    "change",
    filterUsers
  );
  getDOMElement("operators-dashboard-users-sort-bar").addEventListener(
    "change",
    sortUsers
  );
}

function checkUpdates() {
  sendRequestToStorage("", HTTP_GET, "").then(function checkUsers(data) {
    if (!data) {
      return;
    }
    Object.keys(data).forEach(function checkUser(key) {
      var user = data[key];
      var userContainer = getDOMChildrenByClass(
        USERS_LIST_CONTAINER_ID,
        SINGLE_USER_CLASS_NAME
      ).filter(function filterContainers(container) {
        return getUserID(container) === key;
      });
      var userStatusElement = getDOMChildrenByTag(userContainer, "div").shift();
      var appendedMessagesAmount;

      if (isUserOnline(user)) {
        userStatusElement.classList.remove(OFFLINE_CLASS_NAME);
        userStatusElement.classList.add(ONLINE_CLASS_NAME);
      }
      getDOMChildrenByTag(userContainer, "label").pop().innerHTML =
        user.chatState;
      if (user.read) {
        return;
      }
      if (!getDOMChildrenByClass(SELECTED_USER_INNER_ID)) {
        userContainer.classList.add(UNREAD_CLASS_NAME);
        return;
      }
      if (getUserID(SELECTED_USER_INNER_ID) === key) {
        sendReadMarkToStorage(userContainer);
        appendedMessagesAmount =
          getDOMChildrenByTag(USER_CHAT_MESSAGES_ID, "div").length / 2;
        if (appendedMessagesAmount < user.messages.length) {
          Array.from(user.messages)
            .slice(appendedMessagesAmount - 1)
            .forEach(function appendUnread(message) {
              appendSingleMessage(message);
            });
        }
        return;
      }
      userContainer.classList.add(UNREAD_CLASS_NAME);
    });
  });
}

window.addEventListener("load", function initDashboard() {
  loadUsersList();
  initListeners();
  setInterval(checkUpdates, REQUEST_INTERVAL);
});
