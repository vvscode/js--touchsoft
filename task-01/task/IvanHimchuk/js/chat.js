var configObj = {
    messageFromBot: " Bot: Ответ на ",
    messageFromUser: " Вы : ",
    timeOfBotResponse: 10000,
    localStorageName: "historyMessages",
    pathToHtmlFile: "https://rawgit.com/UnacceptableCondition/Homework_1/master/html/chat.html",
    pathToCssFile: "https://rawgit.com/UnacceptableCondition/Homework_1/master/css/chat.css",
    isMinimize: "",

    appDOMVariables: {
        messagesBlock: {className: "root_chat_for_touchsoft__top_messages"},
        minimizeStyleChatBlock: {
            className: "root_chat_for_touchsoft_minimize-style"
        },
        mainStyleChatBlock: {className: "root_chat_for_touchsoft"},
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
        messagesTextArea: {className: "root_chat_for_touchsoft__textarea"},
        messagesInput: {
            className: "root_chat_for_touchsoft_minimize-style__message-input"
        }
    },

    historyMessages: []
};

function ChatForTouchSoft(configObj) {
    "use strict";
    this.config = configObj;
}

/**
 * Gets access to chat DOM elements and writes them in appDOMVariables
 * object instead object which it contains
 *
 * @param {Array|Object} appDOMVariables array of classes DOM elements to which you wants to access
 * array element is object with string property "className"
 */
ChatForTouchSoft.prototype.setupDOMVariables = function (appDOMVariables) {
    "use strict";
    Object.keys(appDOMVariables).map(function (objectKey) {
        appDOMVariables[objectKey] = document.getElementsByClassName(
            appDOMVariables[objectKey].className
        )[0];
    });
};

/**
 * Init shat style on the first load or reload page
 */
ChatForTouchSoft.prototype.setupChatStyle = function () {
    "use strict";
    this.config.isMinimize = localStorage.getItem("isMinimize") || "false";
    if (this.config.isMinimize === "false") {
        this.config.appDOMVariables.mainStyleChatBlock.classList.toggle("visible");
        this.config.appDOMVariables.minimizeStyleChatBlock.classList.toggle(
            "visible"
        );
    }
};

/**
 * Sets 'onClick' button functions
 */
ChatForTouchSoft.prototype.setupOnClickFunctions = function () {
    "use strict";
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
};

/**
    * Adds user or bot message to messageBlock
    *
    * @param {String} inputObjName name of the message entry element item is configObj property.
*/
ChatForTouchSoft.prototype.sendMessage = function (inputObjName) {
    "use strict";
    var inputObj = this.config.appDOMVariables[inputObjName];
    var paragraph = this.createMessageParagraph(
        inputObj.value,
        false,
        false,
        this.config
    );
    this.saveHistoryOfCorrespondence(paragraph.innerHTML, this.config.localStorageName);
    this.setParagraphToTheMessagesBlock(paragraph);
    this.getAnswer(inputObj.value);
    inputObj.value = "";
};

// STUB for bot activity
ChatForTouchSoft.prototype.getAnswer = function (requestMessage) {
    "use strict";
    var refToParentObj = this;
    var paragraph = this.createMessageParagraph(
        requestMessage.toUpperCase(),
        false,
        true,
        this.config
    );
    this.saveHistoryOfCorrespondence(paragraph.innerHTML, this.config.localStorageName);
    setTimeout(function () {
        refToParentObj.setParagraphToTheMessagesBlock(paragraph);
    }, this.config.timeOfBotResponse);
};
// STUB

ChatForTouchSoft.prototype.saveHistoryOfCorrespondence = function (message, localStorageName) {
    "use strict";
    this.saveMessageToHistoryObject(message);
    this.saveHistoryObject(localStorageName);
};
/**
 * Create message for chat. Add current date to message text and service text
 */
ChatForTouchSoft.prototype.createMessage = function (messageText, isBot) {
    "use strict";
    var date = new Date();
    var result = date.getHours() + ":" + date.getMinutes();
    if (!isBot) {
        result = this.config.messageFromUser + messageText;
    } else {
        result = this.config.messageFromBot + "\"" + messageText + "\"";
    }
    return result;
};

