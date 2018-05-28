var chatForSite;
var configChat = {
    timeOfBotResponse: 15000,
    pathToHtmlFile: "https://cdn.rawgit.com/kozel-stas/js--touchsoft/89c1d33a/task-01/task/skozel/ChatComponent.html",
    pathToCssFile: "https://cdn.rawgit.com/kozel-stas/js--touchsoft/89c1d33a/task-01/task/skozel/StyleChatComponent.css",
    isMin: false,
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
        }
    }
};

function constructMessage(text) {
    var day = new Date();
    var prefix = "Вы: ";
    return "[" + day.getHours().toString() + ":" + day.getMinutes().toString() + "] " + prefix + text;
};

function constructAnswer(text) {
    var day = new Date();
    var prefix = "Бот: Ответ на \"";
    return "[" + day.getHours().toString() + ":" + day.getMinutes().toString() + "] " + prefix + text + "\"";
};

function Chat(setConfig) {
    this.config = setConfig;
};

Chat.prototype.startChat = function () {
    this.getHTML();
    this.addCSS();
};

Chat.prototype.addCSS = function () {
    var link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", this.config.pathToCssFile);
    document.head.appendChild(link);
};

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
};

Chat.prototype.includeHTML = function (elem) {
    var div = document.createElement("div");
    div.innerHTML = elem;
    document.body.appendChild(div);
};

Chat.prototype.configurate = function () {
    this.getDOMElem(this.config.DOMVariables);
    this.clickEvent();
    this.loadOldConfig();
    this.trigStatusChat();
    this.loadOldMessage();
};

Chat.prototype.loadOldMessage = function () {
    var i;
    var maxValue = parseInt(localStorage.getItem("index"));
    for (i = 0; i < maxValue; i = i + 1) {
        this.addOutputMessage(localStorage.getItem(i.toString()), this.config.DOMVariables.output.elemDOM);
    }
};

Chat.prototype.trigStatusChat = function () {
    var root = this.config.DOMVariables.chatComponentRoot;
    var rootMin = this.config.DOMVariables.chatComponentRootMin;
    root.elemDOM.classList.remove("visibility");
    rootMin.elemDOM.classList.remove("visibility");
    console.log(this.config.isMin);
    if (this.config.isMin) {
        root.elemDOM.classList.toggle("visibility");
    } else {
        rootMin.elemDOM.classList.toggle("visibility");
    }
};

Chat.prototype.loadOldConfig = function () {
    this.config.isMin = localStorage.getItem("isMin") !== 'false';
    if (localStorage.getItem("index") == null) {
        localStorage.setItem("index", "0");
    }
};

Chat.prototype.clickEvent = function () {
    this.config.DOMVariables.collapseButton.elemDOM.addEventListener("click", () => {
        this.config.isMin = !this.config.isMin;
        this.trigStatusChat();
    });
    this.config.DOMVariables.collapseButtonMin.elemDOM.addEventListener("click", () => {
        this.config.isMin = !this.config.isMin;
        this.trigStatusChat();
    });
    this.config.DOMVariables.sendButton.elemDOM.addEventListener("click", () => {
        this.sendMessage(this.config.DOMVariables.textArea.elemDOM, this.config.DOMVariables.output.elemDOM);
    });
    this.config.DOMVariables.sendButtonMin.elemDOM.addEventListener("click", () => {
        this.sendMessage(this.config.DOMVariables.textAreaMin.elemDOM, this.config.DOMVariables.output.elemDOM);
        this.config.isMin = !this.config.isMin;
        this.trigStatusChat();
    });
    window.addEventListener("beforeunload", () => {
        localStorage.setItem("isMin", this.config.isMin.toString());
    });
};

Chat.prototype.sendMessage = function (input, output) {
    var text = input.value;
    var message;
    var EMPTY = "";
    var answer;
    input.value = EMPTY;
    message = constructMessage(text);
    this.addMessage(message, output);
    setTimeout(() => {
        answer = constructAnswer(text);
        context.addMessage(answer, output);
    }, this.config.timeOfBotResponse);
};

