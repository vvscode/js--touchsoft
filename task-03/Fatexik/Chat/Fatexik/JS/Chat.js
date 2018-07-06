/* exported sendMessage showFeedback hideFeedback setConfig */
/* global Promise */

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
        CSS: "https://rawgit.com/fatexik/js--touchsoft/master/task-03/Fatexik/Chat/Fatexik/CSS/styles.css",
        positionLeft: false,
        allowMinimize: true,
        drag: true,
        requireName: true,
        showTime: true,
        network: "XHR",
        userName: "",
        collapsed: false
    };

    var FINAL_STATE_RESPONSE = 4;
    var OK_RESPONSE_STATUS = 200;
    var transferObject;
    var userId = localStorage.getItem("userId");


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
        var arrayMessages;
        var messages;
        var xhrPromise = new Promise(function sendRequest(resolve) {
            sendXHRRequest("GET", "/messages", "").onreadystatechange = function responseReady() {
                if (this.status === OK_RESPONSE_STATUS && this.readyState === FINAL_STATE_RESPONSE) {
                    arrayMessages = JSON.parse(this.response);
                    messages = "";
                    messages = Object.keys(arrayMessages).map(function createNewArray(value) {
                        return arrayMessages[value]
                    });
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

    XHRObject.prototype.setTimeActivity = function setTimeActivity() {
        var currentTime = new Date().getTime();
        sendXHRRequest("PUT", "/activityTime", "", currentTime).onreadystatechange = function responseReady() {
            if (this.status !== OK_RESPONSE_STATUS && this.readyState === FINAL_STATE_RESPONSE) {
                throw new Error("Time activity not set");
            }
        };
        return this;
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
                    messages: ""
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
                        var arrayMessages = Object.keys(responseObj).map(function createNewArray(value) {
                            return responseObj[value]
                        });
                        return arrayMessages;
                    }))
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
                    messages: ""
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
        collapsedFeedback.id = "elemShowFeedback";
        collapsedFeedback.className = "collapsedFeedback";
        collapsedFeedback.innerHTML =
            "<div class='dragDropCollapsed' id='dragdrop'></div> <p class='chatName' id='chatName'></p><form><input type='text' id='messageArea'><input type='button' id='sendMessageButton' value='Send Message'><input type='button' value='<<' id='maximize'>" +
            "<span class='nameNote'><p>User Name</p></span><input type='text' id='userName'></form>";
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
        container.innerHTML =
            "<div class='dragDrop' id='dragdrop'></div><p class='chatName' id='chatName'></p><form><input type='button' value='>>' class='collapse' id='collapse'><p><textarea id='messageHistory' rows=\"8\" cols=\"30\" name=\"text\" disabled>" +
            '</textarea></p><textarea id=\'userName\' rows="1" cols="10" name="text"></textarea><span class=\'nameNote\'>User Name</span>' +
            '</textarea></p><textarea id=\'messageArea\' rows="3" cols="30" name="text"></textarea>' +
            "<br></ber><input type='button' id='sendMessageButton' value='Send Message' disabled></form>";
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

    function sendMessage() {
        var messageArea = document.getElementById("messageArea");
        var messageHistory;
        var message;
        var date = new Date();
        var minute = checkTime(date.getMinutes());
        var hour = checkTime(date.getHours());
        var promise = new Promise(function getMessages(resolve) {
            resolve(transferObject.getMessages());
        });
        transferObject.setConfig("userName", configObj.userName);
        promise.then(function updateMessageHistory(value) {
            messageHistory = value;
            if (configObj.showTime) {
                message = "\n".concat([hour, minute].join(":").concat(" ".concat(configObj.userName).concat(" ").concat(messageArea.value)));
                messageHistory.push(message);
            }
            else {
                message = "\n".concat(" ".concat(configObj.userName).concat(" ").concat(messageArea.value));
                messageHistory.push(message);
            }
            if (document.getElementById("messageHistory")) {
                document.getElementById("messageHistory").value = messageHistory.join(" ");
            }
            transferObject.sendMessage(message).setTimeActivity().setUnreadMessage();
            messageArea.value = "";
        })
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

    function showFeedback() {
        var bodyElement = document.body;
        var elem;
        var feedback = generateFeedback();
        var changeElem = document.getElementById("elemShowFeedback");
        var userName;
        bodyElement.replaceChild(feedback, changeElem);
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
        elem = document.getElementById("messageHistory");
        transferObject.setConfig("collapsed", false);
        transferObject.getMessages().then(
            function createMessageHistory(value) {
                elem.value = value.join(" ");
            }
        );
        document.getElementById("collapse").addEventListener("click", function hide() {
            var collapsedFeedback = generateCollapsedFeedback();
            changeElem = document.getElementById("feedBack");
            bodyElement.replaceChild(collapsedFeedback, changeElem);
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
            document.getElementById("maximize").addEventListener("click", showFeedback)
        });
        document.getElementById("sendMessageButton").addEventListener("click", sendMessage);
    }

    function hideFeedback() {
        var bodyElement = document.body;
        var changeElem = document.getElementById("feedBack");
        var collapsedFeedback = generateCollapsedFeedback();
        var userName;
        bodyElement.replaceChild(collapsedFeedback, changeElem);
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
        document.getElementById("maximize").addEventListener("click", function show() {
            var elem;
            var feedback = generateFeedback();
            changeElem = document.getElementById("elemShowFeedback");
            bodyElement.replaceChild(feedback, changeElem);
            userName = document.getElementById("userName");
            userName.value = configObj.userName;
            document.getElementById('chatName').innerText = configObj.title;
            if (configObj.drag) {
                DragDrop(feedback);
            }
            if (!configObj.allowMinimize) {
                notMinimize();
            }
            if (configObj.positionLeft) {
                setPositionLeft(feedback);
            }
            requireName();
            elem = document.getElementById("messageHistory");
            transferObject.setConfig("collapsed", false);
            transferObject.getMessages().then(
                function createMessageHistory(value) {
                    elem.value = value.join(" ");
                }
            );
            document.getElementById("collapse").addEventListener("click", hideFeedback);
            document.getElementById("sendMessageButton").addEventListener("click", sendMessage);
        });
    }


    function createFeedback() {
        var bodyElement = document.body;
        var elem;
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
        elem = document.getElementById("messageHistory");
        transferObject.getMessages().then(
            function createMessageHistory(value) {
                elem.value = value.join(" ");
                document.getElementById("collapse").addEventListener("click", hideFeedback);
                document.getElementById("sendMessageButton").addEventListener("click", sendMessage);
            }
        )
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

    setStyle();


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

    function checkWindow() {
        var timeUpdateChat = 1000;
        if (configObj.network === "XHR") {
            transferObject = new XHRObject();
        }
        else {
            transferObject = new FetchObject();
        }
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
        setInterval(updateMessageList, timeUpdateChat);
    }

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
