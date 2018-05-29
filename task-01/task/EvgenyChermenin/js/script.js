var config = {
    messages: [],
    cssUrl:
        "https://rawgit.com/Ancarian/js--touchsoft/master/task-01/task/EvgenyChermenin/css/styles.css",
    userName: "Вы",
    botName: "Bot",
    botAnswer: "ответ на {",
    timeout: 3000,
    messagesLocalVariable: "jsonMessages",
    choiceLocalVariable: "choice",
    resources: sessionStorage
};

function Message() {
    this.from = "";
    this.message = "";
    this.date = new Date();
}

function toString() {
    return (
        this.date.getHours() +
        ":" +
        this.date.getMinutes() +
        " " +
        this.from +
        ": " +
        this.message
    );
}

function create(obj) {
    var message = new Message();
    message.from = obj.from;
    message.message = obj.message;
    message.date = new Date(obj.date);
    return message;
}

Message.prototype.toString = toString;
Message.prototype.create = create;

function changeLocalVariable(key, value) {
    config.resources.setItem(key, value);
}

function getLocalVariable(key) {
    return config.resources.getItem(key);
}

function setVisibility(choice) {
    if (choice) {
        document.getElementById("hide-show").style.display = "";
        document.getElementById("chat").style.height = "425px";
        changeLocalVariable("choice", "true");
    } else {
        document.getElementById("hide-show").style.display = "none";
        document.getElementById("chat").style.height = "25px";
        changeLocalVariable("choice", "false");
    }
}

function changeChoice() {
    setVisibility(!JSON.parse(getLocalVariable("choice")));
}

function createElement(tag, map) {
    var element = document.createElement(tag);
    Object.entries(map).forEach(function (entry) {
        element.setAttribute(entry[0], entry[1]);
    });
    return element;
}

function addMessageToContent(message) {
    var div = createElement("div", {});
    var messageBox = createElement("p", {value: message});
    messageBox.innerHTML = message;
    div.classList.add("message");
    div.appendChild(messageBox);
    document.getElementById("content").appendChild(div);
}

function botAnswer(message) {
    var m = new Message();
    window.setTimeout(function () {
        m.from = config.botName;
        m.message = config.botAnswer + message.toUpperCase() + "}";
        config.messages.push(m);
        addMessageToContent(m.toString());
        changeLocalVariable("jsonMessages", JSON.stringify(config.messages));
    }, config.timeout);
}

function sendMessage() {
    var message = new Message();
    message.from = config.userName;
    message.message = document.getElementById("text").value;
    config.messages.push(message);
    addMessageToContent(message.toString());
    changeLocalVariable("jsonMessages", JSON.stringify(config.messages));
    botAnswer(message.message);
}

function createContent() {
    var content = createElement("div", {id: "content"});
    content.classList.add("content");
    return content;
}

function createSendButton() {
    var btn = document.createElement("button", {id: "send"});
    btn.innerHTML = "send";
    btn.classList.add("btn");
    btn.addEventListener("click", sendMessage);
    return btn;
}

function createHideButton() {
    var btn = createElement("button", {id: "hide"});
    btn.innerHTML = "-";
    btn.classList.add("btn");
    btn.addEventListener("click", changeChoice);
    return btn;
}

function createTextArea() {
    var textArea = createElement("textarea", {id: "text"});
    textArea.classList.add("input");
    return textArea;
}

function createLink(rel, type, href) {
    var map = {};
    map.rel = rel;
    map.type = type;
    map.href = href;
    return createElement("link", map);
}

function createChat() {
    var chat = createElement("div", {id: "chat"});
    var content = createElement("div", {id: "hide-show"});
    chat.classList.add("chat");
    chat.appendChild(createHideButton());
    content.appendChild(createContent());
    content.appendChild(createTextArea());
    content.appendChild(createSendButton());
    chat.appendChild(content);
    document.body.appendChild(chat);
}

function initMessages() {
    var jsonMessages = JSON.parse(getLocalVariable("jsonMessages"));
    if (jsonMessages != null) {
        jsonMessages.forEach(function callback(currentValue) {
            config.messages.push(Message.prototype.create(currentValue));
            addMessageToContent(config.messages[config.messages.length - 1]);
        });
    }
}

function initVisibility() {
    if (getLocalVariable("choice") != null) {
        setVisibility(JSON.parse(getLocalVariable("choice")));
    } else {
        setVisibility(false);
    }
}

function init() {
    document.head.appendChild(
        createLink("stylesheet", "text/css", config.cssUrl)
    );
    createChat();
    initMessages();
    initVisibility();
}

window.onload = init;