Chat.prototype.addMessage = function (message, output) {
    var value;
    this.addOutputMessage(message, output);
    localStorage.setItem(localStorage.getItem("index"), message);
    value = parseInt(localStorage.getItem("index")) + 1;
    localStorage.setItem("index", value.toString());
};

Chat.prototype.addOutputMessage = function (message, output) {
    var div = document.createElement("div");
    div.classList.toggle("message_block");
    div.innerText = message;
    output.appendChild(div);
};

Chat.prototype.getDOMElem = function (DOMElem) {
    Object.keys(DOMElem).map(function (objectKey) {
        DOMElem[objectKey].elemDOM = document.getElementsByClassName(
            DOMElem[objectKey].className
        )[0];
    });
};

chatForSite = new Chat(configChat);
chatForSite.startChat();

QUnit.module("Test variables in local storage");
QUnit.test("Test index", function (assert) {
    assert.ok(localStorage.getItem("index") != null);
});
QUnit.test("Test isMin", function (assert) {
    assert.ok(localStorage.getItem("isMin") != null);
    assert.equal(localStorage.getItem("isMin"), chatForSite.config.isMin.toString());
});
QUnit.module("Test config");
QUnit.test("Test config", function (assert) {
    if (chatForSite.config.isMin) {
        assert.ok(!chatForSite.config.DOMVariables.chatComponentRootMin.elemDOM.classList.contains("visibility"));
        assert.ok(chatForSite.config.DOMVariables.chatComponentRoot.elemDOM.classList.contains("visibility"));
    } else {
        assert.ok(chatForSite.config.DOMVariables.chatComponentRootMin.elemDOM.classList.contains("visibility"));
        assert.ok(!chatForSite.config.DOMVariables.chatComponentRoot.elemDOM.classList.contains("visibility"));
    }
});
QUnit.test("Test trigStatusChat function", function (assert) {
    if (chatForSite.config.isMin) {
        chatForSite.config.isMin = !chatForSite.config.isMin;
        chatForSite.trigStatusChat();
        assert.ok(chatForSite.config.DOMVariables.chatComponentRootMin.elemDOM.classList.contains("visibility"));
        assert.ok(!chatForSite.config.DOMVariables.chatComponentRoot.elemDOM.classList.contains("visibility"));
        chatForSite.config.isMin = !chatForSite.config.isMin;
        chatForSite.trigStatusChat();
        assert.ok(!chatForSite.config.DOMVariables.chatComponentRootMin.elemDOM.classList.contains("visibility"));
        assert.ok(chatForSite.config.DOMVariables.chatComponentRoot.elemDOM.classList.contains("visibility"));
    } else {
        chatForSite.config.isMin = !chatForSite.config.isMin;
        chatForSite.trigStatusChat();
        assert.ok(!chatForSite.config.DOMVariables.chatComponentRootMin.elemDOM.classList.contains("visibility"));
        assert.ok(chatForSite.config.DOMVariables.chatComponentRoot.elemDOM.classList.contains("visibility"));
        chatForSite.config.isMin = !chatForSite.config.isMin;
        chatForSite.trigStatusChat();
        assert.ok(chatForSite.config.DOMVariables.chatComponentRootMin.elemDOM.classList.contains("visibility"));
        assert.ok(!chatForSite.config.DOMVariables.chatComponentRoot.elemDOM.classList.contains("visibility"));
    }
});
QUnit.module("Test functions");
QUnit.test("Test loaderConfig", function (assert) {
    localStorage.setItem("isMin", false.toString());
    chatForSite.loadOldConfig();
    assert.ok(!chatForSite.config.isMin);
    localStorage.setItem("isMin", true.toString());
    chatForSite.loadOldConfig();
    assert.ok(chatForSite.config.isMin);
});


