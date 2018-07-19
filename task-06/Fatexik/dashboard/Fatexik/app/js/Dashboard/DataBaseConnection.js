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