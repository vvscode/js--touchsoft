

(function Chat() {
    window.messages = [];
    window.minimized = true;

    window.right = "right";
    window.left = "left";
    window.chatSide = window.right;
    window.userIdKey = "username";
    window.minimizedKey = "minimized";
    window.sideKey = "side";

    window.historyItemClass = "message-item";
    window.messageTimeClass = "message-time";
    window.messageSenderClass = "message-sender";
    window.messageHistoryClass = "message-history";
    window.messageFormClass = "chat-message";
    window.minimizeButtonClass = "minimize-button";
    window.chatContentClass = "chat-content";
    window.hiddenClass = "hidden";
    window.dragClass = "drag";
    window.messageTextClass = "message-text";
    window.authFormClass = "auth-form";
    window.messageSender = "Я";
    window.dateDelimeter = ":";

    window.usersPath = "users";
    window.messagesPath = "messages";
    window.suffix = ".json";

    window.username = window.messageSender;
    window.userid = "";
    window.urlAPI = "";
    window.time = true;

    window.answer = {
        insertionRegExp: /\[.*\]/,
        pattern: "Ответ на \"{[]}\"",
        sender: "Бот",
        delay: 15000
    };

    window.messagesUpdateTimeout = 10000;

    window.printItems = function (items, clear) {
        var history = window.document.getElementsByClassName(window.messageHistoryClass)[0];
        var i;

        if (clear) {
            history.innerHTML = "";
        }

        for (i = 0; i < items.length; i += 1) {
            history.appendChild(window.formatItem(items[i]));
        }
    }

    function authoriseXHR() {
        var request = new XMLHttpRequest();
        request.open("POST", window.urlAPI + window.usersPath + window.suffix, true);

        request.send(JSON.stringify({
            username: window.username
        }));

        request.onreadystatechange = function () {
            if (this.readyState !== 4) return;
            window.userid = JSON.parse(this.responseText).name;
        }

        return false;
    }

    function getUserInfoXHR() {
        var request = new XMLHttpRequest();

        request.open("GET", window.urlAPI + window.usersPath + "/" + window.userid + "/" + window.suffix, true);
        request.send();

        request.onreadystatechange = function () {
            if (this.readyState !== 4) return;
            window.username = JSON.parse(this.responseText).username;
        }
    }

    function sendMessageXHR(message) {
        var request = new XMLHttpRequest();
        request.open("POST", window.urlAPI + window.usersPath + "/" + window.userid + "/" + window.messagesPath + "/" + window.suffix, true);

        request.send(JSON.stringify(message));
    }

    function messageUpdateXHR() {
        var request = new XMLHttpRequest();
        var response;
        var clear = true;

        request.open("GET", window.urlAPI + window.usersPath + "/" + window.userid + "/" + window.messagesPath + window.suffix, true);
        request.send();

        request.onreadystatechange = function () {
            if (this.readyState !== 4) return;

            window.messages = [];

            if (this.responseText) {
                response = JSON.parse(this.responseText);
                if (response) {
                    Object.keys(response).forEach(function (element) {
                        window.messages.push(response[element]);
                    });

                    window.printItems(window.messages, clear);
                }
            }
        }
    }

    window.XHRNetwork = {
        authorize: authoriseXHR,
        getInfo: getUserInfoXHR,
        sendMessage: sendMessageXHR,
        messagesUpdate: messageUpdateXHR
    }

    function authoriseFetch() {
        window.fetch(window.urlAPI + window.usersPath + window.suffix, {
            method: 'POST',
            body: JSON.stringify({
                username: window.username
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
                window.userid = json.name;
            });

        return false;
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
                window.username = json.username;
            });
    }

    function sendMessageFetch(message) {
        window.fetch(window.urlAPI + window.usersPath + "/" + window.userid + "/" + window.messagesPath + "/" + window.suffix, {
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

        window.fetch(window.urlAPI + window.usersPath + "/" + window.userid + "/" + window.messagesPath + window.suffix, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                window.messages = [];

                if (json) {
                    Object.keys(json).forEach(function (element) {
                        window.messages.push(json[element]);
                    });

                    window.printItems(window.messages, clear);
                }
            });
    }

    window.fetchNetwork = {
        authorize: authoriseFetch,
        getInfo: getUserInfoFetch,
        sendMessage: sendMessageFetch,
        messagesUpdate: messageUpdateFetch
    }

    window.chatNetwork = window.fetchNetwork;

    window.HistoryItem = function (date, sender, text) {
        this.date = date.getHours().toString().concat(window.dateDelimeter, date.getMinutes().toString());
        this.sender = sender;
        this.text = text;
    }

    window.toggleMinimize = function () {
        var content = window.document.getElementById(window.chatContentClass);
        content.classList.toggle(window.hiddenClass);
        window.minimized = content.classList.contains(window.hiddenClass);
    }

    window.formatItem = function (item) {
        var historyItem = window.document.createElement("div");
        var messageTime = window.document.createElement("div");
        var sender = window.document.createElement("div");
        var text = window.document.createElement("div");

        historyItem.classList.add(window.historyItemClass);

        messageTime.classList.add(window.messageTimeClass);
        sender.classList.add(window.messageSenderClass);
        text.classList.add(window.messageTextClass);

        messageTime.innerText = item.date;
        sender.innerText = item.sender;
        text.innerText = item.text;

        if (window.time) {
            historyItem.appendChild(messageTime);
        }
        historyItem.appendChild(sender);
        historyItem.appendChild(text);

        return historyItem;
    }

    window.generateAnswer = function (message) {
        return window.answer.pattern.replace(window.answer.insertionRegExp, message.toUpperCase());
    }

    window.sendAnswer = function (item) {
        var history = window.document.getElementsByClassName(window.messageHistoryClass)[0];
        var sendDate = new Date();
        var answerItem = new window.HistoryItem(
            sendDate,
            window.answer.sender,
            window.generateAnswer(item.text)
        );

        window.messages.push(answerItem);
        window.chatNetwork.sendMessage(answerItem);

        history.appendChild(window.formatItem(answerItem));
    }

    window.sendMessage = function (event) {
        var history = window.document.getElementsByClassName(window.messageHistoryClass)[0];
        var sendDate = new Date();
        var item = new window.HistoryItem(sendDate, window.username, this.text.value);

        history.appendChild(window.formatItem(item));
        window.messages.push(item);

        window.chatNetwork.sendMessage(item);

        setTimeout(function () {
            window.sendAnswer(item);
        }, window.answer.delay);

        this.text.value = "";

        event.preventDefault();
    }

    window.addStyle = function (side) {
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

    window.initChatContent = function () {
        var messageHistory = window.document.createElement("div");

        messageHistory.classList.add(window.messageHistoryClass);

        return messageHistory;
    }

    window.initChatForm = function () {
        var messageForm = window.document.createElement("form");

        messageForm.id = window.messageFormClass;
        messageForm.innerHTML =
            "<div id=\"current-message\">" +
            "<textarea id=\"current-message-area\" name=\"text\"></textarea>" +
            "</div>" +
            "<div id=\"send-message\">" +
            "<button type=\"submit\">Send</button>" +
            "</div>";

        return messageForm;
    }

    window.initContent = function (chatContent) {
        var form = window.initChatForm();
        form.onsubmit = window.sendMessage;

        chatContent.appendChild(window.initChatContent());
        chatContent.appendChild(form);
    }

    window.authUser = function (event) {
        window.initContent(window.document.querySelector("#" + window.chatContentClass));

        window.document.querySelector("#" + window.authFormClass).classList.add(window.hiddenClass);

        window.username = this.username.value;

        event.preventDefault();
    }

    window.initAutorization = function () {
        var authorization = window.document.createElement("div");

        authorization.innerHTML = "<form id='" + window.authFormClass + "'><input type='text' name='username'><button>Authorize</button></form>";
        authorization.querySelector("#" + window.authFormClass).addEventListener("submit", window.authUser);

        return authorization;
    }

    window.moveToPoint = function (element, x, y) {
        element.style.left = x + "px";
        element.style.top = y + "px";
        element.style.right = "auto";
        element.style.bottom = "auto";
    }

    window.dragItem = function (event) {
        var leftMargin = this.getBoundingClientRect().left + window.pageXOffset;
        var topMargin = this.getBoundingClientRect().top + window.pageYOffset;

        var shiftX = event.pageX - leftMargin;
        var shiftY = event.pageY - topMargin;

        var element = this;

        var moveEventHandler = function (e) {
            window.moveToPoint(element, e.pageX - shiftX, e.pageY - shiftY);
        };
        window.document.addEventListener("mousemove", moveEventHandler);

        this.onmouseup = function () {
            window.document.removeEventListener("mousemove", moveEventHandler);
        }
    }

    window.initChatBox = function (header, minimise, cssClass, dragEnable) {
        var chatBox = window.document.createElement("div");
        chatBox.id = "chat-panel";
        chatBox.classList.add(cssClass);
        chatBox.innerHTML =
            '<div id="chat-header">' +
            '<span>' + header + '</span>' +
            (minimise ? ('<button id="' + window.minimizeButtonClass + '">-</button>\n') : "") +
            "</div>" +
            "<div id='" + window.chatContentClass + "'>" +
            "</div>";

        if (minimise) {
            if (window.minimized) {
                chatBox.querySelector("#" + window.chatContentClass).classList.add(window.hiddenClass);
            }
            chatBox.querySelector("#" + window.minimizeButtonClass).onclick = window.toggleMinimize;
        }

        if (dragEnable) {
            chatBox.classList.add(window.dragClass);
            chatBox.addEventListener("mousedown", window.dragItem);
        }

        return chatBox;
    }

    window.initMessages = function () {
        window.chatNetwork.messagesUpdate();
    }

    eindow.initMinimized = function () {
        window.minimized = localStorage.getItem(window.minimizedKey) === "true";
    }

    window.initSide = function () {
        window.chatSide = localStorage.getItem(window.sideKey);
    }

    window.initUserId = function () {
        window.userid = localStorage.getItem(window.userIdKey);
    }

    window.saveMinimized = function () {
        localStorage.setItem(window.minimizedKey, window.minimized.toString());
    }

    window.saveChatSide = function () {
        localStorage.setItem(window.sideKey, window.chatSide);
    }

    window.saveUserId = function () {
        if (window.userid) {
            localStorage.setItem(window.userIdKey, window.userid);
        }
    }

    window.initChat = function (header, userAuth, side, minimise, botName, url, cssClass, dragEnable, showTime, network) {
        var chat;
        var authForm;

        window.urlAPI = url;
        window.time = showTime;

        if (botName) {
            window.answer.sender = botName;
        }

        if (localStorage.getItem(window.sideKey)) {
            window.initSide();
        } else if (side) {
            window.chatSide = side;
        }

        window.addStyle(window.chatSide);

        if (minimise) {
            window.initMinimized();
            window.addEventListener("beforeunload", window.saveMinimized);
        }

        if (network) {
            window.chatNetwork = network;
        }

        chat = initChatBox(header, minimise, cssClass, dragEnable);
        if (!localStorage.getItem(window.userIdKey)) {
            if (userAuth) {
                authForm = window.initAutorization();
                chat.querySelector("#" + window.chatContentClass).appendChild(authForm);
                authForm.querySelector("#" + window.authFormClass).addEventListener("submit", window.chatNetwork.authorize);
            } else {
                window.initContent(chat.querySelector("#" + window.chatContentClass));
                window.username = window.messageSender;
            }
        } else {
            window.initUserId();
            network.getInfo();
            window.initContent(chat.querySelector("#" + window.chatContentClass));
            window.initMessages();
        }

        window.setInterval(network.messagesUpdate, window.messagesUpdateTimeout);

        window.document.body.appendChild(chat);
        window.printItems(window.messages);

        window.addEventListener("beforeunload", window.saveUserId);
        window.addEventListener("beforeunload", window.saveChatSide);
    }
})();