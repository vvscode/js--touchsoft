var frame;
var sendButton;
var inputMessage;
var list;
var minimize;
var state;
var userName;
var nameBot;
var chatForm;
var configChat = {
    title: "TouchSoftSupport",
    botName: "Скрепка",
    chatUrl: "https://besomhead-chat.firebaseio.com/",
    cssClass: "chat-container",
    position: "Right",
    allowMinimize: "true",
    allowDrag: "false",
    showDateTime: "true",
    requireName: "false",
    requests: "fetch"
};

function scroll() {
    list.scrollTop = list.scrollHeight;
}


function minimizeChat() {
        if (!state) {
            state = true;
            document.getElementById('body').style.display = 'none';
            document.getElementById('form').style.height = '40px';
            localStorage.setItem('state', JSON.stringify(true));
        } else {
            state = false;
            document.getElementById('body').style.display = 'block';
            document.getElementById('form').style.height = '400px';
            localStorage.setItem('state', JSON.stringify(false));
            scroll();
        }
}



function minimizeOnClick() {
    minimizeChat();
}

function sendMessage(message, sender) {
    var li = document.createElement('li');
    var textMessage = getDateTime() + ' ' + sender + ': ' + message;
    li.appendChild(document.createTextNode(textMessage));
    list.appendChild(li);
    addMessageToLocalStorage(textMessage);
}

function sendButtonOnClick() {
    var message = inputMessage.value;
    if (message !== '' && message != null) {
        if (localStorage.getItem('userName')){
            sendMessage(message, userName);
            setTimeout(
                sendMessage,
                3000,
                '"' + message.toUpperCase() + '"',
                nameBot + ': Ответ на '
            );
            inputMessage.value = '';
            scroll();
        }
        else {
            userName = message;
            localStorage.setItem('userName', userName);
            sendMessage(userName, 'Name');
            inputMessage.value = '';
        }
    }
}

function createForm() {
  frame = document.createElement('div');
  frame.innerHTML =
    "<div class='touchSoft chatForm' id='form'>" +
    "<div class='chatHead'><button class='head-button' id='head-button'>-</button><span id='name-chat'> name </span></div>" +
    "<div class='chatBody' id='body'>" +
    '' +
    "<div class='messagesList'><ul id='list'><li></li></ul></div>" +
    "<div class='messageBoard'>" +
    "<div class='messageInput'><textarea id='input-message'></textarea><button id='send-button' >Send!</button></div></div>" +
    '</div>' +
    '</div>';

  document.body.appendChild(frame);

  sendButton = document.getElementById('send-button');
  inputMessage = document.getElementById('input-message');
  list = document.getElementById('list');
  minimize = document.getElementById('head-button');
  nameChat = document.getElementById('name-chat');
  chatForm = document.getElementById('form');

  sendButton.addEventListener('click', sendButtonOnClick);
  minimize.addEventListener('click', minimizeOnClick);

}

function loadCSS() {
  var head = document.getElementsByTagName('head')[0];
  var load = document.createElement('link');
  load.rel = 'stylesheet';
  load.href = 'css/app.css';
  load.href = 'css/app.css';
  head.appendChild(load);
}

function loadHistoryFromLocalStorage() {
  var messages;
  var li;
  var textMessage;
  if (localStorage) {
    if (localStorage.getItem('messages')) {
      messages = JSON.parse(localStorage.getItem('messages'));
      for (var i = 0; i < messages.length; i++) {
        li = document.createElement('li');
        textMessage = messages[i];
        li.appendChild(document.createTextNode(textMessage));
        list.appendChild(li);
        scroll();
      }
      scroll();
    } else {
      localStorage.setItem('messages', JSON.stringify([]));
    }
    state = localStorage.getItem('state') === 'false';
  }
}

function moveToPoint(element, x, y) {
    element.style.left = x + "px";
    element.style.top = y + "px";
    element.style.right = "auto";
    element.style.bottom = "auto";
}

function dragItem(event) {
    var left = this.getBoundingClientRect().left + pageXOffset;
    var top = this.getBoundingClientRect().top + pageYOffset;
    var shiftX = event.pageX - left;
    var shiftY = event.pageY - top;
    var element = this;
    var moveEventHandler = function (e) {
        moveToPoint(element, e.pageX - shiftX, e.pageY - shiftY);
    };

    window.document.addEventListener("mousemove", moveEventHandler);
    this.onmouseup = function () {
        window.document.removeEventListener("mousemove", moveEventHandler);
    }
}

function addMessageToLocalStorage(message) {
    var messages = JSON.parse(localStorage.getItem('messages'));
    messages.push(message);
    localStorage.setItem('messages', JSON.stringify(messages));
}

function renameChat() {                                                                  //-----------
    var chatTitle = configChat.title;
    nameChat.innerHTML = chatTitle;
}

function botRename(){                                                                      //-----------
    nameBot = configChat.botName;
}

function positionChat(){
    var chatForm = document.getElementsByClassName('chatForm')[0];
    chatForm.classList.add(configChat.position);
}

function allowToMinimize(){
    if (configChat.allowMinimize){
        minimize.setAttribute("disabled", "disabled");
    }
    else minimizeChat();

}

function allowToDrag() {
    if (configChat.allowDrag)
        chatForm.addEventListener("mousedown", dragItem);
}

function checkName(){
    if (!configChat.requireName) {
        if (!localStorage.getItem('userName')){
            sendMessage('Send your name:', nameBot);

        }
        else {
            userName = localStorage.getItem('userName');
        }
    }
    else {
        userName = 'You';
        localStorage.setItem('userName', userName);
    }
}

function getDateTime() {
    if (configChat.showDateTime) return new Date().toLocaleTimeString().substr(0, 5);
    else return '';
}

function getCustomSettings(j) {
    var srcScript = document.currentScript.src;
    srcScript = srcScript.substr(srcScript.indexOf("?")+1, );
    srcScript = srcScript.split("&");
    var i = 0;
    while (i<srcScript.length){
        srcScript[i] = srcScript[i].substr(srcScript[i].indexOf("%27")+3, );
        srcScript[i] = srcScript[i].substr(0,srcScript[i].indexOf("%27"));
        i++;
    }
    return srcScript[j];
}

function initCustomConfig(){
    if (getCustomSettings != null && getCustomSettings !== undefined){
        configChat.title = getCustomSettings(0);
        configChat.botName = getCustomSettings(1);
        configChat.chatUrl = getCustomSettings(2);
        configChat.cssClass = getCustomSettings(3);
        configChat.position = getCustomSettings(4);
        configChat.allowMinimize = getCustomSettings(5);
        configChat.allowDrag = getCustomSettings(6);
        configChat.requireName = getCustomSettings(7);
        configChat.showDateTime = getCustomSettings(8);
        configChat.requests = getCustomSettings(9);
    }
}

function useCustomConfig(){
    renameChat();
    botRename();
    loadCSS();
    positionChat();
    allowToMinimize();
    allowToDrag();
    checkName();
}

window.onload = function() {
    createForm();
    loadHistoryFromLocalStorage();
    useCustomConfig();
}

initCustomConfig();
