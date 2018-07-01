var generateUserId = function () {
    if (localStorage.getItem('userID') === null) {
        var ID = Date.now() + Math.floor(Math.random() * 10000);
        localStorage.setItem('userID', ID);
    }
}

function createMinButton(isAllowMin) {

    var minBtn = document.createElement('button');

    minBtn.type = 'button';
    minBtn.value = 'button';
    minBtn.innerHTML = '-';
    minBtn.id = 'minBtn';

    if (isAllowMin === "false")
        minBtn.disabled = true;

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

function doStyles(position) {

    var style = document.createElement('style');
    style.innerHTML = '\n.chat {\n  width: 500px;\n  height: 300px;\n  ' +
        'border: 5px solid green;\n  position: fixed;\n' + position + ': 0px;\n  ' +
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

    generateUserId();

    var configObject = createConfigObject();
    doStyles(configObject.position);

    var chat = document.createElement('div');
    chat.id = 'chat';
    chat.classList.add('chat');
    chat.style.bottom = '15px';
    chat.style.right = '15px';

    var minBtn = createMinButton(configObject.allowMin);
    var logArea = createLogArea();
    var btn = createSendButton();
    var input = createTextInput();

    chat.appendChild(minBtn);
    chat.appendChild(logArea);
    chat.appendChild(input);
    chat.appendChild(btn);
    document.body.appendChild(chat);
    assignmentOfDragNDropefunc(document.getElementById('chat'));

    return chat;
}

var assignmentOfDragNDropefunc = function (chat) {

    chat.onmousedown = function (e) {


        chat.style.position = 'absolute';
        moveAt(e);

        document.body.appendChild(chat);

        chat.style.zIndex = 1000;

        function moveAt(e) {
            chat.style.left = e.pageX - chat.offsetWidth / 2 + 'px';
            chat.style.top = e.pageY - chat.offsetHeight / 2 + 'px';
        }


        document.onmousemove = function (e) {
            moveAt(e);
        }

        chat.onmouseup = function () {
            document.onmousemove = null;
            chat.onmouseup = null;
        }
    }

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

    var timeOut = 900;
    var content = document.getElementById('textInput').value;
    sendMessage('I', content);
    //setTimeout(messageAnswer, timeOut, content);
}


var sendMessage = function (sender, message) {

    var chatLog = document.getElementById('logArea');
    var date = new Date;

    if (createConfigObject().showTime === "true") {
        var hours = date.toLocaleTimeString();
        chatLog.innerHTML += hours
    }

    chatLog.innerHTML += " " + sender + ': ' + message + '<br>';
    document.getElementById('textInput').value = '';
    if (createConfigObject().requestType === "fetch")
        postMessageFetch(hours + " " + sender + ': ' + message + '<br>');
    else
        postMessageXHR(hours + " " + sender + ': ' + message + '<br>');
}

var messageAnswer = function (content) {

    content = content.toUpperCase();
    sendMessage(createConfigObject().botName, content);

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

var postMessageFetch = function (message) {

    fetch('https://touchsoftchat.firebaseio.com/users/' + localStorage.getItem('userID') + '/messages.json', {
        method: 'POST',
        body: JSON.stringify([
            {
                message: message,
            },
        ]),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(console.log);
}

var addChatLogFromFireBase = function () {

    if (createConfigObject().requestType === "fetch")
        getFromBaseFetch();
    else
        getMessageXHR();
}

var getFromBaseFetch = function () {
    var logArea = document.getElementById('logArea');

    fetch('https://touchsoftchat.firebaseio.com/users/' + localStorage.getItem('userID') +
        '/messages.json').then(function (r) {

        return r.json();
    }).then(function (obj) {
        return Object.values(obj);
    }).then(function (list) {
        return list.map(function (i) {
            logArea.innerHTML += i[0].message;
            return i[0];
        });
    }).then(console.log);
}

function postMessageXHR(message) {
    var request;
    var url = 'https://touchsoftchat.firebaseio.com/users/' + localStorage.getItem('userID') +
        '/messages.json';
    return new Promise(function (resolve) {
        request = new XMLHttpRequest();
        request.open('POST', url, true);
        request.setRequestHeader('Accept', 'application/json');
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function () {
            resolve(JSON.parse(request.response));
        });
        request.send(JSON.stringify([
            {
                message: message
            }
        ]));
    });
}

function getMessageXHR() {
    var xhttp = new XMLHttpRequest();
    var url = 'https://touchsoftchat.firebaseio.com/users/' + localStorage.getItem('userID') +
        '/messages.json';
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.response);
            list = Object.values(obj);
            for (var i = 0; i < list.length; i++) {
                logArea.innerHTML += list[i][0].message;
            }
        }
    }

    xhttp.open("GET", url, true);
    xhttp.send();
}

window.addEventListener('load', createChat);

window.addEventListener('load', addChatLogFromFireBase);

window.addEventListener('load', onLoadChatStage);




