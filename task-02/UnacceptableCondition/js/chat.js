/* global document */
/* global localStorage */
/* global XMLHttpRequest */

var configObj = {
    messageFromBot: " Bot: Ответ на ",
    messageFromUser: " Вы : ",
    timeOfBotResponse: 10000,
    localStorageName: "userName_touchsoft",
    pathToHtmlFile:
        "https://rawgit.com/UnacceptableCondition/Homework_2/master/html/chat.html",
    pathToCssFile:
        "https://rawgit.com/UnacceptableCondition/Homework_2/master/css/chat.css",
    isMinimize: false,
    userData: {
        userName: "",
        online: "",
        read: "",
        isMinimize: false
    },
    scriptSrc: document.currentScript.getAttribute("src"),
    appDOMVariables: {
        messagesBlock: { className: "root_chat_for_touchsoft__top_messages" },
        minimizeStyleChatBlock: {
            className: "root_chat_for_touchsoft_minimize-style"
        },
        mainStyleChatBlock: { className: "root_chat_for_touchsoft" },
        mainSendButton: {
            className: "root_chat_for_touchsoft__bottom_send-button"
        },
        minimizeSendButton: {
            className: "root_chat_for_touchsoft_minimize-style__send-button"
        },
        setMinimizeStyleButton: {
            className: "root_chat_for_touchsoft__top_minimize-button"
        },
        setMaxStyleButton: {
            className: "root_chat_for_touchsoft_minimize-style__max-button"
        },
        messagesTextArea: { className: "root_chat_for_touchsoft__textarea" },
        messagesInput: {
            className: "root_chat_for_touchsoft_minimize-style__message-input"
        },
        userNameInput: {
            className: "root_chat_for_touchsoft_input-name"
        },
        userNameButton: {
            className: "root_chat_for_touchsoft_input-name-button"
        },
        userNameBlock: {
            className: "root_chat_for_touchsoft_input-name-block"
        },
        titleBlock: {
            className: "root_chat_for_touchsoft-title"
        }
    },

    historyMessages: []
};

var chatForTouchSoftInstance;

function ChatForTouchSoft(configObject) {
    this.config = configObject;
    this.setupObject = new SetupObject(configObject);
    this.dataBaseObject = {};
}

// Enter point
ChatForTouchSoft.prototype.startApp = function startApp() {
    var cssLink = this.createCSSLink(
        this.config.pathToCssFile,
        "stylesheet",
        "text/css",
        "touch-soft-chat-css"
    );
    var callbackLoad = function callbackLoad(requestObj) {
        this.includeHTML(document.body, requestObj.response);
        this.setupAppConfiguration();
    };
    this.includeCSS(cssLink);
    this.getHTML(this.config.pathToHtmlFile, callbackLoad);
};

// Invokes all setup functions, gets history of messages and display it
ChatForTouchSoft.prototype.setupAppConfiguration = function setupAppConfiguration() {
    this.setupObject.setupDOMVariables(this.config.appDOMVariables);
    this.applyUserSettings();
    this.setupOnClickFunctions();
};

ChatForTouchSoft.prototype.applyUserSettings = function applyUserSettings() {
    this.config.hashUserName = this.getUserNameFromLocalStorage();
    this.config.userSettings = this.setupObject.parseSrcForParameters(
        this.config.scriptSrc
    );
    this.dataBaseObject = new DataBaseObject(this.config.userSettings.requests);
    // Если хэша нет в localStorage и/или авторизация не обязательна = установить имя пользователя по умолчанию
    if (!this.setupObject.userNameIsRequire()) {
        this.setUserName(false, false);
    }
    // Применить настройки чата переданные как GET параметры в ссылке скрипта
    this.setupObject.setupUserSettings();
    /*
        Если hashUserName был сохранен в LocalStorage - загружаем его данные с сервера: имя юзера(не хэш), мессаджи и стиль окна (min max)
        в противном случае применяем базовые настройки стиля
      */
    if (this.isHashUserName()) {
        this.getUserData();
    } else {
        this.setupObject.setupChatStyle();
    }
};

// callback for case: name is required
ChatForTouchSoft.prototype.getUserNameFromInput = function getUserNameFromInput() {
    this.config.userData.userName = this.config.appDOMVariables.userNameInput.value;
    this.config.appDOMVariables.userNameBlock.classList.toggle("invisible");
    this.setUserName(false, false);
};

