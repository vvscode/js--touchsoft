'use strict';

var config = {
    timeOfBotResponse: 15000,
    pathToHtmlFile: "https://cdn.rawgit.com/kozel-stas/js--touchsoft/840b08a8/task-01/task/kozel-stas/ChatComponent.html",
    pathToCssFile: "https://cdn.rawgit.com/kozel-stas/js--touchsoft/89c1d33a/task-01/task/skozel/StyleChatComponent.css",
    isMin: false,
    title: "Chat",
    botName: "Bot",
    botAnswer: "Ответ на \"",
    databaseURL: "https://sstas-f9ec5.firebaseio.com/chats",
    HEADER_JSON: {
        Accept: "application/json",
        "Content-Type": "application/json"
    },
    DOMVariables: {
        collapseButton: {
            className: "collapse_button"
        },
        collapseButtonMin: {
            className: "root_for_collapse_button"
        },
        textArea: {
            className: "textArea"
        },
        textAreaMin: {
            className: "textArea_min"
        },
        chatComponentRoot: {
            className: "chat_component_root"
        },
        chatComponentRootMin: {
            className: "chat_min_component_root"
        },
        sendButton: {
            className: "input_area_component_send_button"
        },
        sendButtonMin: {
            className: "input_area_component_send_button_min"
        },
        output: {
            className: "outputArea"
        },
        chatTitle: {
            className: "chat_component_title"
        }
    }
};

var chat;

/* exported xhrRequest */
function fetchRequst(path, method, data, headers) {
    return fetch(path, {
        method: method,
        headers: headers,
        body: data
    }).then(function f(response) {
        return response.status !== 200 ? undefined : response.json();
    });
}

/* exported xhrRequest */
function xhrRequest(path, method, data, headers) {
    return new Promise(function fun(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, path);

        if (headers !== "") {
            Object.keys(headers).forEach(function f(key) {
                xhr.setRequestHeader(key, headers[key]);
            });
        }
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText);
            }
        };

        xhr.onerror = function () {
            reject(xhr.statusText);
        };
        xhr.send(data);
    }).then(function (dataForParse) {
        return JSON.parse(dataForParse);
    });
}

function Message(object, name, message, time, answered, origin) {
    this.object = object;
    this.time = time;
    this.name = name;
    this.message = message;
    this.answered = answered || false;
    this.origin = origin;
}

Message.prototype.saveMessage = function f() {
    var that = this;
    var json = JSON.stringify(this, function f(key, value) {
        if (key != "object" && key != "origin" && key != "id") return value;
    });
    this.object.config.makeRequest(this.object.config.databaseURL + "/" + this.object.user.userId + ".json", "POST", json, this.object.config.HEADER_JSON).then(
        function f(result) {
            if (that.answered == false) {
                that.id = result.name;
            } else {
                that.origin.answered = true;
                json = JSON.stringify(that.origin, function f(key, value) {
                    if (key != "object" && key != "origin" && key != "id") return value;
                });
                that.object.config.makeRequest(that.object.config.databaseURL + "/" + that.object.user.userId + "/" + that.origin.id + ".json", "PUT", json, that.object.config.HEADER_JSON)
            }
        }
    );
    return this;
};

Message.prototype.sendMessage = function f() {
    var messageLine = "";
    if (this.object.config.showDateTime) {
        messageLine += "[" + this.time.getHours().toString() + ":" + this.time.getMinutes().toString() + ":" + this.time.getSeconds().toString() + "]";
    }
    messageLine += this.name + ": ";
    messageLine += this.message;
    var div = document.createElement("div");
    div.classList.toggle("message_block");
    div.innerText = messageLine;
    this.object.config.DOMVariables.output.elemDOM.appendChild(div);
    return this;
};

Message.prototype.answer = function f() {
    var that = this;

    var sendBotMessage = function fun() {
        var messageBot = new Message(
            that.object,
            that.object.config.botName,
            that.object.config.botAnswer + that.message + "\"",
            new Date(),
            true,
            that
        );
        messageBot.sendMessage();
        messageBot.saveMessage();
    };
    if (!that.answered) {
        setTimeout(
            sendBotMessage,
            that.object.config.timeOfBotResponse
        );
    }
};

function User(name, userId) {
    if (name == null) {
        this.name = "Вы";
    } else {
        this.name = name;
    }
    this.userId = userId;
}

//////////////////////////////////////////////////////

function Chat(globalConfig) {
    this.config = config;
    this.globalConfig = globalConfig;
    chat = this;
    this.configurateChat();
}

Chat.prototype.configurateChat = function f() {
    this.setTitle(this.globalConfig.title);
    this.setAllowMinimize(this.globalConfig.allowMinimize);
    this.setPosition(this.globalConfig.position);
    this.setCssClass(this.globalConfig.cssClass);
    this.setRequestMethod(this.globalConfig.requests);
    this.requireName(this.globalConfig.requireName);
    this.setBotName(this.globalConfig.botName);
    this.setShowDateTime(this.globalConfig.showDateTime);
    this.setAllowDrag(this.globalConfig.allowDrag);
    this.setPathToDatabase(this.globalConfig.chatUrl);

    this.addCSS();
    this.getHTML();

};//

Chat.prototype.setShowDateTime = function f(param) {
    if (param != null)
        this.config.showDateTime = param;
    else this.config.showDateTime = true;
};//

Chat.prototype.setAllowDrag = function f(param) {
    if (param != null)
        this.config.allowDrag = param;
    else this.config.allowDrag = true;
};

Chat.prototype.setPathToDatabase = function f(param) {
    this.config.pathToDatabase = param;
};//

