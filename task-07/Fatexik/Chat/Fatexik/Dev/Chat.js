/* exported sendMessage showFeedback hideFeedback setConfig */
/* global Promise */
/* eslint no-use-before-define: ["error", { "functions": false }] */

var userConfig;
var Module;

function setConfig(config) {
    userConfig = config;
    Module(userConfig);
}

Module = (function chat(userConfigObj) {
    var configObj = {
        title: "Chat",
        name: "Bot",
        url: "https://touchsoft-fatexik.firebaseio.com/",
        CSS: "https://rawgit.com/fatexik/js--touchsoft/master/task-07/Fatexik/Chat/Fatexik/CSS/styles.css",
        positionLeft: false,
        allowMinimize: true,
        drag: true,
        requireName: true,
        showTime: true,
        network: "XHR",
        userName: "",
        collapsed: false,
        updates: "longPooling"
    };

    var FINAL_STATE_RESPONSE = 4;
    var OK_RESPONSE_STATUS = 200;
    var transferObject;
    var userId = localStorage.getItem("userId");
    var xhrObjectMessages;
    var xhrObjectCommands;
    var timeUpdateConnection = 60000;
    var timeUpdateCommands = 5000;
    var colorChat;

    function sendFetchRequest(methodRequest, config, nameConfig, bodyObject) {
        return fetch(configObj.url.concat("users/").concat(userId).concat(config).concat(nameConfig).concat(".json"), {
            method: methodRequest,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyObject)
        })
    }

    function sendXHRRequest(methodRequest, config, nameConfig, bodyObject) {
        var xhr = new XMLHttpRequest();
        xhr.open(methodRequest, configObj.url.concat("users/").concat(userId).concat(config).concat(nameConfig).concat(".json"));
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(bodyObject));
        return xhr;
    }


    function XHRObject() {
    }

    XHRObject.prototype.getMessages = function getMessages() {
        var objMessages;
        var messages;
        var xhrPromise = new Promise(function sendRequest(resolve) {
            sendXHRRequest("GET", "/messages", "").onreadystatechange = function responseReady() {
                if (this.status === OK_RESPONSE_STATUS && this.readyState === FINAL_STATE_RESPONSE) {
                    objMessages = JSON.parse(this.response);
                    messages = [];
                    if (objMessages) {
                        messages = Object.keys(objMessages).map(function createNewArray(value) {
                            return objMessages[value]
                        });
                    }
                    resolve(messages);
                }
            }
        });
        return xhrPromise;
    };


    XHRObject.prototype.setUnreadMessage = function setUnreadMessage() {
        var isTrue = true;
        sendXHRRequest("PUT", "/unreadMessage", "", isTrue).onreadystatechange = function responseReady() {
            if (this.status !== OK_RESPONSE_STATUS && this.readyState === FINAL_STATE_RESPONSE) {
                throw Error("Unread message not set")
            }
        };
        return this;
    };

    XHRObject.prototype.sendMessage = function sendMesage(message) {
        sendXHRRequest("POST", "/messages", "", message).onreadystatechange = function responseReady() {
            if (this.status !== OK_RESPONSE_STATUS && this.readyState === FINAL_STATE_RESPONSE) {
                throw new Error("Message not send");
            }
        };
        return this;
    };

    XHRObject.prototype.sendResponseCommand = function sendResponse(commandId, message) {
        sendXHRRequest("PUT", "/commands/", commandId, message).onreadystatechange = function responseReady() {
            if (this.status !== OK_RESPONSE_STATUS && this.readyState === FINAL_STATE_RESPONSE) {
                throw new Error("Message not send");
            }
        };
        return this;
    };

    XHRObject.prototype.setTimeActivity = function setTimeActivity() {
        var currentTime = new Date().getTime();
        sendXHRRequest("PUT", "/activityTime", "", currentTime).onreadystatechange = function responseReady() {
            if (this.status !== OK_RESPONSE_STATUS && this.readyState === FINAL_STATE_RESPONSE) {
                throw new Error("Time activity not set");
            }
        };
        return this;
    };

    XHRObject.prototype.getCommands = function getCommands() {
        var objCommands;
        var promise = new Promise(function sendReques(resolve) {
            sendXHRRequest("GET", "/commands", "").onreadystatechange = function onReady() {
                if (this.status === OK_RESPONSE_STATUS && this.readyState === FINAL_STATE_RESPONSE) {
                    objCommands = JSON.parse(this.response);
                    resolve(objCommands);
                }
            }
        });
        return promise;
    };

    XHRObject.prototype.getUserConfig = function getUserConfig() {
        var xhrPromise = new Promise(function sendRequest(resolve) {
            var responseObj;
            sendXHRRequest("GET", "/chatConfig", "").onreadystatechange = function responseReady() {
                if (this.status === OK_RESPONSE_STATUS && this.readyState === FINAL_STATE_RESPONSE) {
                    responseObj = JSON.parse(this.response);
                    configObj = responseObj;
                    resolve(responseObj);
                }
            }
        });
        return xhrPromise;
    };


    XHRObject.prototype.createNewUser = function createNewUser() {
        var xhrPromise = new Promise(function sendRequest(resolve) {
            var xhr = new XMLHttpRequest();
            var response;
            xhr.open('POST', configObj.url.concat("users.json"));
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(
                {
                    chatConfig: configObj,
                    messages: "",
                    commands:""
                })
            );
            xhr.onreadystatechange = function responseReady() {
                if (this.status === OK_RESPONSE_STATUS && this.readyState === FINAL_STATE_RESPONSE) {
                    response = JSON.parse(this.response);
                    localStorage.setItem("userId", response.name);
                    resolve(response);
                }
            }
        });
        return xhrPromise;
    };

    XHRObject.prototype.getLongPooling = function getLongPooling(path) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", configObj.url.concat("users/").concat(userId).concat("/".concat(path).concat(".json")));
        xhr.setRequestHeader("Accept", "text/event-stream");
        xhr.send();
        return xhr;
    };

    XHRObject.prototype.getConfig = function getConfig(nameConfig) {
        var xhrPromise = new Promise(function sendRequest(resolve) {
            sendXHRRequest("GET", "/chatConfig/", nameConfig).onreadystatechange = function responseReady() {
                if (this.status === OK_RESPONSE_STATUS && this.readyState === FINAL_STATE_RESPONSE) {
                    resolve(JSON.parse(this.response));
                }
            }
        });
        return xhrPromise;
    };

    XHRObject.prototype.setConfig = function setConf(nameConfig, valueConfig) {
        var xhrPromise = new Promise(function sendRequest(resolve) {
            sendXHRRequest("PUT", "/chatConfig/", nameConfig, valueConfig).onreadystatechange = function requestReady() {
                if (this.status === 200 && this.readyState === 4) {
                    resolve(true);
                }
            }
        });
        return xhrPromise;
    };


    function FetchObject() {
    }

    FetchObject.prototype.getMessages = function getMessages() {
        return sendFetchRequest("GET", "/messages", "")
            .then(function responseReady(response) {
                return (response.json()
                    .then(function resolveResponse(responseObj) {
                        var arrayMessages = [];
                        if (responseObj) {
                            arrayMessages = Object.keys(responseObj).map(function createNewArray(value) {
                                return responseObj[value]
                            });
                        }
                        return arrayMessages;
                    }))
            })
    };

    FetchObject.prototype.getCommands = function getCommands() {
        return sendFetchRequest("GET", '/commands', "").then(function responseReady(response) {
            return response.json().then();
        })
    };

    FetchObject.prototype.sendMessage = function sendMsg(message) {
        sendFetchRequest("POST", "/messages", "", message)
            .then(function responseReady(response) {
                response.json()
            });
        return this;
    };

    FetchObject.prototype.setTimeActivity = function setTime() {
        var currentTime = new Date().getTime();
        sendFetchRequest("PUT", "/activityTime", "", currentTime)
            .then(function responseReady(response) {
                response.json()
            });
        return this;
    };

    FetchObject.prototype.setUnreadMessage = function setUnread() {
        var unreadValue = true;
        sendFetchRequest("PUT", "/unreadMessage", "", unreadValue)
            .then(function responseReady(response) {
                response.json()
            });
        return this;
    };

    FetchObject.prototype.createNewUser = function create() {
        return fetch(configObj.url.concat("users.json"), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    chatConfig: configObj,
                    messages: "",
                    commands: ""
                })
        })
            .then(function responseReady(response) {
                return response.json()
                    .then(function resolveResponse(responseObj) {
                        localStorage.setItem("userId", responseObj.name);
                        return responseObj;
                    })
            })
    };

    FetchObject.prototype.getUserConfig = function getUserConfig() {
        return sendFetchRequest("GET", "/chatConfig", "")
            .then(function responseReady(response) {
                return response.json()
                    .then(function resolveResponseObj(responseObj) {
                        configObj = responseObj;
                        return responseObj;
                    })
            });
    };

    FetchObject.prototype.getConfig = function getConfig(nameConfig) {
        return sendFetchRequest("GET", "/chatConfig/", nameConfig)
            .then(function responseReady(response) {
                return response.json()
                    .then(function resolveResponse(responseObj) {
                        return responseObj;
                    })
            })
    };

    FetchObject.prototype.setConfig = function setConf(nameConfig, valueConfig) {
        var config = {};
        config[nameConfig] = valueConfig;
        return sendFetchRequest("PUT", "/chatConfig/", nameConfig, valueConfig)
            .then(function responseReady(response) {
                return response.json()
                    .then(function resolveStatus() {
                        return true;
                    })
            })
    };

    function generateCollapsedFeedback() {
        var collapsedFeedback = document.createElement("div");
        collapsedFeedback.id = "collapsedFeedback";
        collapsedFeedback.className = "collapsedFeedback";
        collapsedFeedback.innerHTML = '<div class="dragDropCollapsed" id="dragdrop"></div><p class="chatName" id="chatName"></p><form><input type="text" id="messageArea"> <input type="button" id="sendMessageButton" value="Send Message"> <input type="button" value="<<" id="maximize"> <span class="nameNote"><p>User Name</p></span> <input type="text" id="userName"></form>';
        return collapsedFeedback;
    }

    function checkTime(time) {
        var currentTime = time;
        if (currentTime < 10) {
            currentTime = "0".concat(time);
        }
        return currentTime;
    }

    function generateFeedback() {
        var container = document.createElement("container");
        container.id = "feedBack";
        container.className = "feedBack";
        container.innerHTML = '<div class="dragDrop" id="dragdrop"></div><p class="chatName" id="chatName">Chat</p><form><input type="button" value=">>" class="collapse" id="collapse"><p><textarea id="messageHistory" rows="8" cols="30" name="text" disabled="disabled"></textarea></p><textarea id="userName" rows="1" cols="10" name="text"></textarea><span class="nameNote">User Name</span><p></p><textarea id="messageArea" rows="3" cols="30" name="text"></textarea><br><input type="button" id="sendMessageButton" value="Send Message"></form>';
        return container;
    }

    function updateMessageList() {
        var messageHistory = document.getElementById("messageHistory");
        if (messageHistory) {
            transferObject.getMessages().then(
                function updateList(value) {
                    messageHistory.value = value.join(" ");
                }
            )
        }
    }

    function createMessage() {
        var date = new Date();
        var messageArea = document.getElementById("messageArea");
        var minute = checkTime(date.getMinutes());
        var hour = checkTime(date.getHours());
        var message;
        if (configObj.showTime) {
            message = "\n".concat([hour, minute].join(":").concat(" ".concat(configObj.userName).concat(" ").concat(messageArea.value)));
        }
        else {
            message = "\n".concat(" ".concat(configObj.userName).concat(" ").concat(messageArea.value));
        }
        return message;
    }

    function sendMessage() {
        var messageArea = document.getElementById("messageArea");
        var messageHistory;
        var message;
        var promise;
        transferObject.setConfig("userName", configObj.userName);
        if (configObj.updates !== "longPooling") {
            promise = new Promise(function getMessages(resolve) {
                resolve(transferObject.getMessages());
            });
            promise.then(function updateMessageHistory(value) {
                messageHistory = value;
                message = createMessage();
                messageHistory.push(message);
                if (document.getElementById("messageHistory")) {
                    document.getElementById("messageHistory").value = messageHistory.join(" ");
                }
                transferObject.sendMessage(message).setTimeActivity().setUnreadMessage();
                messageArea.value = "";
            })
        }
        else {
            message = createMessage();
            transferObject.sendMessage(message).setTimeActivity().setUnreadMessage();
            messageArea.value = "";
        }
    }

    function DragDrop(elem) {
        var dragDropElem = document.getElementById("dragdrop");
        dragDropElem.onmouseenter = function setNewCursor() {
            dragDropElem.style.cursor = "move";
        };

        function getCoords(element) {
            var box = element.getBoundingClientRect();
            return {
                top: box.top + window.pageYOffset,
                left: box.left + window.pageXOffset
            };
        }

        dragDropElem.addEventListener("mousedown", function findCoordsCursor(event) {
            var coords = getCoords(elem);
            var shiftX = event.pageX - coords.left;
            var shiftY = event.pageY - coords.top;

            function move(element) {
                elem.style.left = element.clientX - shiftX + 'px';
                elem.style.top = element.clientY - shiftY + 'px';
            }

            function mouseMove(e) {
                move(e);
            }

            document.addEventListener("mousemove", mouseMove);
            elem.addEventListener("mouseup", function dragEnd() {
                document.removeEventListener("mousemove", mouseMove);
                elem.removeEventListener("mouseup", dragEnd);
            });
        })

    }

    function requireName() {
        var buttonMessage = document.getElementById("sendMessageButton");
        var userNameArea = document.getElementById("userName");
        buttonMessage.disabled = false;
        if (configObj.requireName) {
            if (!userNameArea.value) {
                buttonMessage.disabled = true;
            }
            userNameArea.onkeyup = function enterName() {
                if (userNameArea.value) {
                    buttonMessage.disabled = false;
                    configObj.userName = userNameArea.value;
                } else {
                    buttonMessage.disabled = true;
                    configObj.userName = null;
                }
            }
        } else {
            userNameArea.value = configObj.userName;
            userNameArea.onkeyup = function enterName() {
                configObj.userName = userNameArea.value || "You";
            }
        }
    }

    function notMinimize() {
        var btnCollapse = document.getElementById("collapse");
        btnCollapse.disabled = true;
    }

    function setPositionLeft(elem) {
        elem.style.left = 5 + "vw";
    }

    function chekIp() {
        var xhr = new XMLHttpRequest();
        var promise;
        var reg = /"ip": "(.+)"/;
        xhr.open("GET", "http://ipinfo.io/?callback=callback");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();
        promise = new Promise(function onReady(resolve) {
            xhr.onreadystatechange = function onReadyResponse() {
                if (this.status === 200 && this.readyState === 4) {
                    resolve(this.response.match(reg)[1]);
                }
            }
        });
        return promise;
    }

    function setColor(color) {
        var feedBackElement;
        if(document.getElementById("feedBack")){
            feedBackElement = document.getElementById("feedBack");
        }
        else{
            feedBackElement = document.getElementById("collapsedFeedback");
        }
        feedBackElement.style.backgroundColor = color;
        colorChat = color;
    }


    function executeCommand(commandObj, commandId) {
        var args;
        var command = commandObj.message.match(/\$\$(.+)\$\$/)[1];
        if (command === "Get Ip") {
            chekIp().then(function ipReceived(ip) {
                commandObj.status = ip;
                transferObject.sendResponseCommand(commandId, commandObj);
            })
        }
        else {
            args = commandObj.message.match(/\?(.+)\?/);
            setColor(args[1]);
            commandObj.status = "Color set";
            transferObject.sendResponseCommand(commandId, commandObj);
        }
    }


    function updateCommands() {
        transferObject.getCommands().then(function listCommandsReceived(objListCommands) {
            if (objListCommands) {
                Object.keys(objListCommands).forEach(function processingCommand(id) {
                    if (objListCommands[id].status === "sent") {
                        executeCommand(objListCommands[id], id);
                    }
                })
            }
        })
    }

    function processingDataObjCommand(dataObj,newConnection) {
        var data;
        var commandId;
        if (dataObj) {
            data = dataObj.data;
            if (newConnection) {
                Object.keys(data).forEach(function processingCommand(id) {
                    if (data[id].status === "sent") {
                        executeCommand(data[id], id);
                    }
                })
            }
            else {
                commandId = dataObj.path.split("/")[1];
                executeCommand(data, commandId);
            }
            return false;
        }
        return true;
    }


    function longPooligCommands() {
        var command;
        var oldCommand;
        var dataObj;
        var newConnection = true;
        if (xhrObjectCommands) {
            xhrObjectCommands.abort();
        }
        xhrObjectCommands = transferObject.getLongPooling("commands");
        xhrObjectCommands.onreadystatechange = function onReady() {
            if (this.status === OK_RESPONSE_STATUS) {
                command = this.responseText.replace(oldCommand, "");
                oldCommand = this.responseText;
                dataObj = JSON.parse(command.match(/\{.+\}/));
                newConnection = processingDataObjCommand(dataObj,newConnection);
            }
        }
    }


    function processingDataObjMessages(dataObj,newConnection,messageHistoryElem) {
        var messages;
        if (dataObj) {
            messages = Object.keys(dataObj.data).map(function createNewArray(value) {
                return dataObj.data[value]
            });
            if (!newConnection) {
                messageHistoryElem.value = messageHistoryElem.value.concat(messages.join(""));
            }
            else {
                messageHistoryElem.value = messages.join("");
            }
            return false;
        }
        return true;
    }

    function longPoolingMessage() {
        var messageHistoryElem;
        var message;
        var oldMessage;
        var dataObj;
        var newConnection = true;
        if (xhrObjectMessages) {
            xhrObjectMessages.abort();
        }
        xhrObjectMessages = transferObject.getLongPooling("messages");
        xhrObjectMessages.onreadystatechange = function onReady() {
            messageHistoryElem = document.getElementById("messageHistory");
            if (messageHistoryElem) {
                if (this.status === OK_RESPONSE_STATUS) {
                    message = this.responseText.replace(oldMessage, "");
                    oldMessage = this.responseText;
                    dataObj = JSON.parse(message.match(/\{.+\}/));
                    newConnection = processingDataObjMessages(dataObj,newConnection,messageHistoryElem);
                }
            }
        };
    }

    function createLongPoolingConnection() {
        var elem;
        elem = document.getElementById("messageHistory");
        if (configObj.updates !== "longPooling") {
            transferObject.getMessages().then(
                function createMessageHistory(value) {
                    elem.value = value.join(" ");
                }
            )
        }
        else {
            longPoolingMessage();
            longPooligCommands();
        }
    }

    function showFeedback() {
        var bodyElement = document.body;
        var feedback = generateFeedback();
        var changeElem = document.getElementById("collapsedFeedback");
        var userName;
        bodyElement.replaceChild(feedback, changeElem);
        feedback.style.backgroundColor = colorChat;
        if (configObj.drag) {
            DragDrop(feedback);
        }
        if (!configObj.allowMinimize) {
            notMinimize();
        }
        if (configObj.positionLeft) {
            setPositionLeft(feedback);
        }
        userName = document.getElementById("userName");
        userName.value = configObj.userName;
        requireName();
        document.getElementById('chatName').innerText = configObj.title;
        transferObject.setConfig("collapsed", false);
        createLongPoolingConnection();
        document.getElementById("collapse").addEventListener("click", hideFeedback);
        document.getElementById("sendMessageButton").addEventListener("click", sendMessage);
    }

    function hideFeedback() {
        var bodyElement = document.body;
        var changeElem = document.getElementById("feedBack");
        var collapsedFeedback = generateCollapsedFeedback();
        var userName;
        bodyElement.replaceChild(collapsedFeedback, changeElem);
        collapsedFeedback.style.backgroundColor = colorChat;
        userName = document.getElementById("userName");
        userName.value = configObj.userName;
        document.getElementById('chatName').innerText = configObj.title;
        if (configObj.drag) {
            DragDrop(collapsedFeedback);
        }
        if (configObj.positionLeft) {
            setPositionLeft(collapsedFeedback);
        }
        requireName();
        transferObject.setConfig("collapsed", true);
        document.getElementById("sendMessageButton").addEventListener("click", sendMessage);
        document.getElementById("maximize").addEventListener("click", showFeedback);
    }


    function createFeedback() {
        var bodyElement = document.body;
        var feedback = generateFeedback();
        var userName;
        bodyElement.appendChild(feedback);
        userName = document.getElementById("userName");
        if (configObj.drag) {
            DragDrop(feedback);
        }
        if (!configObj.allowMinimize) {
            notMinimize();
        }
        if (configObj.positionLeft) {
            setPositionLeft(feedback);
        }
        userName.value = configObj.userName;
        requireName();
        document.getElementById('chatName').innerText = configObj.title;
        document.getElementById("collapse").addEventListener("click", hideFeedback);
        document.getElementById("sendMessageButton").addEventListener("click", sendMessage);
        createLongPoolingConnection();
    }

    function setStyle() {
        var titleElem = document.head;
        var styleElem = document.createElement("link");
        styleElem.setAttribute("rel", "stylesheet");
        styleElem.setAttribute("href", configObj.CSS);
        styleElem.setAttribute("type", "text/css");
        styleElem.setAttribute("media", "screen");
        titleElem.appendChild(styleElem);
    }

    function createCollapsedFeedback() {
        var bodyElement = document.body;
        var collapsedFeedback = generateCollapsedFeedback();
        var userName;
        bodyElement.appendChild(collapsedFeedback);
        userName = document.getElementById("userName");
        document.getElementById('chatName').innerText = configObj.title;
        if (configObj.drag) {
            DragDrop(collapsedFeedback);
        }
        if (configObj.positionLeft) {
            setPositionLeft(collapsedFeedback);
        }
        userName.value = configObj.userName;
        requireName();
        document.getElementById("sendMessageButton").addEventListener("click", sendMessage);
        document.getElementById("maximize").addEventListener("click", showFeedback);
    }
    
    function testUserConfig() {
        if (!localStorage.getItem("userId")) {
            transferObject.createNewUser().then(function sendNewUser() {
                userId = localStorage.getItem("userId");
                transferObject.getConfig("collapsed").then(function getCollapsedConfig(value) {
                    if (value === false) {
                        createFeedback();
                    } else {
                        createCollapsedFeedback();
                    }
                })
            });
        }
        else {
            transferObject.getUserConfig().then(function getConfigs(value) {
                configObj = value;
                transferObject.getConfig("collapsed").then(function getCollapsedConfig(collapsed) {
                    if (collapsed === false) {
                        createFeedback();
                    } else {
                        createCollapsedFeedback();
                    }
                })
            })
        }
    }


    function createNewDataBaseObj() {
        if (configObj.network === "XHR") {
            transferObject = new XHRObject();
        }
        else {
            transferObject = new FetchObject();
        }
    }

    function checkWindow() {
        var timeUpdateChat = 10000;
        createNewDataBaseObj();
        testUserConfig();
        if (configObj.updates === "longPooling") {
            setInterval(longPoolingMessage, timeUpdateConnection);
            setInterval(longPooligCommands, timeUpdateConnection);
        }
        else {
            setInterval(updateMessageList, timeUpdateChat);
            setInterval(updateCommands, timeUpdateCommands);
        }
    }

    setStyle();

    window.onload = function check() {
        if (userConfigObj) {
            configObj = userConfigObj;
        }
        checkWindow();
    };

    return ({
        timeCheck: checkTime
    })
});