ChatForTouchSoft.prototype.setUserName = function setUserName(
    hashIsLocal,
    userSettingsIsLocal
) {
    if (hashIsLocal) {
        this.config.hashUserName = this.getUserNameFromLocalStorage();
    } else {
        this.config.hashUserName = this.getHash(this.config.userData.userName);
    }
    this.saveUserNameToLocalStorage();
    if (userSettingsIsLocal) {
        this.config.userSettings = this.setupObject.parseSrcForParameters(
            this.config.scriptSrc
        );
    }
    this.dataBaseObject.saveUserSettings(
        this.config.hashUserName,
        this.config.userData
    );
    this.setupObject.setMessageFromUser();
};

/**
 * Sets 'onClick' button functions
 */
ChatForTouchSoft.prototype.setupOnClickFunctions = function setupOnClickFunctions() {
    this.config.appDOMVariables.mainSendButton.addEventListener(
        "click",
        this.sendMessage.bind(this, "messagesTextArea")
    );
    this.config.appDOMVariables.minimizeSendButton.addEventListener(
        "click",
        this.sendMessage.bind(this, "messagesInput")
    );
    this.config.appDOMVariables.setMinimizeStyleButton.addEventListener(
        "click",
        this.minMaxStyleToggle.bind(this)
    );
    this.config.appDOMVariables.setMaxStyleButton.addEventListener(
        "click",
        this.minMaxStyleToggle.bind(this)
    );
    this.config.appDOMVariables.userNameButton.addEventListener(
        "click",
        this.getUserNameFromInput.bind(this)
    );
};

/**
 * Adds user or bot message to messageBlock
 *
 * @param {String} inputObjName name of the message entry element item is configObj property.
 */
ChatForTouchSoft.prototype.sendMessage = function sendMessage(inputObjName) {
    var currentDate = this.getCurrentDate();
    var inputObj = this.config.appDOMVariables[inputObjName];
    var paragraph = this.createMessageParagraph(
        inputObj.value,
        false,
        this.config.userSettings.showDateTime === "true" ? currentDate : ""
    );
    this.saveHistoryOfCorrespondence(
        inputObj.value,
        currentDate,
        this.config.hashUserName,
        this.config.userData.userName
    );
    this.setParagraphToTheMessagesBlock(paragraph);
    this.getAnswer(inputObj.value);
    inputObj.value = "";
};

// STUB for bot activity
ChatForTouchSoft.prototype.getAnswer = function getAnswer(requestMessage) {
    var currentDate = this.getCurrentDate();
    var refToParentObj = this;
    var paragraph = this.createMessageParagraph(
        requestMessage.toUpperCase(),
        true,
        this.config.userSettings.showDateTime === "true" ? currentDate : ""
    );
    this.saveHistoryOfCorrespondence(
        requestMessage.toUpperCase(),
        currentDate,
        this.config.hashUserName,
        this.config.userSettings.botName
    );
    setTimeout(function addMessageToTheMessageBlock() {
        refToParentObj.setParagraphToTheMessagesBlock(paragraph);
    }, this.config.timeOfBotResponse);
};
// STUB

ChatForTouchSoft.prototype.saveHistoryOfCorrespondence = function saveHistoryOfCorrespondence(
    message,
    date,
    userName,
    sender
) {
    this.saveMessageToHistoryObject(message, date, sender);
    if (this.isHashUserName()) {
        this.dataBaseObject.saveUserMessage(userName, message, date, sender);
    }
};
/**
 * Create message for chat. Add current date to message text and service text
 */
ChatForTouchSoft.prototype.createMessage = function createMessage(
    messageText,
    isBot
) {
    var result = "";
    if (!isBot) {
        result += this.config.messageFromUser.concat(messageText);
    } else {
        result += this.config.messageFromBot.concat('"', messageText, '"');
    }
    return result;
};

ChatForTouchSoft.prototype.getCurrentDate = function getCurrentDate() {
    var date = new Date();
    return date
        .getHours()
        .toString()
        .concat(":", date.getMinutes().toString());
};

// Есть ли запись в this.config.hashUserName
ChatForTouchSoft.prototype.isHashUserName = function isHashUserName() {
    return !!this.config.hashUserName;
};

/**
 *  Create DOM object with requested text
 */
ChatForTouchSoft.prototype.createMessageParagraph = function createMessageParagraph(
    messageText,
    isBot,
    messageDate
) {
    var paragraph = document.createElement("div");
    var result = this.createMessage(messageText, isBot);
    result = messageDate + result;
    paragraph.innerHTML += result;
    return paragraph;
};

ChatForTouchSoft.prototype.setParagraphToTheMessagesBlock = function setParagraphToTheMessagesBlock(
    paragraph
) {
    this.config.appDOMVariables.messagesBlock.appendChild(paragraph);
};

