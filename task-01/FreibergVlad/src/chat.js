var isActive;
var frame;
var minBtn;
var sendBtn;
var msgInput;
var msgLog;
var RESPONSE_INTERVAL = 15000;
var PATH_TO_CSS =
  'https://rawgit.com/FreibergVlad/js--touchsoft/master/task-01/FreibergVlad/src/main.css';

function maximizeChat() {
  document.getElementById('chat-content').classList.remove('hidden');
}

function minimizeChat() {
  document.getElementById('chat-content').classList.add('hidden');
}

function getDate() {
  return new Date().toLocaleTimeString().substr(0, 5);
}

function scrollDown() {
  if (msgLog) msgLog.scrollTop = msgLog.scrollHeight;
}

function minBtnOnClick() {
  isActive ? minimizeChat() : maximizeChat();
  isActive = !isActive;
  localStorage.isActive = isActive;
}

function loadCss(path) {
  var link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', path);
  document.head.appendChild(link);
}

function appendMessage(message) {
  var li = document.createElement('li');
  var text = document.createTextNode(
    message.date + ' ' + message.sender + ': ' + message.content
  );
  li.appendChild(text);
  msgLog.appendChild(li);
  scrollDown();
}

function loadDataFromLocalStorage() {
  if (localStorage.messages) {
    var messages = JSON.parse(localStorage.messages);
    for (var i = 0; i < messages.length; i++) appendMessage(messages[i]);
  } else localStorage.messages = JSON.stringify([]);
  isActive = localStorage.isActive === 'true';
}

function pushMessageToLocalStorage(message) {
  var messages = JSON.parse(localStorage.messages);
  messages.push(message);
  localStorage.messages = JSON.stringify(messages);
}

function sendBtnOnClick() {
  if (msgInput && msgLog && msgInput.value !== '') {
    var message = { date: getDate(), sender: 'You', content: msgInput.value };
    appendMessage(message);
    pushMessageToLocalStorage(message);
    msgInput.value = '';
    setTimeout(function() {
      var reply = {
        date: getDate(),
        sender: 'Bot',
        content:
          ' Response to the: "' + message.content.toLocaleUpperCase() + '"'
      };
      appendMessage(reply);
      pushMessageToLocalStorage(reply);
    }, RESPONSE_INTERVAL);
    return message;
  }
}

function createChatFrame() {
  frame = document.createElement('div');
  frame.classList.add('chat-panel');
  frame.innerHTML =
    "<div id='chat-header'>" +
    "<span id='minBtn'>-</span>" +
    '</div>' +
    "<div id='chat-content' class=''>" +
    "<ul id='messages'>" +
    '</ul>' +
    "<div id='chat-message'>" +
    "<div id='current-message'>" +
    "<textarea id='msgInput'></textarea>" +
    '</div>' +
    "<div id='send-message'>" +
    "<button id='sendBtn' type='submit'>Send</button>" +
    '</div>' +
    '</div>' +
    '</div>';

  document.body.appendChild(frame);

  sendBtn = document.getElementById('sendBtn');
  minBtn = document.getElementById('minBtn');
  msgInput = document.getElementById('msgInput');
  msgLog = document.getElementById('messages');

  sendBtn.addEventListener('click', sendBtnOnClick);
  minBtn.addEventListener('click', minBtnOnClick);
}

window.onload = function() {
  loadCss(PATH_TO_CSS);
  createChatFrame();
  loadDataFromLocalStorage();
  isActive ? maximizeChat() : minimizeChat();
};