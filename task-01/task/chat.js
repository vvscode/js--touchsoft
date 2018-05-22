

var createChat = function() {
    var chat = document.createElement('div');
    // chat.style.position='fixed';
    chat.setAttribute('position', 'fixed');
    chat.setAttribute('bottom', '20');
    chat.style.bottom='15px';
    chat.style.right='15px';

    var chatName = createChatName();
    var logArea = createLogArea();
    var btn = createSendButton();
    var textArea = createTextArea();

    chat.appendChild(chatName);
    chat.appendChild(logArea);
    chat.appendChild(textArea);
    chat.appendChild(btn);
    document.body.appendChild(chat);
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
    // alert(messages);
}

window.addEventListener('load', createChat);
window.addEventListener('load', addHistoryToPage);


var createChatName = function () {
    var chatName = document.createElement('h3');
    chatName.innerHTML = 'Chat with us';
    return chatName;
}

var createLogArea = function () {
    var logArea = document.createElement('div');
    logArea.style.height = "150px";
    logArea.class = 'logArea';
    logArea.id = 'logArea';
    logArea.innerHTML = 'our messages';
    return logArea;
};


var createSendButton = function () {
    var btn = document.createElement('button');
    btn.style.height="80px";
    btn.style.padding= "5px";
    btn.type='button';
    btn.value='button';

    btn.innerHTML = 'send message';
    btn.addEventListener("click", onSend);
    // btn.setAttribute("position", "fixed");
    // btn.setAttribute("bottom", "15");
    // btn.setAttribute("right", "15");
    return btn;
}

var createTextArea = function () {
    var input = document.createElement("textArea");
    input.id = 'inputArea';
    input.type = "text";
    input.className = "inputArea";
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
  var text = document.getElementById('inputArea');
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
    setTimeout(createAnswer, 1500 );
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
