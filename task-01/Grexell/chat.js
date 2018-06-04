var messages = [];
var style = true;
var minimized = true;

var chatSide = right;
var messagesKey = "messages";
var userIdKey = "username";
var minimizedKey = "minimized";
var sideKey = "side";
var right = "right";
var left = "left";

var historyItemClass = "message-item";
var messageTimeClass = "message-time";
var messageSenderClass = "message-sender";
var messageHistoryClass = "message-history";
var messageFormClass = "chat-message";
var minimizeButtonClass = "minimize-button";
var chatContentClass = "chat-content";
var hiddenClass = "hidden";
var dragClass = "drag";
var messageTextClass = "message-text";
var authFormClass = "auth-form";
var messageSender = "Я";
var dateDelimeter = ":";

var usersPath = "users";
var messagesPath = "messages";
var suffix = ".json";

var chatNetwork = fetchNetwork;
var username = messageSender;
var userid;
var urlAPI;
var time = true;

var answer = {
    insertionRegExp: /\[.*\]/,
    pattern: "Ответ на \"{[]}\"",
    sender: "Бот",
    delay: 15000
};

var messagesUpdateTimeout = 10000;

var XHRNetwork = {
    authorize: authoriseXHR,
    getInfo: getUserInfoXHR,
    sendMessage: sendMessageXHR,
    messagesUpdate: messageUpdateXHR
}

var fetchNetwork = {
    authorize: authoriseFetch,
    getInfo: getUserInfoFetch,
    sendMessage: sendMessageFetch,
    messagesUpdate: messageUpdateFetch
}

function authoriseXHR() {
    var request = new XMLHttpRequest();
    request.open("POST", urlAPI + usersPath + suffix, true);

    request.send(JSON.stringify({
        username: username
    }));

    request.onreadystatechange = function (event) {
        if (this.readyState != 4) return;
        userid = JSON.parse(this.responseText).name;
    }
}

function getUserInfoXHR() {
    var request = new XMLHttpRequest();

    request.open("GET", urlAPI + usersPath + "/" + userid + "/" + suffix, true);
    request.send();

    request.onreadystatechange = function (event) {
        if (this.readyState != 4) return;
        username = JSON.parse(this.responseText).username;
    }
}

function sendMessageXHR(message) {
    var request = new XMLHttpRequest();
    request.open("POST", urlAPI + usersPath + "/" + userid + "/" + messagesPath + "/" + suffix, true);

    request.send(JSON.stringify(message));
}

function messageUpdateXHR() {
    var request = new XMLHttpRequest();
    var response;
    var clear = true;

    request.open("GET", urlAPI + usersPath + "/" + userid + "/" + messagesPath + suffix, true);
    request.send();

    request.onreadystatechange = function (event) {
        if (this.readyState != 4) return;

        messages = [];

        if (this.responseText) {
            response = JSON.parse(this.responseText);
            if (response) {
                Object.keys(response).forEach(function (element) {
                    messages.push(response[element]);
                });

                printItems(messages, clear);
            }
        }
    }
}

function authoriseFetch(event) {
    window.fetch(urlAPI + usersPath + suffix, {
        method: 'POST',
        body: JSON.stringify({
            username: username
        }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            userid = json.name;
        });

    event.preventDefault();
}

function getUserInfoFetch() {
    window.fetch(urlAPI + usersPath + "/" + userid + "/" + suffix, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            username = json.username;
        });
}

