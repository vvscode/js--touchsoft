var main = null;
var chatName = null;
var sendButton = null;
var isChatHidden = false;
var historyElement = null;
var inputElement = null;
var buttonElement = null;
var textarea = null;
var stateButton = null;
var historyPanel = null;
var userName;
var requireNameButton = null;
var requireNameInput = null;
var options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
 };

var chatStyle = 
    '.main {' + 
        'background: #d3cadb;' + 
        'height: 365px;' +
        'width: 260px;' + 
        'position: absolute;' + 
        'z-index: 1000;' + 
        'right: 20px;' + 
        'bottom: 20px;' + 
        'box-shadow: 0 10px 20px rgba(0, 0, 0, 0.75);' + 
        'border-radius: 10px;' + 
    '}' + 
    '.chatName {' + 
        'background: #fff;' + 
        'border: 1px solid #545459;' + 
        'border-radius: 10px;' +
        'text-align: center;' + 
        'width: 60px;' + 
        'position: fixed;' + 
        'margin-left: 10px;' + 
        'margin-top: 6px;' + 
    '}' + 
    '.textArea {' + 
        'border: 1px solid #545459;' + 
        'background: transparent;' + 
        'width: 65%;' + 
        'height: 70px;' + 
        'color: #545459;' + 
        'float: left;' + 
        'border-radius: 10px;' + 
        'margin: 6px;' +
    '}' + 
    '.sendButton{' +
        'width: 25%;' + 
        'border: 1px solid #545459;' + 
        'background: transparent;' + 
        'color: #545459;' +
        'height = 60px;' + 
        'border-radius: 10px;' + 
        'padding: 10px;' + 
        'bottom: 6px;' +
        'position: absolute;' +
        'right: 10px;' +
    '}' + 
    '.historyPanel {' + 
        'height: 240px;' + 
        'margin: 6px;' +
        'margin-top: 30px;' +
        'background: #fff;' +
        'border-radius: 14px;' +
        'overflow-y: scroll;' +  
    '}' + 
    '.stateButton {' +
        'width: 26px;' + 
        'height: 26px;' + 
        'float: right;' + 
    '}' +
    '.nameRequestTitle {' + 
        'height: 40px;' +
        'position: fixed;' + 
        'margin-left: 10px;' + 
        'margin-top: 66px;' + 
    '}' + 
    '.nameRequestInput {'+
        'border: 1px solid #545459;' + 
        'color: #545459;' + 
        'float: left;' + 
        'margin-left: 10px;' + 
        'margin-top: 106px;' + 
    '}' + 
    '.nameRequestButton {'+
        'width: 25%;' + 
        'border: 1px solid #545459;' + 
        'color: #545459;' +
        'height = 60px;' + 
        'border-radius: 10px;' + 
        'padding: 10px;' + 
        'position: absolute;' +
        'margin-left: 10px;' + 
        'margin-top: 90px;' + 
    '}' + 
    '.chatPositionLeft {' + 
        'left: 20px;' + 
        'bottom: 20px;' + 
    '}' + 
    '.chatPositionRight {' + 
        'right: 20px;' + 
        'bottom: 20px;' + 
    '}';
    
var config = {
    title: 'New',
    botName: 'Bot',
    chatURL: 'https://mychat-b0091.firebaseio.com/',
    cssClass: 'new',
    position: 'right',
    allowMinimize: 'true',
    allowDrag: 'true',
    showDateTime: 'true',
    requireName: 'false',
    requests: 'xhr'
};

function parseConfigFromScript() {
    var pattern = /'/g;
    var script = document.currentScript.getAttribute('src');
    var setupObject = {};
    var arr = script.slice(script.indexOf('?') + 2).split('&');
    arr.forEach(function createConfigObj(e) {
        var parts = e.split('=');
        setupObject[parts[0]] = parts[1].replace(pattern, '');
    });
    return setupObject;
}

function setConfig() {
    var configObject = parseConfigFromScript();
    Object.keys(configObject).forEach(function (key) {
        if (configObject[key] !== '') {
            config[key] = configObject[key];
          }
      });
}

