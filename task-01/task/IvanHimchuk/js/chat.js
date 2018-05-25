function ChatForTouchSoft() {
    //PRIVATE
    var messageFromBot = " Bot: Ответ на ";
    var messageFromUser = " Вы : ";
    var timeOfBotResponse = 10000;
    var localStorageName = "historyMessages";
    var pathToHtmlFile =
        "https://rawgit.com/UnacceptableCondition/Homework_1/master/html/chat.html";
    var pathToCssFile =
        "https://rawgit.com/UnacceptableCondition/Homework_1/master/css/chat.css";

    var appDOMVariables = {
        messagesBlock: "root_chat_for_touchsoft__top_messages",
        minimizeStyleChatBlock: "root_chat_for_touchsoft_minimize-style",
        mainStyleChatBlock: "root_chat_for_touchsoft",
        mainSendButton: "root_chat_for_touchsoft__bottom_send-button",
        minimizeSendButton: "root_chat_for_touchsoft_minimize-style__send-button",
        setMinimizeStyleButton: "root_chat_for_touchsoft__top_minimize-button",
        setMaxStyleButton: "root_chat_for_touchsoft_minimize-style__max-button",
        messagesTextArea: "root_chat_for_touchsoft__textarea",
        messagesInput: "root_chat_for_touchsoft_minimize-style__message-input"
    };

    //Wrapper for chat HTML DOM
    var createWrapperForChatHTML = function(innerHTMLtext) {
        var wrapper = document.createElement("div");
        wrapper.innerHTML = innerHTMLtext;
        return wrapper;
    };

    var historyMessages = [];

    //Sets app configuration
    var startApp = function() {
        this.setupDOMVariables();
        this.setupChatStyle();
        this.setupOnClickFunctions();
        historyMessages = this.getHistoryCorrespondence(localStorageName);
        this.displayHistory();
    }.bind(this);

    //Gets CSS from server and adds it in HTML head
    var includeCSS = function(link) {
        document.head.appendChild(link);
    };

    //Enter point. Gets HTML from server to create chat view and sets app configuration
    var includeHTML = function(parentElement, httpPath) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", httpPath, true);
        xhr.onreadystatechange = function() {
            if (this.readyState !== 4) return;
            if (this.status !== 200) return; // or whatever error handling you want
            parentElement.appendChild(createWrapperForChatHTML(this.responseText));
            startApp();
        };
        xhr.send();
    };
    //PRIVATE

    //PUBLIC

    this.getDOMVariables = function(name) {
        return name ? appDOMVariables[name] : appDOMVariables;
    };

    this.isMinimizeStyle = function() {
        return isMinimize === "true";
    };

    // isMinimize === 'false' if set MAX_SIZE display mode; 'true' => MINIMIZE display mode
    var isMinimize = "false";

    this.createCSSLink = function(filePath, rel, type, id) {
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

    includeHTML(document.body, pathToHtmlFile);

    includeCSS(
        this.createCSSLink(
            pathToCssFile,
            "stylesheet",
            "text/css",
            "touch-soft-chat-css"
        )
    );

    //Gets access to chat DOM elements and saves them in appDOMVariables
    this.setupDOMVariables = function() {
        for (var key in appDOMVariables) {
            if (appDOMVariables.hasOwnProperty(key)) {
                appDOMVariables[key] = document.getElementsByClassName(
                    appDOMVariables[key]
                )[0];
            }
        }
    }.bind(this);

    //Sets 'onClick' button functions
    this.setupOnClickFunctions = function() {
        appDOMVariables["mainSendButton"].onclick = this.sendMessage.bind(
            appDOMVariables["messagesTextArea"],
            this
        );
        appDOMVariables["minimizeSendButton"].onclick = this.sendMessage.bind(
            appDOMVariables["messagesInput"],
            this
        );
        appDOMVariables["setMinimizeStyleButton"].onclick = this.minMaxStyleToggle;
        appDOMVariables["setMaxStyleButton"].onclick = this.minMaxStyleToggle;
    }.bind(this);

    //Sets 'onClick' button's functions
    this.setupChatStyle = function() {
        isMinimize = localStorage.getItem("isMinimize") || "false";
        appDOMVariables["mainStyleChatBlock"].style.visibility =
            isMinimize === "true" ? "hidden" : "visible";
        appDOMVariables["minimizeStyleChatBlock"].style.visibility =
            isMinimize === "true" ? "visible" : "hidden";
    }.bind(this);

    //Adds user or bot message to messageBlock
    this.sendMessage = function(parentObject) {
        var paragraph = parentObject.createMessageParagraph(
            this.value,
            false,
            false
        );
        parentObject.setParagraphToTheMessagesBlock(paragraph);
        parentObject.getAnswer(this.value, parentObject);
        this.value = "";
    };

    //STUB for bot activity
    this.getAnswer = function(requestMessage, parentObject) {
        var paragraph = parentObject.createMessageParagraph(
            requestMessage.toUpperCase(),
            false,
            true
        );
        setTimeout(function() {
            parentObject.setParagraphToTheMessagesBlock(paragraph);
        }, timeOfBotResponse);
    };
    //STUB

    this.setParagraphToTheMessagesBlock = function(paragraph) {
        appDOMVariables["messagesBlock"].appendChild(paragraph);
    }.bind(this);

    this.displayHistory = function() {
        for (var i = 0; i < historyMessages.length; i++) {
            var paragraph = this.createMessageParagraph(
                historyMessages[i],
                true,
                false
            );
            this.setParagraphToTheMessagesBlock(paragraph);
        }
    }.bind(this);

    //Creates message view to add it to messageBlock after
    this.createMessageParagraph = function(messageText, isHistory, isBot) {
        var paragraph = document.createElement("div");
        var result;
        if (!isHistory) {
            var date = new Date();
            result =
                date.getHours() +
                ":" +
                date.getMinutes() +
                (!isBot
                    ? messageFromUser + messageText
                    : messageFromBot + '"' + messageText + '" ');
            this.saveHistoryCorrespondence(result, localStorageName, historyMessages);
        } else {
            result = messageText;
        }
        paragraph.innerHTML += result;
        return paragraph;
    }.bind(this);

    //Gets history of correspondence
    this.getHistoryCorrespondence = function(keyForLocalStorage) {
        return JSON.parse(localStorage.getItem(keyForLocalStorage)) || [];
    };

    //Save message to localStorage and push it to historyMessageObject
    this.saveHistoryCorrespondence = function(
        message,
        keyForLocalStorage,
        historyMessagesObject
    ) {
        historyMessagesObject.push(message);
        JSON.stringify(historyMessagesObject);
        localStorage.setItem(
            keyForLocalStorage,
            JSON.stringify(historyMessagesObject)
        );
    };

    //Switches chat style and saves this state in localStorage
    this.minMaxStyleToggle = function() {
        appDOMVariables["minimizeStyleChatBlock"].style.visibility =
            appDOMVariables["minimizeStyleChatBlock"].style.visibility === "hidden"
                ? "visible"
                : "hidden";
        appDOMVariables["mainStyleChatBlock"].style.visibility =
            appDOMVariables["mainStyleChatBlock"].style.visibility === "hidden"
                ? "visible"
                : "hidden";
        isMinimize = isMinimize === "false" ? "true" : "false";
        localStorage.setItem("isMinimize", isMinimize);
    };
}

var chatForTouchSoft = new ChatForTouchSoft();
