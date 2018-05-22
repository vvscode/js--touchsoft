var createChat = function() {

    createStyles();

    var chat = document.createElement('div');
    chat.id = 'chat';
    chat.classList.add('chat');
    chat.style.bottom='15px';
    chat.style.right='15px';

    var chatName = createChatName();
    var logArea = createLogArea();
    var btn = createSendButton();
    var textInput = createTextInput();
    var minimize = createMinimize();

    chat.appendChild(chatName);
    chat.appendChild(minimize);
    chat.appendChild(logArea);
    chat.appendChild(textInput);
    chat.appendChild(btn);
    document.body.appendChild(chat);
}

var createStyles = function () {
    var style = document.createElement('style');
    style.innerHTML = '\n.chat {\n  width: 500px;\n  height: 300px;\n  ' +
        'border: 5px solid red;\n  position: fixed;\n  right: 0px;\n  ' +
        'bottom: 0px;\n  background-color: yellow;\n}\n' +
        '\n.minimized {\nheight: 50px;\n border: 5px solid grey;\n' +
        'background-color: blue;\n}' +
        '.logArea {\nheight: 100px;\n overflow: scroll;\n}' +
        '.notShow {\ndisplay: none;\n}\n';
    document.body.appendChild(style);



}

var addHistoryToPage = function() {
    var objectFormLocalStorage = localStorage.getItem("messages");
    if (objectFormLocalStorage === null) {
        return;
    }
    var messages = JSON.parse(objectFormLocalStorage);
    if (!(messages instanceof Array)) {
        alert('not correct type of messages in local storage');
        return;
    }
    var logArea = document.getElementById('logArea');
    messages.forEach(function (element) {
            var message = new Message(new Date(element.time), element.sender, element.text);
            logArea.innerHTML += '<br>' + message.printMessage();
        }
    );
}

var openChat = function () {
    var isMaxChat = localStorage.getItem('isMaxChat');
    if (isMaxChat === 'true') {
        maximizeChat();
    } else {
        minChat();
    }
}

var resizeChat = function () {
    var isMaxChat = localStorage.getItem('isMaxChat');
    if (isMaxChat === 'true') {
        localStorage.setItem('isMaxChat', 'false');
        minChat();
    } else {
        localStorage.setItem('isMaxChat', 'true');
        maximizeChat();
    }
}

window.addEventListener('load', createChat);
window.addEventListener('load', addHistoryToPage);
window.addEventListener('load', openChat);


var createChatName = function () {
    var chatName = document.createElement('p');
    chatName.innerHTML = 'Chat with us';
    return chatName;
}



var createMinimize = function () {
    var minimize = document.createElement('button');

    minimize.type='button';
    minimize.value='button';
    minimize.innerHTML = '-';
    minimize.id = 'minButton';
    minimize.addEventListener('click', resizeChat);
    return minimize;
}

var minChat = function () {
    var chat = document.getElementById('chat');
    chat.classList.add('minimized');

    var minButton = document.getElementById('minButton');
    minButton.innerHTML = '[]';

    var button = document.getElementById('button');
    button.classList.add('notShow');

    var logArea = document.getElementById('logArea');
   logArea.classList.add('notShow');

    var textInput = document.getElementById('textInput');
    textInput.classList.add('notShow');
}

var maximizeChat = function () {
    var chat = document.getElementById('chat');
    chat.classList.remove('minimized');


    var minButton = document.getElementById('minButton');
    minButton.innerHTML = '-';

    var button = document.getElementById('button');
    button.classList.remove('notShow');

    var logArea = document.getElementById('logArea');
    logArea.classList.remove('notShow');

    var textInput = document.getElementById('textInput');
    textInput.classList.remove('notShow');
}


var createLogArea = function () {
    var logArea = document.createElement('div');
    logArea.style.height = "150px";
    logArea.classList.add('logArea');
    logArea.id = 'logArea';
    logArea.innerHTML = 'our messages';
    return logArea;
};


var createSendButton = function () {
    var btn = document.createElement('button');
    btn.id = 'button';
    btn.style.height="80px";
    btn.style.padding= "5px";
    btn.type='button';
    btn.value='button';

    btn.innerHTML = 'send message';
    btn.addEventListener("click", onSend);
    return btn;
}

var createTextInput = function () {
    var input = document.createElement("textArea");
    input.id = 'textInput';
    input.type = "text";
    input.className = "textInput";
    input.setAttribute("rows", "5");
    input.setAttribute("cols", "30");
    input.style.bottom = '5px';
    // input.style.position="fixed";
    //
    // input.setAttribute("bottom", "15");
    // input.setAttribute("right", "15");

    return input;
}
var onSend = function () {
  var text = document.getElementById('textInput');
  addMessage(text.value);
  addAnswer(text.value);
  text.value = '';
}

var addMessage = function (text) {
    var message = new Message(new Date(), 'I', text);
    var logArea = document.getElementById('logArea');
    logArea.innerHTML += '<br>' + message.printMessage();
    saveMessageToLocalStorage(message);
}

var addAnswer = function (text) {
    var createAnswer = function () {
        var message = new Message(new Date(), "computer", text.toUpperCase());
        var logArea = document.getElementById('logArea');
        logArea.innerHTML += '<br>' + message.printMessage();
        saveMessageToLocalStorage(message);
        return message;
    }
    setTimeout(createAnswer, 1500);
}



var saveMessageToLocalStorage = function (message) {
    var objectFormLocalStorage = localStorage.getItem("messages");
    var messages;
    if (objectFormLocalStorage === null) {
        messages = new Array();
    } else {
        messages = JSON.parse(objectFormLocalStorage);
    }

    messages.push(message);
    localStorage.setItem('messages', JSON.stringify(messages));
}


function Message (time, sender, text) {
    this.time = time;
    this.sender = sender;
    this.text = text;

    this.printMessage = function() {
        return this.time.getHours() + ":" + time.getUTCMinutes() + " " + this.sender + " " + this.text;
     }
}
