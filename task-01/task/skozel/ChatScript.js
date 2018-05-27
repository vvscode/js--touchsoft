var configChat = {
    timeOfBotResponse: 15000,
    pathToHtmlFile: "ChatComponent.html",
    pathToCssFile: "StyleChatComponent.css",
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
    },
};

function chat(configChat) {
    this.config = configChat;
};

chat.prototype.startChat = function () {
    this.getHTML();
    this.addCSS();
};

chat.prototype.addCSS = function () {
    var link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", this.config.pathToCssFile);
    document.head.appendChild(link);
};

chat.prototype.getHTML = function () {
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

chat.prototype.includeHTML = function (elem) {
    var div = document.createElement("div");
    div.innerHTML = elem;
    document.body.appendChild(div);
};

chat.prototype.configurate = function () {
    this.getDOMElem();
    this.clickEvent();
    this.loadOldConfig();
    this.trigStatusChat();
    this.loadOldMessage();
};

chat.prototype.loadOldMessage = function(){
    for (var i=0;i<parseInt(localStorage.getItem("index"));i++){
        this.addOutputMessage(localStorage.getItem(i.toString()),this.config.DOMVariables.output.elemDOM);
    }
};

chat.prototype.trigStatusChat = function () {
    var root = this.config.DOMVariables.chatComponentRoot;
    var root_min = this.config.DOMVariables.chatComponentRootMin;
    root.elemDOM.classList.remove("visibility");
    root_min.elemDOM.classList.remove("visibility");
    console.log(this.config.isMin);
    if (this.config.isMin) {
        root.elemDOM.classList.toggle("visibility");
    } else {
        root_min.elemDOM.classList.toggle("visibility");
    }
};

chat.prototype.loadOldConfig = function () {
    this.config.isMin = localStorage.getItem("isMin") === 'false' ? false : true;
    if (localStorage.getItem("index") == null) {
        localStorage.setItem("index", "0");
    }
};

chat.prototype.clickEvent = function () {
    var context = this;
    this.config.DOMVariables.collapseButton.elemDOM.addEventListener("click", function () {
        context.config.isMin = !context.config.isMin;
        context.trigStatusChat();
    });
    this.config.DOMVariables.collapseButtonMin.elemDOM.addEventListener("click", function () {
        context.config.isMin = !context.config.isMin;
        context.trigStatusChat();
    });
    this.config.DOMVariables.sendButton.elemDOM.addEventListener("click", function () {
        context.sendMessage(context.config.DOMVariables.textArea.elemDOM, context.config.DOMVariables.output.elemDOM);
    });
    this.config.DOMVariables.sendButtonMin.elemDOM.addEventListener("click", function () {
        context.sendMessage(context.config.DOMVariables.textAreaMin.elemDOM, context.config.DOMVariables.output.elemDOM);
        context.config.isMin = !context.config.isMin;
        context.trigStatusChat();
    });
    window.addEventListener("beforeunload",function () {
       localStorage.setItem("isMin",context.config.isMin.toString());
    });
};

chat.prototype.sendMessage = function (input, output) {
    var text = input.value;
    input.value = "";
    var message = constructMessage(text);
    this.addMessage(message, output);
    var context = this;
    setTimeout( function () {
        var answer = constructAnswer(text);
        context.addMessage(answer, output);
    }, this.config.timeOfBotResponse);
};

chat.prototype.addMessage = function (message, output) {
    this.addOutputMessage(message,output);
    localStorage.setItem(localStorage.getItem("index"), message);
    localStorage.setItem("index", (parseInt(localStorage.getItem("index")) + 1).toString());
};

chat.prototype.addOutputMessage = function (message,output) {
    var div = document.createElement("div");
    div.classList.toggle("message_block");
    div.innerText = message;
    output.appendChild(div);
};

function constructMessage(text) {
    var day = new Date();
    var prefix = "Вы: ";
    return "[" + day.getHours() + ":" + day.getMinutes() + "] " + prefix + text;
};

function constructAnswer(text) {
    var day = new Date();
    var prefix = "Бот: Ответ на \"";
    return "[" + day.getHours() + ":" + day.getMinutes() + "] " + prefix + text + "\"";
};

chat.prototype.getDOMElem = function () {
    for (var elem in this.config.DOMVariables) {
        this.config.DOMVariables[elem].elemDOM = document.getElementsByClassName(this.config.DOMVariables[elem].className)[0];
    }
}

var chatForSite = new chat(configChat);
chatForSite.startChat();