function sendXhrRequest(method, path, key, body) {
    return new Promise(function requestXHR (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, config.chatURL + path + localStorage.getItem('userId') + '/' + key + '.json');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function load() {
          resolve(JSON.parse(xhr.response));
      };
      xhr.onerror = function err() {
        reject(xhr.statusText);
      };
      xhr.send(JSON.stringify(body));
    });
}

function sendFetchRequest(method, path, key, body) {
    return fetch(
        config.chatURL + path + localStorage.getItem('userId') + '/' + key + '.json',
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: method,
            body: JSON.stringify(body)
        }
    )  
    .then(function getResponse(response) {
        return response.json();
      }).catch(function err(error) {
        console.log('There has been a problem with your fetch operation: ', error.message);
      });
}

function sendRequestToDatabase(method, path, key, body) {
    var response;
  
    if (config.requests === 'xhr') {
      response = sendXhrRequest(method, path, key, body);
    } else if (config.requests === 'fetch') {
      response = sendFetchRequest(method, path, key, body);
    }
  
    return response;
}

function createStyle() {
    var styles = document.createElement('style');
    styles.innerHTML = chatStyle;

    return styles;
}

function moveAt(e) {
    main.style.left = e.pageX - chatName.offsetWidth / 2 + 'px';
    main.style.top = e.pageY - chatName.offsetHeight / 2 + 'px';
}

function dragChat(e) {
    moveAt(e);
    document.addEventListener('mousemove', moveAt);
    
    function finishDrag () {
        document.removeEventListener('mousemove', moveAt);
        document.removeEventListener('mouseup', finishDrag);
    }

    chatName.addEventListener('mouseup', finishDrag);
}

function createChatName() {
    chatName = document.createElement('div');
    chatName.classList.add('chatName');
    chatName.innerHTML = config.title;

    if (JSON.parse(config.allowDrag)) {
        chatName.addEventListener('mousedown', dragChat);
    }

    return chatName;
}

function createTextInput() {
   textarea = document.createElement('textarea');
   textarea.classList.add('textArea');
   textarea.placeholder = 'Message...';

   return textarea;
}

function Message(time, sender, body) {
    this.time = time;
    this.sender = sender;
    this.body = body;
 
    this.showMessage = function showMsg() {
        var displayedMessage = '';
        if (JSON.parse(config.showDateTime)) {
            displayedMessage += this.time.toLocaleString('en-US', options) + ' ';
        }
        displayedMessage += this.sender + '<br>' + this.body + '<br>';
        return displayedMessage;
    }
 }

 function addMessage(text) {
    var message = new Message(new Date(), 'YOU', text);
    historyPanel.innerHTML += '<br>' + message.showMessage();
    sendRequestToDatabase('POST', 'messages/', '', message);
 }
 
function addAnswer(text) {
    function createAnswer () {
        var message = new Message(new Date(), config.botName, 'The answer to the "' + text.toUpperCase() + '"');
        historyPanel.innerHTML += '<br>' + message.showMessage();
        sendRequestToDatabase('POST', 'messages/', '', message);
 
        return message;
    }
    setTimeout(createAnswer, 150);
 }
 
function sendMessage() {
    addMessage(textarea.value);
    addAnswer(textarea.value);
    textarea.value = '';
 }

function createSendButton() {
   sendButton = document.createElement('button');
   sendButton.classList.add('sendButton');
   sendButton.innerHTML = 'Send';

   sendButton.addEventListener('click', sendMessage);

   return sendButton;
}

function getChatState() {
    sendRequestToDatabase('GET', 'users/', 'isChatHidden').then(
        function setState(body) {
            isChatHidden = body;
            console.log(isChatHidden);
        }
    );
 }
 
 function setChatState() {
    sendRequestToDatabase('PUT', 'users/', 'isChatHidden', isChatHidden);
 }

 function initStateButton() {
    if (!isChatHidden) {
        stateButton.innerHTML = '-';
        } else {
         stateButton.innerHTML = '[]'; 
        }
}