ChatForTouchSoft.prototype.saveMessageToHistoryObject = function saveMessageToHistoryObject(
    message,
    date,
    sender
) {
    this.config.historyMessages.push({
        message: message,
        date: date,
        sender: sender
    });
};

ChatForTouchSoft.prototype.displayHistory = function displayHistory() {
    var chatObj = this;
    this.config.historyMessages.forEach(function createElement(element) {
        var date =
            chatObj.config.userSettings.showDateTime === "true" ? element.date : "";
        var paragraph = chatObj.createMessageParagraph(
            element.message,
            !(element.sender === chatObj.config.userData.userName),
            date
        );
        chatObj.setParagraphToTheMessagesBlock(paragraph);
    });
};

// add CSS style to the page
ChatForTouchSoft.prototype.includeCSS = function includeCSS(link) {
    document.head.appendChild(link);
};

ChatForTouchSoft.prototype.createCSSLink = function createCSSLink(
    filePath,
    rel,
    type,
    id
) {
    var link = document.createElement("link");
    if (id) {
        link.setAttribute("id", id);
    }
    if (rel) {
        link.setAttribute("rel", rel);
    }
    if (type) {
        link.setAttribute("type", type);
    }
    link.setAttribute("href", filePath);
    return link;
};

// Gets chat HTML from server; invokes callback 'load' functions
ChatForTouchSoft.prototype.getHTML = function getHTML(httpPath, callbackLoad) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", callbackLoad.bind(this, xhr));
    xhr.open("GET", httpPath, true);
    xhr.send();
    return xhr.response;
};

/**
 * Includes text or other element to parentElement as innerHTML
 *
 * @param {Object} parentElement DOM element in witch it is necessary to include other text/element
 * @param {Object|String} innerHTMLtext is object/text witch to need include
 */
ChatForTouchSoft.prototype.includeHTML = function includeHTML(
    parentElement,
    innerHTMLtext
) {
    var wrapper = document.createElement("div");
    wrapper.innerHTML = innerHTMLtext;
    parentElement.appendChild(wrapper);
};

/**
 * Switches chat style and saves this state in localStorage
 * */
ChatForTouchSoft.prototype.minMaxStyleToggle = function minMaxStyleToggle() {
    this.config.appDOMVariables.mainStyleChatBlock.classList.toggle("invisible");
    this.config.appDOMVariables.minimizeStyleChatBlock.classList.toggle(
        "invisible"
    );
    this.config.userData.isMinimize = this.config.userData.isMinimize === false;
    this.dataBaseObject.saveUserSettings(
        this.config.hashUserName,
        this.config.userData
    );
};

ChatForTouchSoft.prototype.getHash = function getHash(str) {
    var date = new Date();
    return str + date.getTime();
};

ChatForTouchSoft.prototype.getUserData = function getUserMessages() {
    var chatObj = this;
    this.dataBaseObject
        .getUserSettings(this.config.hashUserName)
        .then(function(data) {
            chatObj.config.userData = data[0].userSettings;
            chatObj.setupObject.setMessageFromUser();
            chatObj.setupObject.setupChatStyle();
        })
        .then(function() {
            chatObj.dataBaseObject
                .getUserMessages(chatObj.config.hashUserName)
                .then(function(data) {
                    if (data) {
                        Object.keys(data).map(function(el) {
                            chatObj.saveMessageToHistoryObject(
                                data[el][0].message,
                                data[el][0].date,
                                data[el][0].user
                            );
                        });
                    }
                })
                .then(chatObj.displayHistory.bind(chatObj));
        });
};

ChatForTouchSoft.prototype.saveUserNameToLocalStorage = function saveUserNameToLocalStorage() {
    localStorage.setItem(this.config.localStorageName, this.config.hashUserName);
};

ChatForTouchSoft.prototype.getUserNameFromLocalStorage = function getUserNameFromLocalStorage() {
    return localStorage.getItem(this.config.localStorageName);
};

// OBJECT FOR WORK WITH USER SETTINGS // BEGIN //

function SetupObject(configObject) {
    this.config = configObject;
}

SetupObject.prototype.setupUserSettings = function setupUserSettings() {
    this.setMessageFromBot();
    this.allowMinimize();
    this.setPositionOfMainBlock();
    this.setTitle();
    this.setMainCssClass();
    this.allowDragNDrop();
};

