var touchsoftChat;


var messageHistoryStorage;
var MINIMIZED_CLASS = 'minimized';
var MAXIMIZED_CLASS = 'maximized';




function Message(time, userName, text) {
  this.time = time;
  this.userName = userName;
  this.text = text;
}

Message.prototype.getFullMessage = function getFullMessage() {
  return this.time + ' ' + this.userName + ': ' + this.text;
};

function MessageHistoryStorage(storage) {
  this.array = storage !== null ? JSON.parse(storage) : new Array(0);
}

MessageHistoryStorage.prototype.push = function pushMessage(message) {
  this.array.push(message);
  localStorage.setItem('messageHistory', JSON.stringify(this.array));
};

function createChatElement(type, classes, parent) {
  var element = document.createElement(type);
  if (typeof(classes) === 'string') {
    element.classList.add(classes)
  } else {
    classes.forEach(function divideCssClasses(cssClass) {element.classList.add(cssClass);})
  }
  parent.appendChild(element);
  return element;
}

function TsChat(newConfig) {
  var self = this;
  var sendButton;
  var chatInput;
  var inputPanel;
  var messageListPanel;
  var chatHeader;
  var minimizeButton;
  var chatNameContainer;
  var DEFAULT_USERNAME = 'user';
  var username = DEFAULT_USERNAME;
  var bodyMinimizationClass;

  this.config = newConfig || {
    botName: 'bot',
    isMinimized: true,
    title: 'Chat Name',
    cssStyle: 'chat.css',
    allowDrag: false,
    allowMinimize: true,
    requestUserName: false,
    showTime: true,
    requestType: 'fetch',
    ApiUrl: ''
  };

  this.chatDiv = createChatElement('div', 'touchsoft-chatDiv', document.body)
  this.loadCss();
  this.config.isMinimized = JSON.parse(localStorage.isTsChatMinimized);

  chatHeader = createChatElement('div', 'touchsoft-chatHeader', this.chatDiv);
  minimizeButton = createChatElement('button', 'minimizeButton', chatHeader);
  chatNameContainer = createChatElement('span', 'touchsoft-chatNameContainer', chatHeader);
  minimizeButton.innerText = '-';
  chatNameContainer.innerText = this.config.title;
  minimizeButton.addEventListener('click', function minimizeClicked() { self.toggleMinimization() });

  bodyMinimizationClass = (this.config.isMinimized) ? MINIMIZED_CLASS : MAXIMIZED_CLASS;
  this.body = createChatElement('div', ['touchsoft-chatBody', bodyMinimizationClass], this.chatDiv);
  messageListPanel = createChatElement('div', 'touchsoft-messageListDiv', this.body);
  inputPanel = createChatElement('div', 'touchsoft-inputDiv', this.body);
  this.messageList = createChatElement('ul', 'touchsoft-messageList', messageListPanel);
  chatInput = createChatElement('textarea', 'touchsoft-chatInput', inputPanel);
  sendButton = createChatElement('button', 'touchsoft-sendButton', inputPanel);
  sendButton.innerText = 'Send';   
  this.body.setAttribute('id', 'touchsoft-chatBody');

  sendButton.onclick = function sendClicked() {
    var messageText = chatInput.value;
    var botAnswerDelay = 15000;
    chatInput.value = '';
    self.postChatMessage(messageText, username);
    setTimeout(function reply() {
      self.postChatMessage(
        'Answer to message ' + messageText.toUpperCase(),
        self.config.botName
      );
    }, botAnswerDelay);
  };

  messageHistoryStorage = new MessageHistoryStorage(
    localStorage.getItem('messageHistory')
  );  
}

TsChat.prototype.addMessage =  function addMessageToList(fullMessage) {
  var listElement = document.createElement('li');
  listElement.innerText = fullMessage;
  this.messageList.appendChild(listElement);
  listElement.scrollIntoView();
}

TsChat.prototype.loadCss = function loadCss() {
  var head = document.getElementsByTagName('head')[0];
  var cssFile = createChatElement('link', 'touchsoft-chatStyle', head);
  cssFile.setAttribute('id', 'chatCss');
  cssFile.setAttribute('rel', 'stylesheet');
  cssFile.setAttribute('type', 'text/css');
  cssFile.setAttribute('href', this.config.cssStyle);
}

TsChat.prototype.toggleMinimization = function toggleMinimization() {
    var currentState;
    var newState;
    if (this.config.isMinimized) {
      currentState = MINIMIZED_CLASS;
      newState = MAXIMIZED_CLASS;
    } else {
      currentState = MAXIMIZED_CLASS;
      newState = MINIMIZED_CLASS;
    }
    document.getElementById('touchsoft-chatBody').classList.replace(currentState, newState);
    this.config.isMinimized = !this.config.isMinimized;
    localStorage.setItem('isTsChatMinimized', this.config.isMinimized);
}

TsChat.prototype.loadMessageHistory = function loadMessageHistory() {
  var chat = this;
  messageHistoryStorage.array.forEach(function loadMessage(message) {
    chat.addMessage(
      new Message(
        message.time,
        message.userName,
        message.text
      ).getFullMessage()
    );
  });
}

TsChat.prototype.postChatMessage = function postChatMessage(message, username) {
  var currentDate = new Date();
  var messageTime = currentDate.toLocaleTimeString().substr(0, 5);
  var newMessage = new Message(messageTime, username, message);
  messageHistoryStorage.push(newMessage);
  this.addMessage(newMessage.getFullMessage());
}

window.onload = function loadChat(){
  touchsoftChat = new TsChat();
  touchsoftChat.loadMessageHistory()
};
