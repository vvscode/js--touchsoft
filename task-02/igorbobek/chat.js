/* exported variableName */

'use-strict';


var style =
    '.igorbobek-my-chat {' +
    'width: 400px;' +
    'height: max-content;' +
    'border: 1px solid #e4e4e4;' +
    'position: fixed;' +
    'right: 0px;' +
    'bottom: 0px;' +
    'background-color: #000000b3;' +
    'border-radius: 12px;' +
    'padding: 4px;' +
    'z-index = 9999' +
    '}' +
    '.igorbobek-content {' +
    'height: 200px;' +
    'margin-top: 36px;' +
    'width: 100%;' +
    'background: #fff;' +
    'border-radius: 14px;' +
    'text-align: center;' +
    'font-size: 30px;' +
    'overflow-y: auto;' +
    '}' +
    '.igorbobek-minimizer {' +
    'border: none;' +
    'float: right;' +
    'width: 30px;' +
    'height: 30px;' +
    'border-radius: inherit;' +
    'font-family: cursive;' +
    'font-size: larger;' +
    '}' +
    '.igorbobek-mini h4 {' +
    'display: contents;' +
    '}' +
    '.igorbobek-message-box {' +
    'height: 50px;' +
    'width: 70%;' +
    'background: white;' +
    'border-radius: 12px;' +
    'margin-top: 100px;' +
    'bottom: 4px;' +
    'resize: none;' +
    'overflow: auto;' +
    'padding: 8px;' +
    '}' +
    '.igorbobek-send {' +
    'float: right;' +
    'border: none;' +
    'position: absolute;' +
    'bottom: 14px;' +
    'right: 10px;' +
    'border-radius: 6px;' +
    'height: 30px;' +
    'background: #aef5ff;' +
    '}' +
    '.igorbobek-icon-chat {' +
    'margin-top: 23px;' +
    'position: absolute;' +
    'top: -40px;' +
    'height: fit-content;' +
    'left: 38px;' +
    'background: #dddddd;' +
    'border-radius: 11px;' +
    'padding: 7px;' +
    'font-variant: small-caps;' +
    'color: #4c4c4c;' +
    '}' +
    '.igorbobek-message {' +
    'text-align: left;' +
    'font-style: italic;' +
    'font-size: 18px;' +
    'padding: 7px;' +
    'margin-top: 4px;' +
    'background: #b2cdff;' +
    'border-radius: 18px;' +
    '}';
var srcScript = document.currentScript.src;
var buttonMinimilizer = null;
var container = null;
var sendButton = null;
var messageBox = null;
var mainDiv = null;
var iconChat = null;
var content = null;
var answerDelay = 15;
var checkingDOMReady;
var ChatInstance;

/* exported ChatConfig */
var ChatConfig = function f(cfg){
    if(cfg !== undefined) {
        ChatInstance.getInstance().initConfig(cfg);
    }
};


function getCookie(itemName) {
    var i;
    var item;
    var name = itemName+"=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var items = decodedCookie.split(';');
    for (i = 0; i < items.length; i += 1) {
        item = items[i];
        item = item.trim();
        if (item.indexOf(name) === 0) {
            return item.substring(name.length, item.length);
        }
    }
    return '';
}


function Chat(){
    this.config = undefined;

    this.setConfigFromSrcScript();
}

Chat.prototype.setConfigFromSrcScript = function f() {
    var parameters = {};
    var parameterStr;
    var parametersString = srcScript.split('?')[1];
    if(parametersString !== undefined){
        parametersString.split('&').forEach(function fun(value) {
            parameterStr = value.split('=');

            if(parameterStr[1] === 'true'){
                parameterStr[1] = true;
            }else if(parameterStr[1] === 'false'){
                parameterStr[1] = false;
            }else{
                parameterStr[1] = decodeURI(parameterStr[1]);
            }

            parameters[parameterStr[0]] = parameterStr[1];
        });
        this.initConfig(parameters);
    }
};

Chat.prototype.initConfig = function f(cfg) {
    this.config = cfg;
};

Chat.prototype.setTitle = function f(newTitle){
    iconChat.innerText = decodeURI(newTitle
        || this.config.title);
};


