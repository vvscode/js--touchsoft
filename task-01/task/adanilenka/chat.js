function createMinButton() {

    var minBtn = document.createElement('button');

    minBtn.type = 'button';
    minBtn.value = 'button';
    minBtn.innerHTML = '-';
    minBtn.id = 'minBtn';

    minBtn.addEventListener('click', function () {
        changeStateOfChatWindow();
    });
    return minBtn;
}

function createLogArea() {

    var logArea = document.createElement('div');
    logArea.style.height = "200px";
    logArea.classList.add('logArea');
    logArea.id = 'logArea';
    return logArea;
}

function createSendButton() {

    var btn = document.createElement('button');
    btn.id = 'sendButton';
    btn.classList.add('sendButton');
    btn.type = 'button';
    btn.value = 'button';

    btn.innerHTML = 'send message';
    btn.addEventListener("click", sendButtonController);
    return btn;
}

function createTextInput() {

    var input = document.createElement("textArea");
    input.id = 'textInput';
    input.type = "text";
    input.className = "textInput";
    input.setAttribute("rows", "4");
    input.setAttribute("cols", "50");
    input.style.bottom = '5px';
    input.addEventListener('keyup', function (e) {
        if (e.keyCode === 13) {
            sendButtonController();
        }
    });

    return input;
}

function doStyles() {

    var style = document.createElement('style');
    style.innerHTML = '\n.chat {\n  width: 500px;\n  height: 300px;\n  ' +
        'border: 5px solid green;\n  position: fixed;\n  right: 0px;\n  ' +
        'bottom: 0px;\n  background-color: light blue;\n}\n' +
        '\n.minimizedChat {\n  width: 500px;\n  height: 20px;\n  ' +
        'border: 5px solid green;\n  position: fixed;\n  right: 0px;\n  ' +
        'bottom: 0px;\n  background-color: light blue;\n}\n' +
        '\n.minBtn {\n height: 10px;\nfloat: right;\n color:red;' +
        'background-color: red;\n}' +
        '.logArea {\nheight: 100px;\n resize:none;\n overflow: scroll;background-color: grey\n}' +
        '.textInput {\nresize: none;\n}\n' +
        '.sendButton {\n margin: 2px;\n' +
        'position: inherit;\n' +
        'margin-left: 15px;\n' +
        'height: 75px\n}\n';
    document.body.appendChild(style);

    return style;

}

function createChat() {

    doStyles();

    var chat = document.createElement('div');
    chat.id = 'chat';
    chat.classList.add('chat');
    chat.style.bottom = '15px';
    chat.style.right = '15px';

    var minBtn = createMinButton();
    var logArea = createLogArea();
    var btn = createSendButton();
    var input = createTextInput();

    chat.appendChild(minBtn);
    chat.appendChild(logArea);
    chat.appendChild(input);
    chat.appendChild(btn);
    document.body.appendChild(chat);

    return chat;

}

var onLoadChatStage = function () {

    var isMinimized = localStorage.getItem("isMinimized");
    if (isMinimized == null) {
        isMinimized = false;
        localStorage.setItem('isMinimized', isMinimized);
    }
    if (isMinimized === "true") {
        localStorage.setItem('isMinimized', false);
        changeStateOfChatWindow();
    }
}

var sendButtonController = function () {

    var timeOut = 9000;
    var content = document.getElementById('textInput').value;
    sendMessage('I', content);
    setTimeout(messageAnswer, timeOut, content);
}


var sendMessage = function (sender, message) {

    var chatLog = document.getElementById('logArea');
    var date = new Date;
    var hours = date.toLocaleTimeString();
    chatLog.innerHTML += hours + " " + sender + ': ' + message + '<br>';
    document.getElementById('textInput').value = '';
    saveMessageToLocalStorage(hours + " " + sender + ': ' + message + '<br>');
}

var messageAnswer = function (content) {

    content = content.toUpperCase();
    sendMessage('BOT', content);

}


var changeStateOfChatWindow = function () {

    var logArea = document.getElementById("logArea");
    var sendBtn = document.getElementById("sendButton");
    var textInput = document.getElementById("textInput");
    var chat = document.getElementById("chat");
    if (chat === undefined)
        chat = document.getElementById("minimizedChat");
    var isMinimized = localStorage.getItem("isMinimized");

    if (isMinimized == "false") {
        logArea.style.visibility = 'hidden';
        sendBtn.style.visibility = 'hidden';
        textInput.style.visibility = 'hidden';
        chat.classList.remove('chat');
        chat.classList.add('minimizedChat');
        isMinimized = true;
        localStorage.setItem('isMinimized', isMinimized);
    }
    else {
        logArea.style.visibility = 'visible';
        sendBtn.style.visibility = 'visible';
        textInput.style.visibility = 'visible';
        chat.classList.remove('minimizedChat');
        chat.classList.add('chat');
        isMinimized = false;
        localStorage.setItem('isMinimized', isMinimized);
    }
}

var saveMessageToLocalStorage = function (message) {

    var dataFromLocalStorage = localStorage.getItem("messageLog");
    var messageLog;
    if (dataFromLocalStorage === null) {
        messageLog = new Array();
    } else {
        messageLog = JSON.parse(dataFromLocalStorage);
    }

    messageLog.push(message);
    localStorage.setItem('messageLog', JSON.stringify(messageLog));
}

var addChatLogFromLocalStorage = function () {

    var dataFromLocalStorage = localStorage.getItem("messageLog");
    if (dataFromLocalStorage === null) {
        return;
    }
    var messages = JSON.parse(dataFromLocalStorage);
    var logArea = document.getElementById('logArea');
    messages.forEach(function (element) {
            logArea.innerHTML += element;
        }
    );
}


window.addEventListener('load', createChat);

window.addEventListener('load', addChatLogFromLocalStorage);

window.addEventListener('load', onLoadChatStage);

