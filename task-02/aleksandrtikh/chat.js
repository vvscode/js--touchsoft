var isChatLoaded = false;
var CSS_PATH = 'chat.css';
var MINIMIZED_CLASS = 'minimized';
var MAXIMIZED_CLASS = 'maximized';
var DEFAULT_USERNAME = 'user';
var USERS_PATH = '/users';
var MESSAGES_PATH = '/messages';
var DOT_JSON = '.json';
var messageSyncInterval = 15000;
var touchsoftChat;

function Message(time, userName, text) {
  this.time = time;
  this.userName = userName;
  this.text = text;
}

Message.prototype.getFullMessage = function getFullMessage(showTime) {
  var time = showTime ? this.time + ' ' : '';
  return time + this.userName + ': ' + this.text;
};

function createChatElement(type, classes, parent) {
  var element = document.createElement(type);
  if (typeof classes === 'string') {
    element.classList.add(classes);
  } else {
    classes.forEach(function divideCssClasses(cssClass) {
      element.classList.add(cssClass);
    });
  }
  parent.appendChild(element);
  return element;
}

function FetchSender() {}

function XhrSender() {}

FetchSender.prototype.sendRequest = function sendFetchRequest(
  url,
  requestMethod,
  data
) {
  return fetch(url, {
    method: requestMethod,
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(res) {
      return res;
    });
};

XhrSender.prototype.sendRequest = function sendXhrRequest(url, type, data) {
  var request = new XMLHttpRequest();
  return new Promise(function makeRequest(resolve) {
    request.open(type, url);
    request.addEventListener('readystatechange', function xhrStateChanged() {
      if (this.readyState !== 4) return;
      if (this.status === 200) resolve(JSON.parse(this.responseText));
    });
    request.send(JSON.stringify(data));
  }).then(function(res) {
    return res;
  });
};

function TsChat(newConfig) {
  var self = this;
  var sendButton;
  var chatInput;
  var inputPanel;
  var messageListPanel;
  var chatHeader;
  var minimizeButton;
  var chatNameContainer;

  var requestTypes = {
    fetch: new FetchSender(),
    XHR: new XhrSender()
  };

  var defaultConfig = {
    title: 'Chat Name',
    botName: 'bot',
    chatUrl: 'https://touchsoft-chat-aleksandrtikh.firebaseio.com',
    cssClass: 'chat.css',
    position: 'right',
    allowMinimize: true,
    allowDrag: true,
    showTime: true,
    requireName: false,
    requestType: 'XHR'
  };

  this.config = newConfig || defaultConfig;
  this.requestMaker = requestTypes[this.config.requestType];

  this.chatDiv = createChatElement(
    'div',
    ['chatDiv', 'touchsoft-chat', this.config.position],
    document.body
  );
  this.loadCss();
  this.config.isMinimized = JSON.parse(localStorage.isTsChatMinimized);

  chatHeader = createChatElement('div', 'chatHeader', this.chatDiv);
  minimizeButton = createChatElement('button', 'minimizeButton', chatHeader);
  chatNameContainer = createChatElement(
    'span',
    'chatNameContainer',
    chatHeader
  );
  minimizeButton.innerText = '-';
  chatNameContainer.innerText = this.config.title;
  minimizeButton.addEventListener('click', function minimizeClicked() {
    self.toggleMinimization();
  });

  this.body = createChatElement('div', 'chatBody', this.chatDiv);
  messageListPanel = createChatElement('div', 'messageListDiv', this.body);
  inputPanel = createChatElement('div', 'inputDiv', this.body);
  this.messageList = createChatElement('ul', 'messageList', messageListPanel);
  chatInput = createChatElement('textarea', 'chatInput', inputPanel);
  sendButton = createChatElement('button', 'sendButton', inputPanel);
  sendButton.innerText = 'Send';
  this.body.setAttribute('id', 'touchsoft-chatBody');

  self.isDragged = false;
  chatHeader.addEventListener('mousedown', function startDrag() {
    self.isDragged = true;
    console.log('start');
  });
  document.addEventListener('mousemove', function dragMove(event) {
    var mouseDiffX;
    var mouseDiffY;
    console.log(self.isDragged + ' ' + self.config.allowDrag);
    if (!(self.isDragged && self.config.allowDrag)) return;
    mouseDiffX = self.chatDiv.offsetLeft - event.clientX;
    mouseDiffY = self.chatDiv.offsetTop - event.clientY;
    console.log(self.chatDiv.offsetLeft + ' ' + self.chatDiv.offsetTop);
    self.chatDiv.style.position = 'absolute';
    self.chatDiv.style.left += 1; // event.movementX + mouseDiffX;
    self.chatDiv.style.top += -1; // event.movementY + mouseDiffY;
    self.chatDiv.style.position = 'fixed';
    console.log(self.chatDiv.offsetLeft + ' ' + self.chatDiv.offsetTop);
    console.log('moved');
  });
  chatHeader.addEventListener('mouseup', function finishDrag() {
    self.isDragged = false;
    console.log('finished');
  });

  sendButton.onclick = function sendClicked() {
    var messageText = chatInput.value;
    var botAnswerDelay = 15000;
    var username = self.userInfo.userName;
    chatInput.value = '';
    self.postChatMessage(messageText, username);
    setTimeout(function reply() {
      self.postChatMessage(
        'Answer to message ' + messageText.toUpperCase(),
        self.config.botName
      );
    }, botAnswerDelay);
  };

  this.requestMaker
    .sendRequest(this.config.chatUrl + USERS_PATH + DOT_JSON, 'GET')
    .then(function(res) {
      console.log('before login ' + res);
      self.logIn(res);
    });
    setInterval(this.updateMessages, messageSyncInterval);
}

TsChat.prototype.addMessage = function addMessageToList(fullMessage) {
  var listElement = document.createElement('li');
  listElement.innerText = fullMessage;
  this.messageList.appendChild(listElement);
  listElement.scrollIntoView();
};

TsChat.prototype.loadCss = function loadCss() {
  var head = document.getElementsByTagName('head')[0];
  var cssFile = createChatElement('link', 'touchsoft-chatStyle', head);
  cssFile.setAttribute('id', 'chatCss');
  cssFile.setAttribute('rel', 'stylesheet');
  cssFile.setAttribute('type', 'text/css');
  cssFile.setAttribute('href', CSS_PATH);
};

TsChat.prototype.toggleMinimization = function toggleMinimization() {
  var currentState;
  var newState;
  if (this.userInfo.isMinimized) {
    currentState = MINIMIZED_CLASS;
    newState = MAXIMIZED_CLASS;
  } else {
    currentState = MAXIMIZED_CLASS;
    newState = MINIMIZED_CLASS;
  }
  document
    .getElementById('touchsoft-chatBody')
    .classList.replace(currentState, newState);
  this.userInfo.isMinimized = !this.userInfo.isMinimized;
  this.requestMaker.sendRequest(
    this.config.chatUrl + USERS_PATH + '/' + this.userId + DOT_JSON,
    'PATCH',
    { isMinimized: this.userInfo.isMinimized }
  );
};

TsChat.prototype.loadMessageHistory = function loadMessageHistory() {
  var chat = this;
  chat.requestMaker
    .sendRequest(
      chat.config.chatUrl + MESSAGES_PATH + '/' + chat.userId + DOT_JSON,
      'GET'
    )
    .then(function (messages) {
      chat.messages = messages;
      console.log(chat.messages);
      if (chat.messages)
        Object.values(chat.messages).forEach(function postMessage(message) {
          chat.addMessage(
            Message.prototype.getFullMessage.call(message, chat.config.showTime)
          );
        });
    });
};

TsChat.prototype.postChatMessage = function postChatMessage(message) {
  var currentDate = new Date();
  var username = this.userInfo.userName;
  var messageTime = currentDate.toLocaleTimeString().substr(0, 5);
  var newMessage = new Message(messageTime, username, message);
  this.requestMaker.sendRequest(
    this.config.chatUrl + MESSAGES_PATH + '/' + this.userId + DOT_JSON,
    'POST',
    newMessage
  );
  this.addMessage(newMessage.getFullMessage(this.config.showTime));
};

TsChat.prototype.logIn = function logIn(users) {
  var bodyMinimizationClass;
  var chat = this;
  var LOCAL_STORAGE_ID_FIELD = 'touchsoftChatUserId';
  chat.userId = localStorage.getItem(LOCAL_STORAGE_ID_FIELD);
  console.log(users);
  if (chat.userId in users) {
    chat.userInfo = users[chat.userId];
  } else {
    chat.userInfo = {
      userName: DEFAULT_USERNAME,
      messages: null,
      isMinimized: true,
      unreadMessages: null,
      isOnline: true
    };
    chat.requestMaker
      .sendRequest(
        chat.config.chatUrl + USERS_PATH + DOT_JSON,
        'POST',
        chat.userInfo
      )
      .then(function(res) {
        chat.userId = res.name;
        localStorage.setItem(LOCAL_STORAGE_ID_FIELD, chat.userId);
      });
  }
  chat.loadMessageHistory();
  bodyMinimizationClass = chat.userInfo.isMinimized
    ? MINIMIZED_CLASS
    : MAXIMIZED_CLASS;
  chat.body.classList.add(bodyMinimizationClass);
};

TsChat.prototype.updateMessages = function updateMessages() {
  var chat = this.touchsoftChat; // The scope is lost I don't know why.
  chat.requestMaker
    .sendRequest(
      chat.config.chatUrl + MESSAGES_PATH + '/' + chat.userId + DOT_JSON,
      'GET'
    )
    .then(function(messages) {
      console.log(messages);
      Object.keys(messages).forEach(function(message) {
        if (!Object.keys(chat.messages).includes(message)) {
          chat.addMessage(
            Message.prototype.getFullMessage.call(messages[message], chat.config.showTime)
          );
        }
      });
    });
};

function loadChat() {
  if (!isChatLoaded) {
    touchsoftChat = new TsChat();
  }
  
}

window.addEventListener('load', loadChat);