Chat.prototype.minimizeContent = function f() {
    if(ChatInstance.getInstance().config.allowMinimize) {
        container.hidden =
            getCookie('minimize') !== '' ? getCookie('minimize') === 'true' : true;
        if (container.hidden) {
            buttonMinimilizer.innerHTML = '-';
        } else {
            buttonMinimilizer.innerHTML = '+';
        }
        container.hidden = !container.hidden;
        document.cookie = "minimize=" + container.hidden;
    }
};


Chat.prototype.setAllowMinimize = function f1(flag) {
    this.config.allowMinimize = flag;
    if (flag) {
        buttonMinimilizer = document.createElement('button');
        buttonMinimilizer.classList.add('igorbobek-minimizer');
        mainDiv.prepend(buttonMinimilizer);
        buttonMinimilizer.addEventListener('click', this.minimizeContent);
        this.minimizeContent();
    }else if(buttonMinimilizer !== null && !flag){
        buttonMinimilizer.remove();
    }
};

Chat.prototype.setPosition = function f(position) {
    if (position === 'left'){
        mainDiv.style.left = '0px';
    }
};

Chat.prototype.setCssClass = function f(className){
    mainDiv.classList = className;
};


Chat.prototype.initChatConfiguration = function f() {
    this.setAllowMinimize(this.config.allowMinimize);
    this.setTitle(this.config.title);
    this.setPosition(this.config.position);
    this.setCssClass(this.config.cssClass);
    this.setUserName(this.config.requireName);
    this.initListeners();
};

Chat.prototype.setUserName = function (flag) {
    var username;
    if(flag){
        username = prompt('Input your name', '');
        if(username !== ''){
            localStorage.setItem('username', username);
        }
    }
};