/**
 *  Create DOM object with requested text
 */
ChatForTouchSoft.prototype.createMessageParagraph = function (messageText, isHistory, isBot) {
    "use strict";
    var paragraph = document.createElement("div");
    var result;
    if (!isHistory) {
        result = this.createMessage(messageText, isBot);
    } else {
        result = messageText;
    }
    paragraph.innerHTML += result;
    return paragraph;
};


ChatForTouchSoft.prototype.setParagraphToTheMessagesBlock = function (paragraph) {
    "use strict";
    this.config.appDOMVariables.messagesBlock.appendChild(paragraph);
};

// Gets history of correspondence
ChatForTouchSoft.prototype.getHistoryCorrespondence = function (keyForLocalStorage) {
    "use strict";
    return JSON.parse(localStorage.getItem(keyForLocalStorage)) || [];
};

// Save message to localStorage and push it to historyMessageObject
ChatForTouchSoft.prototype.saveHistoryObject = function (keyForLocalStorage) {
    "use strict";
    JSON.stringify(this.config.historyMessages);
    localStorage.setItem(
        keyForLocalStorage,
        JSON.stringify(this.config.historyMessages)
    );
};

ChatForTouchSoft.prototype.saveMessageToHistoryObject = function (message) {
    "use strict";
    this.config.historyMessages.push(message);
};

ChatForTouchSoft.prototype.displayHistory = function () {
    "use strict";
    var refToParentObj = this;
    this.config.historyMessages.forEach(function (element) {
        var paragraph = refToParentObj.createMessageParagraph(
            element,
            true,
            false,
            refToParentObj.config
        );
        refToParentObj.setParagraphToTheMessagesBlock(paragraph);
    });
};

// add CSS style to the page
ChatForTouchSoft.prototype.includeCSS = function (link) {
    "use strict";
    document.head.appendChild(link);
};

ChatForTouchSoft.prototype.createCSSLink = function (filePath, rel, type, id) {
    "use strict";
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

// Invokes all setup functions, gets history of messages and display it
ChatForTouchSoft.prototype.setupAppConfiguration = function () {
    "use strict";
    this.setupDOMVariables(this.config.appDOMVariables);
    this.setupChatStyle();
    this.setupOnClickFunctions();
    this.config.historyMessages = this.getHistoryCorrespondence(
        this.config.localStorageName
    );
    this.displayHistory();
};

// Gets chat HTML from server; invokes callback 'load' functions
ChatForTouchSoft.prototype.getHTML = function (httpPath, callbackLoad) {
    "use strict";
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
ChatForTouchSoft.prototype.includeHTML = function (parentElement, innerHTMLtext) {
    "use strict";
    var wrapper = document.createElement("div");
    wrapper.innerHTML = innerHTMLtext;
    parentElement.appendChild(wrapper);
};

// Enter point
ChatForTouchSoft.prototype.startApp = function () {
    "use strict";
    var callbackLoad = function (requestObj) {
        this.includeHTML(document.body, requestObj.response);
        this.setupAppConfiguration();
    };
    this.getHTML(this.config.pathToHtmlFile, callbackLoad);
    var cssLink = this.createCSSLink(
        this.config.pathToCssFile,
        "stylesheet",
        "text/css",
        "touch-soft-chat-css"
    );
    this.includeCSS(cssLink);
};

/**
 * Switches chat style and saves this state in localStorage
 * */
ChatForTouchSoft.prototype.minMaxStyleToggle = function () {
    "use strict";
    this.config.appDOMVariables.mainStyleChatBlock.classList.toggle("visible");
    this.config.appDOMVariables.minimizeStyleChatBlock.classList.toggle(
        "visible"
    );
    this.config.isMinimize = this.config.isMinimize === "false"
        ? "true"
        : "false";
    localStorage.setItem("isMinimize", this.config.isMinimize);
};

var chatForTouchSoftInstance = new ChatForTouchSoft(configObj);
chatForTouchSoftInstance.startApp();