SetupObject.prototype.parseSrcForParameters = function parseSrcForParameters(
    src
) {
    var userConfigObject = {};
    var arrParam = src.substr(src.indexOf("?") + 1).split("&");
    arrParam.forEach(function(element) {
        var paramObj = element.split("=");
        paramObj[1] = paramObj[1].replace(/'/g, "");
        userConfigObject[paramObj[0]] = paramObj[1];
    });
    return userConfigObject;
};

SetupObject.prototype.setMessageFromUser = function setMessageFromUser() {
    this.config.messageFromUser = this.config.userData.userName
        ? " " + this.config.userData.userName + " : "
        : " Вы : ";
};

SetupObject.prototype.setMessageFromBot = function setMessageFromBot() {
    this.config.messageFromBot = this.config.userSettings.botName
        ? " " + this.config.userSettings.botName + ": Ответ на "
        : " Bot: Ответ на ";
};

SetupObject.prototype.allowDragNDrop = function allowDragNDrop() {
    var clickBlock = this.config.appDOMVariables.titleBlock;
    var dragBlock = this.config.appDOMVariables.mainStyleChatBlock;
    if (this.config.userSettings.allowDrag === "false") {
        return;
    }
    clickBlock.addEventListener("mousedown", function(e) {
        var cords = getCoords(dragBlock);
        var shiftX = e.pageX - cords.left;
        var shiftY = e.pageY - cords.top;

        moveAt(e);
        dragBlock.style.zIndex = 1000; // над другими элементами
        function moveAt(e) {
            dragBlock.style.left = e.pageX - shiftX + "px";
            dragBlock.style.top = e.pageY - shiftY + "px";
        }

        document.onmousemove = function(e) {
            moveAt(e);
        };

        dragBlock.onmouseup = function() {
            document.onmousemove = null;
            dragBlock.onmouseup = null;
        };
        dragBlock.ondragstart = function() {
            return false;
        };
        function getCoords(elem) {
            var box = elem.getBoundingClientRect();
            return {
                top: box.top + pageYOffset,
                left: box.left + pageXOffset
            };
        }
    });
};

SetupObject.prototype.setPositionOfMainBlock = function setPositionOfMainBlock() {
    if (this.config.userSettings.position === "right") {
        this.config.appDOMVariables.mainStyleChatBlock.classList.add(
            "root_chat_for_touchsoft_right-position"
        );
    } else {
        this.config.appDOMVariables.mainStyleChatBlock.classList.add(
            "root_chat_for_touchsoft_left-position"
        );
    }
};

/**
 * Init shat style on the first load or reload page
 */
SetupObject.prototype.setupChatStyle = function setupChatStyle() {
    if (!this.config.userData.isMinimize) {
        this.config.appDOMVariables.mainStyleChatBlock.classList.toggle(
            "invisible"
        );
    } else {
        this.config.appDOMVariables.minimizeStyleChatBlock.classList.toggle(
            "invisible"
        );
    }
};

SetupObject.prototype.setTitle = function setTitle() {
    this.config.appDOMVariables.titleBlock.innerHTML = this.config.userSettings.title;
};

SetupObject.prototype.allowMinimize = function allowMinimize() {
    if (this.config.userSettings.allowMinimize === "false") {
        this.config.appDOMVariables.setMinimizeStyleButton.classList.add(
            "invisible"
        );
    }
};

SetupObject.prototype.setMainCssClass = function setMainCssClass() {
    this.config.appDOMVariables.mainStyleChatBlock.parentNode.classList.add(
        this.config.userSettings.cssClass
    );
};

/**
 * Gets access to chat DOM elements and writes them in appDOMVariables
 * object instead object which it contains
 *
 * @param {Array|Object} appDOMVariables array of classes DOM elements to which you wants to access
 * array element is object with string property "className"
 */
SetupObject.prototype.setupDOMVariables = function setupDOMVariables(
    appDOMVariables
) {
    var newAppDOMVariables = {};
    Object.keys(appDOMVariables).map(function setElementsAccess(objectKey) {
        newAppDOMVariables[objectKey] = document.getElementsByClassName(
            appDOMVariables[objectKey].className
        )[0];
        return null;
    });
    chatForTouchSoftInstance.config.appDOMVariables = newAppDOMVariables;
};

SetupObject.prototype.userNameIsRequire = function userNameIsRequire() {
    if (!this.config.hashUserName) {
        if (this.config.userSettings.requireName === "true") {
            this.config.appDOMVariables.userNameBlock.classList.toggle("invisible");
            return true;
        } else {
            return false;
        }
    }
    return true;
};

// WORK WITH USER SETTINGS // END //

// WORK WITH DATABASE // BEGIN //

function DataBaseObject(typeOfRequest) {
    this.setup(typeOfRequest);
}

DataBaseObject.prototype.setup = function setup(typeOfRequest) {
    if (typeOfRequest === "fetch") {
        DataBaseObject.prototype.saveUserMessage = this.fetchSaveUserMessage;
        DataBaseObject.prototype.saveUserSettings = this.fetchSaveUserSettings;
        DataBaseObject.prototype.getUserSettings = this.fetchGetUserSettings;
        DataBaseObject.prototype.getUserMessages = this.fetchGetUserMessages;
    } else {
        DataBaseObject.prototype.saveUserMessage = this.XHRSaveUserMessage;
        DataBaseObject.prototype.saveUserSettings = this.XHRSaveUserSettings;
        DataBaseObject.prototype.getUserSettings = this.XHRGetUserSettings;
        DataBaseObject.prototype.getUserMessages = this.XHRGetUserMessages;
    }
};

DataBaseObject.prototype.fetchSaveUserMessage = function fetchSaveUserMessage(
    userName,
    message,
    date,
    sender
) {
    fetch(
        "https://touchsoftchatproject.firebaseio.com" +
        "/users/" +
        userName +
        "/messages.json",
        {
            method: "POST",
            body: JSON.stringify([
                {
                    user: sender,
                    message: message,
                    date: date,
                    title: "message"
                }
            ]),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        }
    ).then(function(response) {
        return response.json();
    });
};

DataBaseObject.prototype.fetchSaveUserSettings = function saveUserSettings(
    userName,
    userSettings
) {
    fetch(
        "https://touchsoftchatproject.firebaseio.com" +
        "/users/" +
        userName +
        "/settings.json",
        {
            method: "PUT",
            body: JSON.stringify([
                {
                    userSettings: userSettings
                }
            ]),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        }
    ).then(function(response) {
        return response.json();
    });
    // .then(console.log);
};

DataBaseObject.prototype.fetchGetUserSettings = function getUserSettings(
    userName
) {
    return fetch(
        "https://touchsoftchatproject.firebaseio.com" +
        "/users/" +
        userName +
        "/settings.json",
        {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        }
    )
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            return data;
        });
};

