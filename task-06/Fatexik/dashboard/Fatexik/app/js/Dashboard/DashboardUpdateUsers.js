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
            for (i = 0; i < clientArray.length; i++) {
                if (clientSearch.value !== clientArray[i].textContent.substring(0, searchLength)) {
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
                            do {
                                if (path[i] in tmpObjClient) {
                                    tmpObjClient = tmpObjClient[path[i]];
                                }
                                else {
                                    Object.defineProperty(tmpObjClient, path[i], {
                                        value: tmpObjNewData,
                                        writable: true,
                                        enumerable: true,
                                        configurable: true
                                    });
                                    isOldProperty = false;
                                }
                                i++;
                            } while (i < path.length - 1 && isOldProperty);
                            if (isOldProperty) {
                                Object.defineProperty(tmpObjClient, path[path.length - 1], {
                                    value: tmpObjNewData,
                                    writable: true,
                                    enumerable: true,
                                    configurable: true
                                })
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
            var clientSearch = document.getElementById('clientSearch');
            var clientSort = document.getElementById('clientSort');
            clientSearch.addEventListener("change", clientSearchFunc);
            clientSort.addEventListener("change", updateList);
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
