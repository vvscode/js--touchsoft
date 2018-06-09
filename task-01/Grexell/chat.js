

(function Chat() {
    window.messages = [];
    window.minimized = true;

    window.right = "right";
    window.left = "left";
    window.chatSide = right;
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

    window.username = messageSender;
    window.userid;
    window.urlAPI;
    window.time = true;

    window.initChat;

    window.answer = {
        insertionRegExp: /\[.*\]/,
        pattern: "Ответ на \"{[]}\"",
        sender: "Бот",
        delay: 15000
    };

    window.messagesUpdateTimeout = 10000;

    window.XHRNetwork;
    window.fetchNetwork;
    window.chatNetwork = fetchNetwork;

    window.printItems = function (items, clear) {
        var history = window.document.getElementsByClassName(messageHistoryClass)[0];
        var i;

        if (clear) {
            history.innerHTML = "";
        }

        for (i = 0; i < items.length; i += 1) {
            history.appendChild(formatItem(items[i]));
        }
    }

    function authoriseXHR() {
        var request = new XMLHttpRequest();
        request.open("POST", urlAPI + usersPath + suffix, true);

        request.send(JSON.stringify({
            username: username
        }));

        request.onreadystatechange = function () {
            if (this.readyState !== 4) return;
            userid = JSON.parse(this.responseText).name;
        }

        return false;
    }

    function getUserInfoXHR() {
        var request = new XMLHttpRequest();

        request.open("GET", urlAPI + usersPath + "/" + userid + "/" + suffix, true);
        request.send();

        request.onreadystatechange = function () {
            if (this.readyState !== 4) return;
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

        request.onreadystatechange = function () {
            if (this.readyState !== 4) return;

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

    window.XHRNetwork = {
        authorize: authoriseXHR,
        getInfo: getUserInfoXHR,
        sendMessage: sendMessageXHR,
        messagesUpdate: messageUpdateXHR
    }

    function authoriseFetch() {
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

                    printItems(messages, clear);
                }
            });
    }

    window.fetchNetwork = {
        authorize: authoriseFetch,
        getInfo: getUserInfoFetch,
        sendMessage: sendMessageFetch,
        messagesUpdate: messageUpdateFetch
    }

    window.HistoryItem = function (date, sender, text) {
        this.date = date.getHours().toString().concat(dateDelimeter, date.getMinutes().toString());
        this.sender = sender;
        this.text = text;
    }

    window.toggleMinimize = function () {
        var content = window.document.getElementById(chatContentClass);
        content.classList.toggle(hiddenClass);
        minimized = content.classList.contains(hiddenClass);
    }

    window.formatItem = function (item) {
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

    window.generateAnswer = function (message) {
        return answer.pattern.replace(answer.insertionRegExp, message.toUpperCase());
    }

    window.sendAnswer = function (item) {
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

    window.sendMessage = function (event) {
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

        messageHistory.classList.add(messageHistoryClass);

        return messageHistory;
    }

    window.initChatForm = function () {
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

    window.initContent = function (chatContent) {
        var form = initChatForm();
        form.onsubmit = sendMessage;

        chatContent.appendChild(initChatContent());
        chatContent.appendChild(form);
    }

    window.authUser = function (event) {
        initContent(window.document.querySelector("#" + chatContentClass));

        window.document.querySelector("#" + authFormClass).classList.add(hiddenClass);

        username = this.username.value;

        event.preventDefault();
    }

    window.initAutorization = function () {
        var authorization = window.document.createElement("div");

        authorization.innerHTML = "<form id='" + authFormClass + "'><input type='text' name='username'><button>Authorize</button></form>";
        authorization.querySelector("#" + authFormClass).addEventListener("submit", authUser);

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
            moveToPoint(element, e.pageX - shiftX, e.pageY - shiftY);
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
            (minimise ? ('<button id="' + minimizeButtonClass + '">-</button>\n') : "") +
            "</div>" +
            "<div id='" + chatContentClass + "'>" +
            "</div>";

        if (minimise) {
            if (minimized) {
                chatBox.querySelector("#" + chatContentClass).classList.add(hiddenClass);
            }
            chatBox.querySelector("#" + minimizeButtonClass).onclick = toggleMinimize;
        }

        if (dragEnable) {
            chatBox.classList.add(dragClass);
            chatBox.addEventListener("mousedown", dragItem);
        }

        return chatBox;
    }

    window.initMessages = function () {
        chatNetwork.messagesUpdate();
    }

    eindow.initMinimized = function () {
        minimized = localStorage.getItem(minimizedKey) === "true";
    }

    window.initSide = function () {
        chatSide = localStorage.getItem(sideKey);
    }

    window.initUserId = function () {
        userid = localStorage.getItem(userIdKey);
    }

    window.saveMinimized = function () {
        localStorage.setItem(minimizedKey, minimized.toString());
    }

    window.saveChatSide = function () {
        localStorage.setItem(sideKey, chatSide);
    }

    window.saveUserId = function () {
        if (userid) {
            localStorage.setItem(userIdKey, userid);
        }
    }

    window.initChat = function (header, userAuth, side, minimise, botName, url, cssClass, dragEnable, showTime, network) {
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
})();