/* exported dataBaseClass */
var dataBaseClass = (function dataBaseConnection() {
    var configObj = {
        url: "https://touchsoft-fatexik.firebaseio.com/"
    };
    var OK_RESPONSE_STATUS = 200;
    var FINAL_STATE_RESPONSE = 4;
    var dataBaseAPI;
    var XHRObj;

    function sendXHRRequest(methodRequest, userId, config, nameConfig, bodyObject) {
        var xhr = new XMLHttpRequest();
        xhr.open(methodRequest, configObj.url.concat("users").concat(userId).concat(config).concat(nameConfig).concat(".json"));
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(bodyObject));
        return xhr;
    }

    function XHRObject() {
    }

    XHRObject.prototype.sendMsg = function sendMsg(userId, message) {
        var XHRPromise = new Promise(function sendRequest(resolve) {
            sendXHRRequest("POST", userId, "/messages", "", message).onreadystatechange = function responseReady() {
                if (this.status === OK_RESPONSE_STATUS && this.readyState === FINAL_STATE_RESPONSE) {
                    resolve(true);
                }
            }
        });
        return XHRPromise;
    };
    XHRObject.prototype.getMessages = function getMsg(userId) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET",configObj.url.concat("users").concat(userId).concat("/messages.json"));
        xhr.setRequestHeader("Accept", "text/event-stream");
        xhr.send();
        return xhr;
    };


    XHRObject.prototype.setMessageRead = function setMessageRead(userId) {
        var XHRPromise = new Promise(function sendRequest(resolve) {
            sendXHRRequest("PUT", "/".concat(userId), "/unreadMessage", "", false).onreadystatechange = function responseReady() {
                if (this.status === OK_RESPONSE_STATUS && this.readyState === FINAL_STATE_RESPONSE) {
                    resolve(true);
                }
            };
        });
        return XHRPromise;
    };

    XHRObject.prototype.getUserChatConfig = function getConfig(elemId) {
        var chatConfig = {};
        var XHRPromise = new Promise(function sendRequest(resolve) {
            sendXHRRequest("GET", "/".concat(elemId), "/chatConfig", "").onreadystatechange = function responseReady() {
                if (this.status === OK_RESPONSE_STATUS && this.readyState === FINAL_STATE_RESPONSE) {
                    chatConfig = JSON.parse(this.response);
                    resolve(chatConfig);
                }
            };
        });
        return XHRPromise;
    };

    XHRObject.prototype.getListUsers = function getPullRequestData() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://touchsoft-fatexik.firebaseio.com/users.json", true);
        xhr.setRequestHeader("Accept", "text/event-stream");
        xhr.send();
        return xhr;
    };

    XHRObj = new XHRObject();

    dataBaseAPI = {
        usersList: XHRObj.getListUsers,
        sendMsg: XHRObj.sendMsg,
        getUserMessages: XHRObj.getMessages,
        getUserConfig: XHRObj.getUserChatConfig,
        setMessageRead: XHRObj.setMessageRead
    };

    return dataBaseAPI;

})();
/* eslint no-use-before-define: ["error", { "functions": false }] */
/* global dataBaseClass */
/* exported dashboardUpdateList */
var dashboardUpdateList = (function dashboardController(dataBaseApi) {
        var updateUserList;
        var updateListApi;
        var messager;
        var userId;
        var messageReconnectId;
        var listReconnectId;
        var TIME_UPDATE = 60000;
        var xhrObjectMessages;
        var xhrObjectUsers;
        var clientObjectArray;

        function UpdateUserList() {
        }

        function closeChat() {
            var workPlace = document.getElementById("workPlace");
            var adminChat = document.getElementById("adminChatContent");
            var workContentImg = document.createElement("div");
            workContentImg.className = "workContentImg";
            workContentImg.id = "workContentImg";
            workPlace.replaceChild(workContentImg, adminChat);
            clearInterval(messageReconnectId);
        }

        function setListenerClose() {
            var closeElem = document.getElementById("close");
            closeElem.addEventListener("click", closeChat);
        }


        function createAdminChat() {
            var workPlace = document.getElementById("workPlace");
            var adminChat = document.createElement("div");
            var workContentImg = document.getElementById("workContentImg");
            adminChat.className = "adminChatContent";
            adminChat.id = "adminChatContent";
            adminChat.innerHTML =
                "            <div class=\"adminChat\">\n" +
                "                <div class=\"close\" id=\"close\">X</div>\n" +
                "                <div class =\"chatName\">CHAT</div>\n" +
                "                <textarea class=\"chatHistory\" id=\"chatHistory\"></textarea>\n" +
                "                <textarea class=\"messagePlace\" id=\"messagePlace\"></textarea>\n" +
                "                <input type=\"button\" class=\"sendMessageButton\" id=\"sendMessageButton\" value=\"Send Message\">\n" +
                "            </div>\n" +
                "            <div class=\"adminConfigPlace\"></div>";
            workPlace.replaceChild(adminChat, workContentImg);
            setListenerClose();
        }

        function checkTime(time) {
            var currentTime = time;
            if (currentTime < 10) {
                currentTime = "0".concat(time);
            }
            return currentTime;
        }


        function Messager() {
            this.sendMessage = function sendMessage() {
                var userConfig;
                var message;
                var messageArea = document.getElementById("messagePlace");
                var date = new Date();
                var minute = checkTime(date.getMinutes());
                var hour = checkTime(date.getHours());
                dataBaseApi.setMessageRead(userId);
                dataBaseApi.getUserConfig(userId).then(function getConfig(value) {
                        userConfig = value;
                        if (userConfig.showTime) {
                            message = "\n".concat([hour, minute].join(":").concat(" ".concat("ADMIN").concat(" ").concat(messageArea.value)));
                        }
                        else {
                            message = "\n".concat(" ".concat("ADMIN").concat(" ").concat(messageArea.value));
                        }
                        messageArea.value = "";
                        dataBaseApi.sendMsg("/".concat(userId), message);
                    }
                )
            }
        }


        function objectNameComparator(a, b) {
            if (a.name > b.name) {
                return 1;
            }
            if (a.name < b.name) {
                return -1;
            }
            return 0;
        }


        function sortBubble(data) {
            var tmp;
            var counter;
            var i;
            var j;
            for (i = data.length - 1; i > 0; i--) {
                counter = 0;
                for (j = 0; j < i; j++) {
                    if (!data[j].online) {
                        tmp = data[j];
                        data[j] = data[j + 1];
                        data[j + 1] = tmp;
                        counter++;
                    }
                }
                if (counter === 0) {
                    break;
                }
            }
            return data;
        }


        function addUserInList(user) {
            var usersList = document.getElementById("usersList");
            var userBlock = document.createElement("div");
            userBlock.className = "clientBlock";
            userBlock.id = user.id;
            userBlock.innerText = user.name;
            if (user.online) {
                userBlock.style.backgroundColor = "green";
            }
            if (user.unreadMessage) {
                userBlock.innerText += "✉";
            }
            usersList.appendChild(userBlock);
            userBlock.addEventListener("click", openClient);
            
        }

        function clientSearchFunc() {
            var clientArray = document.getElementsByClassName("clientBlock");
            var clientSearch = document.getElementById("clientSearch");
            var searchLength = clientSearch.value.length;
            var i;
            for(i=0;i<clientArray.length;i++){
                if (clientSearch.value !== clientArray[i].textContent.substring(0, searchLength)){
                    clientArray[i].style.display = "none";
                }
                else {
                    clientArray[i].style.display = "block";
                }
            }
        }

        function updateList() {
            var lists = document.getElementsByClassName("clientBlock");
            var sort = document.getElementById("clientSort").value;
            var length = lists.length;
            var i;
            if (sort === "online") {
                sortBubble(clientObjectArray);
            } else {
                clientObjectArray.sort(objectNameComparator);
            }
            for (i = 0; i < length; i++) {
                lists[0].remove();
            }
            Object.keys(clientObjectArray).forEach(function addUser(x) {
                addUserInList(clientObjectArray[x])
            });
            clientSearchFunc();
        }

        function reconnectMessages(elemId) {
            var message;
            var messages;
            var dataObj;
            var oldMessage;
            var isNewConnection = true;
            var chatHistory = document.getElementById("chatHistory");
            if (xhrObjectMessages) {
                xhrObjectMessages.abort();
            }
            xhrObjectMessages = dataBaseApi.getUserMessages("/".concat(elemId));
            xhrObjectMessages.onreadystatechange = function change() {
                if (this.status === 200) {
                    message = this.responseText.replace(oldMessage, "");
                    oldMessage = this.responseText;
                    dataObj = JSON.parse(message.match(/\{.+\}/));
                    if (dataObj) {
                        messages = Object.keys(dataObj.data).map(function createNewArray(value) {
                            return dataObj.data[value]
                        });
                        if (!isNewConnection) {
                            chatHistory.value = chatHistory.value.concat(messages.join(""));
                        } else {
                            chatHistory.value = messages.join("");
                            isNewConnection = false;
                        }

                    }
                }
            };
        }


        function updateChat(elemId, isUpdate) {
            var chatHistory = document.getElementById("chatHistory");
            var clientSearch = document.getElementById("clientSearch");
            var sendMessageButton = document.getElementById("sendMessageButton");
            if (isUpdate) {
                chatHistory.value = "";
            }
            clearInterval(messageReconnectId);
            reconnectMessages(elemId);
            messageReconnectId = setInterval(function reconnectMsg() {
                reconnectMessages(elemId);
            }, TIME_UPDATE);
            if (isUpdate) {
                sendMessageButton.removeEventListener("click", messager.sendMessage);
            }
            messager = new Messager();
            sendMessageButton.addEventListener("click", messager.sendMessage);
            clientSearch.addEventListener("change", updateList);
        }


        function openClient() {
            var eventClick = arguments[0];
            var isUpdate = true;
            userId = eventClick.target.id;
            dataBaseApi.setMessageRead(userId);
            if (!document.getElementById("adminChatContent")) {
                createAdminChat();
                isUpdate = false;
            }
            updateChat(userId, isUpdate);
        }
        
        function reconnectUsersList() {
            var message;
            var oldMessage;
            var currentTime = new Date().getTime();
            var twoMinutes = 120000;
            var clientObj;
            var arrayName;
            if (xhrObjectUsers) {
                xhrObjectUsers.abort();
            }
            xhrObjectUsers = dataBaseApi.usersList();
            xhrObjectUsers.onreadystatechange = function onReady() {
                var dataObj;
                var path;
                var tmpObjClient;
                var tmpObjNewData;
                var i = 0;
                var isOldProperty = true;
                if (this.status === 200) {
                    message = this.responseText.replace(oldMessage, "");
                    oldMessage = this.responseText;
                    dataObj = JSON.parse(message.match(/\{.+\}/));
                    if (dataObj) {
                        path = dataObj.path.split("/");
                        tmpObjClient = clientObj;
                        tmpObjNewData = dataObj.data;
                        if (path.some(function checkEmpty(value) {
                                return value;
                            })) {
                            path = path.filter(function deleteEmpty(value) {
                                return value;
                            });
                            while (i < path.length - 1 && isOldProperty) {
                                if (path[i] in tmpObjClient) {
                                    tmpObjClient = tmpObjClient[path[i]];
                                    isOldProperty = true;
                                }
                                else {
                                    Object.defineProperty(tmpObjClient, path[i], {value: tmpObjNewData});
                                    isOldProperty = false;
                                }
                                i++;
                            }
                            if (isOldProperty) {
                                Object.defineProperty(tmpObjClient, path[path.length - 1], {value: tmpObjNewData})
                            }
                        }
                        else {
                            clientObj = tmpObjNewData;
                        }
                        arrayName = Object.keys(clientObj).map(function createNewArray(value) {
                                return {
                                    name: clientObj[value].chatConfig.userName !== "You" && clientObj[value].chatConfig.userName !== ""
                                        ? clientObj[value].chatConfig.userName : "no name",
                                    id: value,
                                    online: (currentTime - clientObj[value].activityTime) < twoMinutes,
                                    unreadMessage: clientObj[value].unreadMessage
                                }
                            }
                        );
                        clientObjectArray = arrayName;
                        updateList();
                    }
                }
            }
        }

        UpdateUserList.prototype.createList = function createList() {
            var clientSearch  = document.getElementById('clientSearch');
            var clientSort = document.getElementById('clientSort');
            clientSearch.addEventListener("change",clientSearchFunc);
            clientSort.addEventListener("change",updateList);
            reconnectUsersList();
            listReconnectId = setInterval(reconnectUsersList, TIME_UPDATE);
        };

        UpdateUserList.prototype.closeAllConnection = function closeConnection() {
            clearInterval(listReconnectId);
            clearInterval(messageReconnectId);
            if (xhrObjectUsers) {
                xhrObjectUsers.abort();
            }
            if (xhrObjectMessages) {
                xhrObjectMessages.abort();
            }
        };

        UpdateUserList.prototype.createDashboard = function createDashboard() {
            var newElem = document.createElement("div");
            newElem.id = "createdElem";
            newElem.innerHTML = '<div class="rootChatManager"><span><div class="filterUser"><input type="search" id="clientSearch"><select name="sort" class="clientSort" id="clientSort"><option disabled="disabled">Sort By</option><option selected="selected" value="online">Online</option><option value="userName">Имя</option></select><div class="usersList" id="usersList"></div></div><div class="workPlace" id="workPlace"><div class="workContentImg" id="workContentImg"></div></div></span></div>';
            return newElem;
        };

        updateUserList = new UpdateUserList();

        updateListApi = {
            updateUserList: updateUserList.createList,
            closeConnection: updateUserList.closeAllConnection,
            createDashboard: updateUserList.createDashboard
        };
        return updateListApi;
    }

)
(dataBaseClass);
/* exported chatConfig */
var chatConfig = (function chatConfig() {
    var configValue = {
        chatTitle: "Chat",
        botName: "Bot",
        chatUrl: "https://touchsoft-fatexik.firebaseio.com/",
        chatClass: "../CSS/styles.css",
        chatPosition: false,
        allowMinimize: false,
        drag: false,
        requireName: false,
        showTime: false,
        network: "XHR",
        updates: "longPooling"
    };

    var chatConfigApi;

    function update() {
        var codeArea = document.getElementById("generate_code");
        codeArea.innerText = "<script type=\"text/javascript\" src=\"Chat.js\"></script>\n" +
            "<script type=\"text/javascript\">" +
            "setConfig({\n" +
            "    title: \"" + configValue.chatTitle + "\",\n" +
            "    name: \"" + configValue.botName + "\",\n" +
            "    url: \"" + configValue.chatUrl + "\",\n" +
            "    CSS: \"" + configValue.chatClass + "\",\n" +
            "    positionLeft:" + configValue.chatPosition + ",\n" +
            "    allowMinimize:" + configValue.allowMinimize + ",\n" +
            "    drag: " + configValue.drag + ",\n" +
            "    requireName: " + configValue.requireName + ",\n" +
            "    showTime: " + configValue.showTime + ",\n" +
            "    network: \"" + configValue.network + "\",\n" +
            "    userName: \"\",\n" +
            "    collapsed: true,\n" +
            "    updates:\"" + configValue.updates + "\"\n" +
            "}</script>";
        return this;
    }

    function setFunctional() {
        var chatTitleElem = document.getElementById("chatTitle");
        var botName = document.getElementById("botName");
        var chatUrl = document.getElementById("chatUrl");
        var chatClass = document.getElementById("chatClass");
        var chatPositionSelect = document.getElementById("chatPositionSelect");
        var allowMinimize = document.getElementById("allowMinimize");
        var allowDrag = document.getElementById("allowDrag");
        var requireName = document.getElementById("requireName");
        var showTime = document.getElementById("showTime");
        var XHR = document.getElementById("networkRadioXHR");
        var fetch = document.getElementById("networkRadioFetch");
        var refetch = document.getElementById("refetch");
        var longPooling = document.getElementById("longPooling");
        XHR.addEventListener("change", function setListener() {
            configValue.network = XHR.value;
            update();
        });
        fetch.addEventListener("change", function setListener() {
            configValue.network = fetch.value;
            update();
        });
        chatTitleElem.addEventListener("change", function setListener() {
            configValue.chatTitle = chatTitleElem.value;
            update();
        });
        botName.addEventListener("change", function setListener() {
            configValue.botName = botName.value;
            update();
        });
        chatUrl.addEventListener("change", function setListener() {
            configValue.chatUrl = chatUrl.value;
            update();
        });
        chatClass.addEventListener("change", function setListener() {
            configValue.chatClass = chatClass.value;
            update();
        });
        chatPositionSelect.addEventListener("change", function setListener() {
            var position = chatPositionSelect.value;
            if (position === "Left") {
                configValue.chatPosition = true;
            }
            else {
                configValue.chatPosition = false;
            }
            update();
        });
        allowMinimize.addEventListener("change", function setListener() {
            configValue.allowMinimize = allowMinimize.checked;
            update();
        });
        allowDrag.addEventListener("change", function setListener() {
            configValue.drag = allowDrag.checked;
            update();
        });
        requireName.addEventListener("change", function setListener() {
            configValue.requireName = requireName.checked;
            update();
        });
        showTime.addEventListener("change", function setListener() {
            configValue.showTime = showTime.checked;
            update();
        });
        longPooling.addEventListener("change",function setListener() {
            configValue.updates = longPooling.value;
            configValue.network = "XHR";
            XHR.click();
        });
        refetch.addEventListener("change",function setListener() {
            configValue.updates = refetch.value;
            update();
        });
        return this;
    }

    function createConfig() {
        var newElem = document.createElement("div");
        newElem.id = "createdElem";
        newElem.innerHTML = '<div><div><div>Chat Title</div><input type="text" id="chatTitle"></div><div><div>Bot Name</div><input type="text" id="botName"></div><div><div>Chat URL</div><input type="text" id="chatUrl" value="https://touchsoftchatproject.firebaseio.com"></div><div><div>CSS class</div><input type="text" id="chatClass"></div><div><div>Position</div><select id="chatPositionSelect"><option>Right</option><option>Left</option></select></div><div><div>Allow to minimize</div><div><input type="checkbox" id="allowMinimize"></div><div>Allow drag</div><div><input type="checkbox" id="allowDrag"></div><div>Require name</div><div><input type="checkbox" id="requireName"></div><div>Show data/time</div><div><input type="checkbox" id="showTime"></div></div><form action=""><div>XHR</div><input type="radio" name="contact" value="XHR" id="networkRadioXHR"><div>fetch</div><input type="radio" name="contact" value="fetch" id="networkRadioFetch"></form><form action=""><div>Long Pooling</div><input type="radio" name="contact" value="longPooling" id="longPooling"><div>refetch</div><input type="radio" name="contact" value="refetch" id="refetch"></form></div><container><div id="generate_code"></div></container>';
        return newElem;
    }

    chatConfigApi = {
        setFunctionalConfig: setFunctional,
        updateConfig: update,
        createConfig: createConfig
    };

    return chatConfigApi;
})();
/* exported aboutMe */
var aboutMe = (function about() {
    function createElem() {
        var newElem = document.createElement("div");
        newElem.id = "createdElem";
        newElem.innerHTML = '<div><h1>Fatexik</h1><h2>Contact us anytime you need: support@example.com</h2></div>';
        return newElem;
    }
    return {
        createAbout : createElem
    }
})();
/* global dashboardUpdateList chatConfig chatConfig aboutMe */
function handlerUrl(url, oldUrl) {
    var workSpace = document.getElementById("workSpace");
    var newElem;
    var oldElem;
    if (url.includes("dashboard")) {
        oldElem = document.getElementById("createdElem");
        newElem = dashboardUpdateList.createDashboard();
        workSpace.replaceChild(newElem, oldElem);
        dashboardUpdateList.updateUserList();
    }
    if (url.includes("configFile")) {
        oldElem = document.getElementById("createdElem");
        newElem = chatConfig.createConfig();
        workSpace.replaceChild(newElem, oldElem);
        chatConfig.setFunctionalConfig().updateConfig();
        if (oldUrl.includes("dashboard")) {
            dashboardUpdateList.closeConnection();
        }
    }
    if (url.includes("aboutMe")) {
        oldElem = document.getElementById("createdElem");
        newElem = aboutMe.createAbout();
        workSpace.replaceChild(newElem, oldElem);
        if (oldUrl.includes("dashboard")) {
            dashboardUpdateList.closeConnection();
        }
    }
}

window.addEventListener("hashchange", function hashChange(ev) {
    handlerUrl(ev.newURL, ev.oldURL);
});
window.onload = function onload() {
    handlerUrl(window.location.href);
    document.getElementById("dashboard").addEventListener("click", function update(ev) {
        var url = ev.target.getAttribute("href");
        ev.preventDefault();
        window.location.hash = url;
    });
    document.getElementById("config").addEventListener("click", function update(ev2) {
        var url = ev2.target.getAttribute("href");
        ev2.preventDefault();
        window.location.hash = url;
    });

    document.getElementById("aboutMe").addEventListener("click", function update(ev3) {
        var url = ev3.target.getAttribute("href");
        ev3.preventDefault();
        window.location.hash = url;
    })
};