Chat.prototype.addCSS = function () {
    var link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", this.config.pathToCssFile);
    document.head.appendChild(link);
};//

Chat.prototype.getHTML = function () {
    var refToParentObj = this;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", this.config.pathToHtmlFile, true);
    xhr.onreadystatechange = function () {
        if (this.readyState !== 4) {
            return;
        }
        if (this.status !== 200) {
            return;
        }
        refToParentObj.includeHTML(this.response);
        refToParentObj.configurate();
    };
    xhr.send();
    return xhr.response;
};//

Chat.prototype.configurate = function f() {
    this.getDOMElem(this.config.DOMVariables);
    this.trigStatusChat();
    this.configTitleAndPosition();

    this.user = this.loadOrCreateUser();
    this.initListeners();
    this.loadAllMessage();
};//

Chat.prototype.loadAllMessage = function f() {
    var that = this;
    this.config.makeRequest(this.config.databaseURL + "/" + this.user.userId + ".json", "GET", null, this.config.HEADER_JSON).then(function f(result) {
            for (var key in result) {
                var mes = result[key];
                console.log(mes.time);
                new Message(that, mes.name, mes.message, new Date(mes.time), mes.answered, null).sendMessage();
            }
        }
    );
};

Chat.prototype.initListeners = function f() {
    this.config.DOMVariables.collapseButton.elemDOM.addEventListener("click", () => {
            if (this.config.allowMinimize) {
                this.config.isMin = !this.config.isMin;
                this.trigStatusChat();
            }
        }
    );
    this.config.DOMVariables.collapseButtonMin.elemDOM.addEventListener("click", () => {
        if (this.config.allowMinimize) {
            this.config.isMin = !this.config.isMin;
            this.trigStatusChat();
        }
    });
    this.config.DOMVariables.sendButton.elemDOM.addEventListener("click", () => {
        new Message(this, this.user.name, this.config.DOMVariables.textArea.elemDOM.value, new Date(), false).sendMessage().saveMessage().answer();
        this.config.DOMVariables.textArea.elemDOM.value = "";
    });
    this.config.DOMVariables.sendButtonMin.elemDOM.addEventListener("click", () => {
        this.config.isMin = !this.config.isMin;
        this.trigStatusChat();
        new Message(this, this.user.name, this.config.DOMVariables.textAreaMin.elemDOM.value, new Date(), false).sendMessage().saveMessage().answer();
        this.config.DOMVariables.textAreaMin.elemDOM.value = "";

    });
    window.addEventListener("beforeunload", () => {
        localStorage.setItem("isMin", this.config.isMin.toString());
        localStorage.setItem("userName", this.user.name.toString());
        localStorage.setItem("userId", this.user.userId.toString())
    });
};//

Chat.prototype.configTitleAndPosition = function f() {
    this.config.DOMVariables.chatTitle.elemDOM.innerText = this.config.title;
    if (this.config.position == 'left') {
        this.config.DOMVariables.chatComponentRoot.elemDOM.style.right = "59%";
    }
};//

Chat.prototype.trigStatusChat = function () {
    var root = this.config.DOMVariables.chatComponentRoot;
    var rootMin = this.config.DOMVariables.chatComponentRootMin;
    root.elemDOM.classList.remove("visibility");
    rootMin.elemDOM.classList.remove("visibility");
    if (this.config.allowMinimize) {
        if (this.config.isMin) {
            rootMin.elemDOM.classList.toggle("visibility");
        } else {
            root.elemDOM.classList.toggle("visibility");
        }
    } else {
        root.elemDOM.classList.toggle("visibility");
    }
};//

Chat.prototype.includeHTML = function (elem) {
    var div = document.createElement("div");
    div.innerHTML = elem;
    document.body.appendChild(div);
    div.classList = this.config.cssClass;
};//

Chat.prototype.getDOMElem = function (DOMElem) {
    Object.keys(DOMElem).map(function (objectKey) {
        DOMElem[objectKey].elemDOM = document.getElementsByClassName(
            DOMElem[objectKey].className
        )[0];
    });
};//

Chat.prototype.setPosition = function (position) {
    this.config.position = position;
};//

Chat.prototype.requireName = function f(flag) {
    this.config.requireName = flag;
};//

Chat.prototype.setRequestMethod = function (type) {
    if (type === "fetch") {
        this.config.makeRequest = fetchRequst;
    } else if (type === "xhr") {
        this.config.makeRequest = xhrRequest;
    } else {
        this.config.makeRequest = fetchRequst;
    }
};//

Chat.prototype.setTitle = function f(newTitle) {
    if (newTitle != null) {
        this.config.title = newTitle;
    }
};//

Chat.prototype.setAllowMinimize = function f1(flag) {
    this.config.allowMinimize = flag;
    this.config.isMin = localStorage.getItem("isMin") !== 'false'
};//

Chat.prototype.setCssClass = function f(className) {
    this.config.cssClass = className;
};//

Chat.prototype.setBotName = function f(botName) {
    this.config.botName = botName;
};//

Chat.prototype.loadOrCreateUser = function f() {
    var userName = localStorage.getItem("userName");
    var userId = localStorage.getItem("userId");
    if (userName != null && userId != null) {
        return new User(userName, userId);
    }
    if (this.config.requireName) {
        var globalName = prompt("Введите имя.", "Вы");
        return new User(globalName, Math.floor(Math.random() * (10000000000 - 100000000 + 1)) + 100000000);
    } else return new User(null, Math.floor(Math.random() * (10000000000 - 100000000 + 1)) + 100000000)
};//