var messages = [];

function Message() {
    this.from = '';
    this.message = '';
    this.date = new Date();
}

function toString() {
    return this.date.getHours() + ":" + this.date.getMinutes() + ' ' + this.from + ': ' + this.message;
}

function create(obj) {
    var message = new Message();
    message.from = obj.from;
    message.message = obj.message;
    message.date = new Date(obj.date);
    return message
}

Message.prototype.toString = toString;
Message.prototype.create = create;

function addMessageToContent(message) {
    var div = document.createElement('div');
    var messageBox = document.createElement('p');
    div.classList.add('message');
    messageBox.innerHTML = message;
    div.appendChild(messageBox);
    document.getElementById('content').appendChild(div);
}

function saveState(key, value) {
    sessionStorage.setItem(key, value);
}

function setVisibility(choice) {
    if (choice) {
        document.getElementById('hide-show').style.display = '';
        document.getElementById('chat').style.height = '425px';
        saveState('choice', 'true')
    } else {
        document.getElementById('hide-show').style.display = 'none';
        document.getElementById('chat').style.height = '25px';
        saveState('choice', 'false')
    }
}

function botAnswer() {
    var m = new Message();
    setTimeout(1000);
    m.from = 'Bot';
    m.message = 'ответ на {' + messages[messages.length - 1].message.toUpperCase() + '}';
    messages.push(m);
    addMessageToContent(m.toString());
    saveState('messages', JSON.stringify(messages));
}

function sendMessage() {
    var m = new Message();
    m.from = 'Вы';
    m.message = document.getElementById('text').value;
    messages.push(m);
    addMessageToContent(m.toString());
    saveState('messages', JSON.stringify(messages));
    botAnswer();
}

function changeChoice() {
    setVisibility(!JSON.parse(sessionStorage.getItem('choice')));
}

function createSendButton() {
    var btn = document.createElement('button');
    btn.id = 'send';
    btn.classList.add('btn');
    btn.innerHTML = 'send';
    btn.addEventListener("click", sendMessage);
    return btn;
}

function createHideButton() {
    var btn = document.createElement('button');
    btn.id = 'hide';
    btn.classList.add('btn');
    btn.innerHTML = '-';
    btn.addEventListener("click", changeChoice);

    return btn;
}

function createContent() {
    var content = document.createElement('div');
    content.classList.add('content');
    content.id = 'content';
    return content;
}

function createTextArea() {
    var textArea = document.createElement('textarea');
    textArea.classList.add('input');
    textArea.id = 'text';
    return textArea;
}

function createChat() {
    var chat = document.createElement('div');
    var content = document.createElement('div');
    chat.id = 'chat';
    chat.classList.add('chat');
    chat.appendChild(createHideButton());

    content.id = 'hide-show';
    content.appendChild(createContent());
    content.appendChild(createTextArea());
    content.appendChild(createSendButton());
    chat.appendChild(content);
    document.body.appendChild(chat);
}

function init() {
    var jsonMessages = JSON.parse(sessionStorage.getItem('messages'));
    createChat();
    if (jsonMessages != null) {
        jsonMessages.forEach(function callback(currentValue) {
            messages.push(Message.prototype.create(currentValue));
            addMessageToContent(messages[messages.length - 1]);
        });
    }
    if (sessionStorage.getItem('choice') != null) {
        setVisibility(JSON.parse(sessionStorage.getItem('choice')));
    }
}

window.onload = init;




