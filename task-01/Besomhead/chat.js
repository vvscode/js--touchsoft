var COLLAPSED = "collapsed";
var EXPANDED = "expanded";
var CHAT_ITEM = "chat";
var MESSAGES_LIST = "messages";
var INPUT_BOX = "input-box";
var INPUT_TEXT = "input-txt";
var TOGGLE_BUTTON = "toggle-button";
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

function getCurrentTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();

  return (
    (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes
  );
}

function Message(date, sender, body) {
  this.day = date.getDate();
  this.month = date.getMonth();
  this.time = getCurrentTime(date);
  this.sender = sender;
  this.body = body;
}

function UnexpectedValueException(key, value) {
  this.value = value;
  this.key = key;
  this.message = "Unexpected key/value pair";
}

function setChatState(state) {
  localStorage.setItem(CHAT_ITEM, state);
}

function collapseChat() {
  document.getElementById(CHAT_ITEM).classList.remove(EXPANDED);
  document.getElementById(CHAT_ITEM).classList.add(COLLAPSED);
  setChatState(COLLAPSED);
  document.getElementById(TOGGLE_BUTTON).innerHTML = EXPAND_MARK;
  document
    .getElementById(CHAT_ITEM)
    .removeChild(document.getElementById(MESSAGES_LIST));
  document
    .getElementById(CHAT_ITEM)
    .removeChild(document.getElementById(INPUT_BOX));
}

function appendMessagePart(container, innerHTML) {
  var el = document.createElement("div");

  el.innerHTML = innerHTML;
  container.appendChild(el);
}

function appendSingleMessage(container, message) {
  var containerId;
  var messagesContainer;
  var dayOfMonth;

  containerId = message.day + "-" + message.month;
  if (document.getElementById(containerId) === null) {
    messagesContainer = document.createElement("div");
    messagesContainer.id = containerId;
    messagesContainer.className = "messages-container";
    dayOfMonth = document.createElement("legend");
    dayOfMonth.innerHTML = message.day + " " + months[+message.month];
    dayOfMonth.className = "day-of-month";
    container.appendChild(dayOfMonth);
    container.appendChild(messagesContainer);
  }
  messagesContainer = document.getElementById(containerId);
  appendMessagePart(messagesContainer, message.time);
  appendMessagePart(messagesContainer, message.sender);
  appendMessagePart(messagesContainer, message.body);
}

function appendMessages(container) {
  var messages = localStorage.getItem(MESSAGES_LIST);
  var messageIndex;

  if (messages !== null) {
    messages = JSON.parse(messages);
    for (messageIndex = 0; messageIndex < messages.length; messageIndex += 1) {
      appendSingleMessage(container, messages[messageIndex]);
    }
  }
}

function appendMessagesList() {
  var messagesListContainer = document.createElement("div");

  messagesListContainer.id = MESSAGES_LIST;
  messagesListContainer.className = "messages-external";
  document.getElementById(CHAT_ITEM).appendChild(messagesListContainer);
  appendMessages(messagesListContainer);
}

function saveMessageToLocalStorage(message) {
  var messagesArray = localStorage.getItem(MESSAGES_LIST);

  if (messagesArray !== null) {
    messagesArray = JSON.parse(messagesArray);
  } else {
    messagesArray = [];
  }
  messagesArray.push(message);
  localStorage.setItem(MESSAGES_LIST, JSON.stringify(messagesArray));
}

function sendReply(message) {
  var reply = new Message(
    new Date(),
    "Бот:",
    "Ответ на " + JSON.stringify(message).toUpperCase()
  );
  appendSingleMessage(document.getElementById(MESSAGES_LIST), reply);
  saveMessageToLocalStorage(reply);
}

function sendMessage() {
  var inputTextArea = document.getElementById(INPUT_TEXT);
  var message;

  if (inputTextArea.value !== "") {
    message = new Message(new Date(), "Вы:", inputTextArea.value);
    inputTextArea.value = "";
    appendSingleMessage(document.getElementById(MESSAGES_LIST), message);
    saveMessageToLocalStorage(message);
    setTimeout(sendReply, 15000, message.body);
  }
}

function appendInputBox() {
  var inputMessageContainer = document.createElement("div");
  var inputTextArea = document.createElement("textarea");
  var messageButton = document.createElement("button");

  inputMessageContainer.id = INPUT_BOX;
  inputMessageContainer.className = "input-container";
  inputTextArea.id = INPUT_TEXT;
  inputTextArea.className = "input-textarea";
  inputMessageContainer.appendChild(inputTextArea);
  messageButton.className = "message-button";
  messageButton.innerHTML = "Отправить";
  messageButton.onclick = sendMessage;
  inputMessageContainer.appendChild(messageButton);
  document.getElementById(CHAT_ITEM).appendChild(inputMessageContainer);
}

function initChatState() {
  var chatState = localStorage.getItem(CHAT_ITEM);

  document.getElementById(TOGGLE_BUTTON).innerHTML = EXPAND_MARK;
  if (chatState === null) {
    setChatState(COLLAPSED);
  } else if (chatState === EXPANDED) {
    appendMessagesList();
    appendInputBox();
    document.getElementById(TOGGLE_BUTTON).innerHTML = COLLAPSE_MARK;
  }
  document
    .getElementById(CHAT_ITEM)
    .classList.add(localStorage.getItem(CHAT_ITEM));
}

function expandChat() {
  document.getElementById(CHAT_ITEM).classList.remove(COLLAPSED);
  document.getElementById(CHAT_ITEM).classList.add(EXPANDED);
  setChatState(EXPANDED);
  document.getElementById(TOGGLE_BUTTON).innerHTML = COLLAPSE_MARK;
  appendMessagesList();
  appendInputBox();
}

function changeChatState() {
  var chatState = localStorage.getItem(CHAT_ITEM);

  switch (chatState) {
    case COLLAPSED:
      expandChat();
      break;
    case EXPANDED:
      collapseChat();
      break;
    default:
      throw new UnexpectedValueException(CHAT_ITEM, chatState);
  }
}

function appendStylesheet() {
  var styleElement = document.createElement("link");

  styleElement.rel = "stylesheet";
  styleElement.type = "text/css";
  styleElement.href = "chat_styles.css";
  document.head.appendChild(styleElement);
}

function createChatMarkup() {
  var container = document.createElement("fieldset");
  var legend = document.createElement("legend");
  var toggleButtonContainer = document.createElement("div");
  var toggleButton = document.createElement("button");

  container.id = CHAT_ITEM;
  container.className = "chat-container";
  legend.innerHTML = "Чат";
  legend.className = "legend";
  container.appendChild(legend);
  toggleButtonContainer.className = "toggle-button-container";
  toggleButton.className = TOGGLE_BUTTON;
  toggleButton.id = TOGGLE_BUTTON;
  toggleButton.onclick = changeChatState;
  toggleButtonContainer.appendChild(toggleButton);
  container.appendChild(toggleButtonContainer);
  document.body.appendChild(container);
  initChatState();
}

window.onload = function initPage() {
  appendStylesheet();
  createChatMarkup();
};