ChatInstance = (function fun() {
    var instance;

    function createInstance() {
        return new Chat();
    }

    return {
        getInstance: function f() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();


function Message(name, message, time, answered) {
    this.name = name;
    this.message = message;
    this.time = time;
    this.answered = answered || false;
    this.answer(this);
}

Message.prototype.generateDateForBotMessage = function f() {
    var dateForBotMessage = new Date(this.time);
    dateForBotMessage.setSeconds(dateForBotMessage.getSeconds() + answerDelay);
    return dateForBotMessage;
};

Message.prototype.secondsLeftForAnswer = function f() {
    return new Date().getTime() - this.time.getTime();
};

Message.prototype.answer = function f(that) {
    var sendBotMessage = function fun() {
        var messageBot = new Message(
            ChatInstance.getInstance().config.botName,
            "Ответ на: " + that.message.toUpperCase(),
            that.generateDateForBotMessage(),
            true
        );
        messageBot.sendMessage();
        messageBot.saveMessage();
        that.updateMessageInLocalStorage(that.time, true);
        that.setAnswered(true);
    };
    if (!that.answered) {
        setTimeout(sendBotMessage, answerDelay * 1000 - this.secondsLeftForAnswer());
    }
};

Message.prototype.setAnswered = function f(answered) {
    this.answered = answered;
};

Message.prototype.updateMessageInLocalStorage = function f(searchTime, newAnswered) {
    var i;
    var messageObject;
    var messages = JSON.parse(localStorage.getItem('messages'));
    if (messages !== null) {
        for (i = 0; i < messages.length; i += 1) {
            messageObject = messages[i];
            if (
                new Date(messageObject.time).getTime() ===
                new Date(searchTime).getTime()
            ) {
                messageObject.answered = newAnswered;
            }
        }
        localStorage.removeItem('messages');
        localStorage.setItem('messages', JSON.stringify(messages));
    }
};

Message.prototype.saveMessage = function f() {
    var messages = JSON.parse(localStorage.getItem('messages'));
    if (messages === null) {
        messages = [this];
    } else {
        messages.push(this);
    }
    localStorage.setItem('messages', JSON.stringify(messages));
};

Message.prototype.getTimeForMessage = function f() {
    var time;
    var options = {hour: 'numeric', second: 'numeric', minute: 'numeric'};
    if (ChatInstance.getInstance().config.showDateTime){
        time = this.time.toLocaleString('ru-RU', options);
    }else {
        time = '';
    }
    return time;
};

Message.prototype.sendMessage = function f() {
    var messageDiv;
    if (!(this.message === '')) {
        messageDiv = document.createElement('div');
        messageDiv.innerHTML = this.getTimeForMessage() + ' ' +
            this.name + ':<br>' + this.message;
        messageDiv.classList.add('igorbobek-message');
        content.appendChild(messageDiv);
    }
};

Chat.prototype.recoveryMessages = function f() {
    var messages = JSON.parse(localStorage.getItem('messages'));
    if (messages !== null) {
        messages.forEach(function fun(message) {
            new Message(
                message.name,
                message.message,
                new Date(message.time),
                message.answered
            ).sendMessage();
        });
    }
};

Chat.prototype.initStyle = function f() {
    var styles = document.createElement('style');
    styles.innerHTML = style;
    document.body.appendChild(styles);
}


function listenerSendButton(){
    var message = new Message(
        'You',
        messageBox.value.replace(new RegExp('\\n', 'g'), '<br>'),
        new Date()
    );
    message.sendMessage();
    message.saveMessage();
}


function getCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + window.pageYOffset,
        left: box.left + window.pageXOffset
    };
}

Chat.prototype.dragAndDrop = function f(e) {
    var coordinates = getCoords(mainDiv);
    var shiftX = e.pageX - coordinates.left;
    var shiftY = e.pageY - coordinates.top;

    function moveAt(event) {
        mainDiv.style.left = event.pageX - shiftX + 'px';
        mainDiv.style.top = event.pageY - shiftY + 'px';
    }

    moveAt(e);

    document.onmousemove = function(event) {
        moveAt(event);
    };

};


Chat.prototype.positioningChat =function () {
    var rect = mainDiv.getBoundingClientRect();
    mainDiv.removeAttribute("style");

    if (rect.top + rect.height / 2 < window.innerHeight / 2){
        mainDiv.style.top = '18px';
    }else{
        mainDiv.style.bottom = '0px';
    }

    if (rect.left + rect.width / 2 < window.innerWidth / 2){
        mainDiv.style.left = '0px';
    }else{
        mainDiv.style.right = '0px';
    }
};

Chat.prototype.initListeners = function f() {
    var messagesScrollDown = function fun() {
        content.scrollTo(0, content.scrollHeight);
    };
    sendButton.addEventListener('click', listenerSendButton);

    content.addEventListener('DOMSubtreeModified', messagesScrollDown);

    if (this.config.allowDrag === true){

        iconChat.addEventListener('mousedown', ChatInstance.getInstance().dragAndDrop);

        iconChat.addEventListener('mouseup', function clear() {
            document.onmousemove = null;
            mainDiv.onmouseup = null;
            ChatInstance.getInstance().positioningChat();
        });
    }
};

Chat.prototype.recovery = function f() {
    this.minimizeContent();
    this.recoveryMessages();
};



Chat.prototype.drawChat = function f() {
    var form;

    mainDiv = document.createElement('div');
    mainDiv.classList.add('igorbobek-my-chat');
    document.body.appendChild(mainDiv);

    iconChat = document.createElement('h3');
    iconChat.classList.add('igorbobek-icon-chat');
    mainDiv.appendChild(iconChat);

    container = document.createElement('div');
    container.classList.add('igorbobek-chat-container');
    mainDiv.appendChild(container);

    content = document.createElement('div');
    content.classList.add('igorbobek-content');
    container.appendChild(content);

    form = document.createElement('form');
    form.setAttribute('onsubmit', 'return false;');
    container.appendChild(form);

    messageBox = document.createElement('textarea');
    messageBox.classList.add('igorbobek-message-box');
    form.appendChild(messageBox);

    sendButton = document.createElement('button');
    sendButton.classList.add('igorbobek-send');
    sendButton.innerHTML = 'Отправить';
    form.appendChild(sendButton);

};

Chat.prototype.init = function f() {
    this.initStyle();
    this.drawChat();
    this.initChatConfiguration();
    this.recovery();
};


// setInterval и вложенное в него условие решает проблему добавления
// чата на сторонний сайт через консоль, html(head), html(body)
function createChat(){
    if (document.readyState !== 'complete') return;
    clearInterval(checkingDOMReady);
    ChatInstance.getInstance().init();
}

checkingDOMReady = setInterval( createChat, 16);