DataBaseObject.prototype.fetchGetUserMessages = function getUserMessages(
    userName
) {
    return fetch(
        "https://touchsoftchatproject.firebaseio.com" +
        "/users/" +
        userName +
        "/messages.json",
        {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        }
    )
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            return data;
        });
};

DataBaseObject.prototype.XHRGetUserMessages = function XHRGetUserMessages(
    userName
) {
    return new Promise(function(resolve, reject) {
        var targetUrl =
            "https://touchsoftchatproject.firebaseio.com" +
            "/users/" +
            userName +
            "/messages.json";
        var xhr = new XMLHttpRequest();
        xhr.open("GET", targetUrl, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function() {
            resolve(JSON.parse(xhr.response));
        };
        xhr.onerror = function() {
            reject(xhr.statusText);
        };
        xhr.send();
    });
};

DataBaseObject.prototype.XHRGetUserSettings = function XHRGetUserSettings(
    userName
) {
    return new Promise(function(resolve, reject) {
        var targetUrl =
            "https://touchsoftchatproject.firebaseio.com" +
            "/users/" +
            userName +
            "/settings.json";
        var xhr = new XMLHttpRequest();
        xhr.open("GET", targetUrl, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function() {
            resolve(JSON.parse(xhr.response));
        };
        xhr.onerror = function() {
            reject(xhr.statusText);
        };
        xhr.send();
    });
};

DataBaseObject.prototype.XHRSaveUserSettings = function XHRSaveUserSettings(
    userName,
    userSettings
) {
    var body = JSON.stringify([
        {
            userSettings: userSettings
        }
    ]);
    var targetUrl =
        "https://touchsoftchatproject.firebaseio.com" +
        "/users/" +
        userName +
        "/settings.json";
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", targetUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(body);
};

DataBaseObject.prototype.XHRSaveUserMessage = function XHRSaveUserMessage(
    userName,
    message,
    date,
    sender
) {
    var body = JSON.stringify([
        {
            user: sender,
            message: message,
            date: date,
            title: "message"
        }
    ]);
    var targetUrl =
        "https://touchsoftchatproject.firebaseio.com" +
        "/users/" +
        userName +
        "/messages.json";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", targetUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(body);
};

// WORK WITH DATABASE  // END //

chatForTouchSoftInstance = new ChatForTouchSoft(configObj);
chatForTouchSoftInstance.startApp();