function sendMessageFetch(message) {
    window.fetch(urlAPI + usersPath + "/" + userid + "/" + messagesPath + "/" + suffix, {
        method: "POST",
        body: JSON.stringify(message),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then(function (response) {
            return response.json();
        });
}

function messageUpdateFetch() {
    var clear = true;

    window.fetch(urlAPI + usersPath + "/" + userid + "/" + messagesPath + suffix, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            messages = [];

            if (json) {
                Object.keys(json).forEach(function (element) {
                    messages.push(json[element]);
                });

                printItems(messages, true);
            }
        });
}


function HistoryItem(date, sender, text) {
    this.date = date.getHours().toString().concat(dateDelimeter, date.getMinutes().toString());
    this.sender = sender;
    this.text = text;
}

function toggleMinimize() {
    var content = window.document.getElementById(chatContentClass);
    content.classList.toggle(hiddenClass);
    minimized = content.classList.contains(hiddenClass);
}

function formatItem(item) {
    var historyItem = window.document.createElement("div");
    var messageTime = window.document.createElement("div");
    var sender = window.document.createElement("div");
    var text = window.document.createElement("div");

    historyItem.classList.add(historyItemClass);

    messageTime.classList.add(messageTimeClass);
    sender.classList.add(messageSenderClass);
    text.classList.add(messageTextClass);

    messageTime.innerText = item.date;
    sender.innerText = item.sender;
    text.innerText = item.text;

    if (time) {
        historyItem.appendChild(messageTime);
    }
    historyItem.appendChild(sender);
    historyItem.appendChild(text);

    return historyItem;
}

function printItems(items, clear) {
    var history = window.document.getElementsByClassName(messageHistoryClass)[0];
    var i;

    if (clear) {
        history.innerHTML = "";
    }

    for (i = 0; i < items.length; i += 1) {
        history.appendChild(formatItem(items[i]));
    }
}

function generateAnswer(message) {
    return answer.pattern.replace(answer.insertionRegExp, message.toUpperCase());
}

function sendAnswer(item) {
    var history = window.document.getElementsByClassName(messageHistoryClass)[0];
    var sendDate = new Date();
    var answerItem = new HistoryItem(
        sendDate,
        answer.sender,
        generateAnswer(item.text)
    );

    messages.push(answerItem);
    chatNetwork.sendMessage(answerItem);

    history.appendChild(formatItem(answerItem));
}

function authUser(event) {
    initContent(window.document.querySelector("#" + chatContentClass));

    window.document.querySelector("#" + authFormClass).classList.add(hiddenClass);

    username = this.username.value;

    event.preventDefault();
}

function sendMessage(event) {
    var history = window.document.getElementsByClassName(messageHistoryClass)[0];
    var sendDate = new Date();
    var item = new HistoryItem(sendDate, username, this.text.value);

    history.appendChild(formatItem(item));
    messages.push(item);

    chatNetwork.sendMessage(item);

    setTimeout(function () {
        sendAnswer(item);
    }, answer.delay);

    this.text.value = "";

    event.preventDefault();
}

function addStyle(side) {
    var styles = window.document.createElement("style");
    styles.innerHTML =
        "#chat-panel {\n".concat(
            "    position: fixed;\n",
            "    bottom: 0px;\n",
            "    " + side + ": 10%;\n",
            "\n",
            "    background: #3C4896;\n",
            "    color: white;\n",
            "    padding: 10px;\n",
            "    border-top-right-radius: 15px;\n",
            "    border-top-left-radius: 15px;\n",
            "\n",
            "    width: 80%;\n",
            "    max-width: 400px;\n",
            "\n",
            "    font-family: 'Open Sans', sans-serif;\n",
            "}\n",
            "#chat-header{\n",
            "    text-align: right;\n",
            "}\n",
            "#chat-message{\n",
            "    display: table;\n",
            "    width: 100%;\n",
            "}\n",
            "#current-message{\n",
            "    display: table-cell;\n",
            "    vertical-align: middle;\n",
            "    height: 30px;\n",
            "    padding: 5px;\n",
            "}\n",
            "#current-message-area{\n",
            "    -moz-box-sizing: border-box; /* Для Firefox */\n",
            "    -webkit-box-sizing: border-box; /* Для Safari и Chrome */\n",
            "    box-sizing: border-box;\n",
            "    width: 100%;\n",
            "    height: 30px;\n",
            "}\n",
            "#send-message{\n",
            "    display: table-cell;\n",
            "    vertical-align: middle;\n",
            "    height: 30px;\n",
            "    padding: 5px;\n",
            "}\n",
            "#send-message button{\n",
            "    height: 30px;\n",
            "    width: 100%;\n",
            "}\n",
            ".message-history{\n",
            "    display: inline-block;\n",
            "    background: white;\n",
            "    color: #3C4896;\n",
            "    height: 400px;\n",
            "    width: 100%;\n",
            "    overflow-y: auto;\n",
            "    overflow-x: hidden;\n",
            "    margin-top: 10px;\n",
            "}\n",
            ".message-item:after{\n",
            "   content: \"\"",
            "    clear: both;\n",
            "}\n",
            ".message-item{\n",
            "    border: #8891CB 2px solid;\n",
            "    padding-bottom: 5px;\n",
            "    margin-bottom: 5px;\n",
            "}\n",
            ".message-item div{\n",
            "    padding: 10px;\n",
            "    float: left;\n",
            "    margin-right: 5px;\n",
            "    word-wrap: break-word;\n",
            "    border-bottom-left-radius: 5px;\n",
            "    border-bottom-right-radius: 5px;\n",
            "}\n",
            ".message-item .message-time{\n",
            "    background-color: #8891CB;\n",
            "    color: white;\n",
            "}\n",
            ".message-item .message-sender{\n",
            "    background-color: #BBC1E5;\n",
            "}\n",
            ".message-item .message-text{\n",
            "    float: none;\n",
            "}",
            ".hidden{\n",
            "    display: none;\n",
            "}",
            ".drag:hover{",
            "cursor:move",
            "}"
        );

    window.document.head.appendChild(styles);
}

function initChatContent() {
    var messageHistory = window.document.createElement("div");

    messageHistory.classList.add(messageHistoryClass);

    return messageHistory;
}

function initChatForm() {
    var messageForm = window.document.createElement("form");

    messageForm.id = messageFormClass;
    messageForm.innerHTML =
        "<div id=\"current-message\">" +
        "<textarea id=\"current-message-area\" name=\"text\"></textarea>" +
        "</div>" +
        "<div id=\"send-message\">" +
        "<button type=\"submit\">Send</button>" +
        "</div>";

    return messageForm;
}

function initAutorization() {
    var authorization = window.document.createElement("div");

    authorization.innerHTML = "<form id='" + authFormClass + "'><input type='text' name='username'><button>Authorize</button></form>";
    authorization.querySelector("#" + authFormClass).addEventListener("submit", authUser);

    return authorization;
}

function initChatBox(header, minimise, cssClass, dragEnable) {
    var chatBox = window.document.createElement("div");
    chatBox.id = "chat-panel";
    chatBox.classList.add(cssClass);
    chatBox.innerHTML =
        '<div id="chat-header">' +
        '<span>' + header + '</span>' +
        (minimise ? ('<button id="' + minimizeButtonClass + '">-</button>\n') : "") +
        "</div>" +
        "<div id='" + chatContentClass + "' class='" + (minimise ? (minimized ? hiddenClass : "") : "") + "'>" +
        "</div>";

    if (minimise) {
        chatBox.querySelector("#" + minimizeButtonClass).onclick = toggleMinimize;
    }

    if (dragEnable) {
        chatBox.classList.add(dragClass);
        chatBox.addEventListener("mousedown", dragItem);
    }

    return chatBox;
}

function initMessages() {
    chatNetwork.messagesUpdate();
}

function initContent(chatContent) {
    var form = initChatForm();
    form.onsubmit = sendMessage;

    chatContent.appendChild(initChatContent());
    chatContent.appendChild(form);
}

function initMinimized() {
    minimized = localStorage.getItem(minimizedKey) === "true";
}

function initSide() {
    chatSide = localStorage.getItem(sideKey);
}

function initUserId() {
    userid = localStorage.getItem(userIdKey);
}

function saveMinimized() {
    localStorage.setItem(minimizedKey, minimized.toString());
}

function saveChatSide() {
    localStorage.setItem(sideKey, chatSide);
}

function saveUserId() {
    if (userid) {
        localStorage.setItem(userIdKey, userid);
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

function initChat(header, userAuth, side, minimise, botName, url, cssClass, dragEnable, showTime, network) {
    var minimizeButton;
    var form;
    var chat;
    var authForm;

    urlAPI = url;
    time = showTime;

    if (botName) {
        answer.sender = botName;
    }

    if (localStorage.getItem(sideKey)) {
        initSide();
    } else if (side) {
        chatSide = side;
    }

    addStyle(chatSide);

    if (minimise) {
        initMinimized();
        window.addEventListener("beforeunload", saveMinimized);
    }

    if (network) {
        chatNetwork = network;
    }

    chat = initChatBox(header, minimise, cssClass, dragEnable);
    if (!localStorage.getItem(userIdKey)) {
        if (userAuth) {
            authForm = initAutorization();
            chat.querySelector("#" + chatContentClass).appendChild(authForm);
            authForm.querySelector("#" + authFormClass).addEventListener("submit", chatNetwork.authorize);
        } else {
            initContent(chat.querySelector("#" + chatContentClass));
            username = messageSender;
        }
    } else {
        initUserId();
        network.getInfo();
        initContent(chat.querySelector("#" + chatContentClass));
        initMessages();
    }

    window.setInterval(network.messagesUpdate, messagesUpdateTimeout);

    window.document.body.appendChild(chat);
    printItems(messages);

    window.addEventListener("beforeunload", saveUserId);
    window.addEventListener("beforeunload", saveChatSide);
}