function changeChatState() {
    isChatHidden = !isChatHidden;
    setChatState();
    
    if (historyElement) {
        historyElement.style.display = isChatHidden ? 'none' : 'block';
        inputElement.style.display = isChatHidden ? 'none' : 'block';
        buttonElement.style.display = isChatHidden ? 'none' : 'block'; 
        main.style.height = isChatHidden ? '30px' : '365px';
    } else {
        main.style.height = isChatHidden ? '30px' : '365px';
    }
    
    initStateButton();
 }

function createStateButton() {
   stateButton = document.createElement('button');
   stateButton.classList.add('stateButton');
   getChatState();
   
   initStateButton();

   stateButton.addEventListener('click', changeChatState);

   return stateButton;
}

function createHistory() {
   historyPanel = document.createElement('div');
   historyPanel.classList.add('historyPanel');
   
   return historyPanel;
}

function initChatPosition() {
    var chatPosition;

    if (config.position === 'left') {
        chatPosition = 'chatPositionLeft';
    } else {
        chatPosition = 'chatPositionRight';
    }

    return chatPosition;
}

function addHistoryToPage() {
    sendRequestToDatabase('GET', 'messages/', '').then(
        function displayMessages(body) {
            var message;
            if (!body) {
                return;
              }
              Object.keys(body).forEach(function (key) {
                message = new Message(new Date(body[key].time), body[key].sender, body[key].body);
                historyPanel.innerHTML += '<br>' + message.showMessage();
              });
        }
    );    
}

function createUserID() {
    if (localStorage.getItem('userId') === null) {
      localStorage.setItem('userId', 'user' + Date.now() + Math.round(Math.random()*100));
    }
}

function createFullChat() {
    var history = createHistory();
    var textInput = createTextInput();
    sendButton = createSendButton();
    getChatState();

    historyElement = history;
    inputElement = textInput;
    buttonElement = sendButton;

    setTimeout(function create() {
        historyElement.style.display = isChatHidden ? 'none' : 'block';
        console.log(isChatHidden);
        inputElement.style.display = isChatHidden ? 'none' : 'block';
        buttonElement.style.display = isChatHidden ? 'none' : 'block';
        main.style.height = isChatHidden ? '30px' : '365px';
    
        addHistoryToPage();
    }, 1000);

    main.appendChild(history);
    main.appendChild(textInput);
    main.appendChild(sendButton);
}

function createDivForNameRequest() {
    var requireNameWrapper = document.createElement('div');
    var requireNameTitle = document.createElement('h4');
    requireNameInput = document.createElement('input');
    requireNameButton = document.createElement('button');

    requireNameTitle.innerText = 'Enter your name';
    requireNameTitle.classList.add('nameRequestTitle');
    requireNameInput.classList.add('nameRequestInput');
    requireNameButton.classList.add('nameRequestButton');
    requireNameButton.innerHTML = 'Submit';

    requireNameWrapper.appendChild(requireNameTitle);
    requireNameWrapper.appendChild(requireNameInput);
    requireNameWrapper.appendChild(requireNameButton);

    requireNameButton.addEventListener('click', function setUserName() {
        userName = requireNameInput.value;
        sendRequestToDatabase('PUT', 'users/', 'userName', userName);
        createFullChat();
        main.removeChild(requireNameWrapper);
    });

    return requireNameWrapper;
}

function createChat() {
    createUserID();
    sendRequestToDatabase('GET', 'users/', 'userName').then(
        function setUserName(body) {
          userName = body;
          console.log(userName);
        }
      );

    main = document.createElement('div');
    main.id = 'chat';
    main.classList.add(config.cssClass);
    main.classList.add(initChatPosition());
        
    if (JSON.parse(config.allowMinimize)) {
        main.appendChild(createStateButton());
    }
    
    main.appendChild(createStyle());
    main.appendChild(createChatName());
    document.body.appendChild(main);
    
    setTimeout(function check(){
        var nameRequest;
        if (!JSON.parse(config.requireName)) {
            createFullChat();
        } else if (userName !== null) {
            console.log(userName);
            createFullChat();
        } else {
            nameRequest = createDivForNameRequest();
            main.appendChild(nameRequest);
        }
    }, 1000)
 }

// localStorage.clear();

setTimeout(setConfig(), 2000);

window.addEventListener('DOMContentLoaded', createChat);
