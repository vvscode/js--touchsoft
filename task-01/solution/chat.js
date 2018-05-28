function MessageStorage(stor) {
    if (stor !== null)
        this.array = JSON.parse(stor);
    else this.array = new Array(0);
}

MessageStorage.prototype.push = function (author, message, time) {
    this.array.push([author, message, time]);
    localStorage.setItem("history", JSON.stringify(this.array))
};

MessageStorage.prototype.getArray = function () {
    return this.array;
};

var chatWindow, minimizeBtn, msgContainer, msgTextArea, messageStor;


function initChat() {
    document.body.appendChild(createStyles());
    messageStor = new MessageStorage(localStorage.getItem('history'));
    chatWindow = createChatWindow();
    msgTextArea = createMsgTextArea();
    msgContainer = createMsgContainer();
    minimizeBtn = createMinimizeBtn();
    document.body.appendChild(chatWindow);
    chatWindow.appendChild(msgContainer);
    chatWindow.appendChild(minimizeBtn);
    chatWindow.appendChild(msgTextArea);
    chatWindow.appendChild(createSendMsgBtn());
    restoreMessagesHistory();
}

function createChatWindow() {
    var chatWindow = document.createElement('div');
    chatWindow.classList.add('main-window');
    var isMaximized = localStorage.getItem('isMaximized');
    if (isMaximized !== undefined && isMaximized === 'true')
        chatWindow.classList.add('maximized-window');
    else chatWindow.classList.add('minimized-window');
    return chatWindow;
}

function createMsgContainer() {
    var msgContainer = document.createElement('textarea');
    msgContainer.classList.add('msg-container');
    return msgContainer
}

function createMinimizeBtn() {
    var minimizeBtn = document.createElement('button');
    minimizeBtn.innerHTML = '-';
    minimizeBtn.onclick = function () {
        changeWindowState()
    };
    minimizeBtn.classList.add('minimize-btn');
    return minimizeBtn;
}

function createMsgTextArea() {
    var area = document.createElement('textarea');
    area.classList.add('msg-area');
    return area;
}

function createSendMsgBtn() {
    var btn = document.createElement('button');
    btn.innerHTML = "Send";
    btn.classList.add('send-msg-btn');
    btn.onclick = function () {
        var reg = /[\s]/;
        var text = msgTextArea.value;
        if (!reg.test(text) && text.length !== 0) {
            appendLineInChat('Вы', text);
            msgTextArea.value = '';
            setTimeout(appendLineInChat, 15000, 'бот', text.toUpperCase());
        }
    };
    return btn;
}


function changeWindowState() {
    if (chatWindow.classList.contains('maximized-window')) {
        chatWindow.classList.remove('maximized-window');
        chatWindow.classList.add('minimized-window');
        localStorage.setItem("isMaximized", 'false');
    }
    else {
        chatWindow.classList.remove('minimized-window');
        chatWindow.classList.add('maximized-window');
        localStorage.setItem("isMaximized", 'true');
    }

}

function createStyles() {
    var styles = document.createElement('style');
    styles.innerHTML += '\n.main-window {\n  width: 400px;\n  height: 600px;\n  border: 2px solid red;\n  position: fixed;\n  right: 10px;\n  background-color: white;\n}\n';
    styles.innerHTML += '\n.msg-container {\n  width: 370px;\n  height: 450px;\n position: absolute; border: 1px solid red; \n left: 10px;\n top: 50px; \n }\n';
    styles.innerHTML += '\n.minimized-window {\n  bottom: -570px;\n }\n';
    styles.innerHTML += '\n.maximized-window {\n  bottom: 0px;\n }\n';
    styles.innerHTML += '\n.minimize-btn {\n width: 30px;\n  height: 20px;\n  border: 1px solid red; float: right; }\n';
    styles.innerHTML += '\n.send-msg-btn {\n width: 45px;\n  height: 30px;\n position: absolute;\n border: 1px solid red;\n right: 7px;\n bottom: 10px; \n}\n';
    styles.innerHTML += '\n.msg-area {\n width: 330px;\n  height: 70px;\n position: absolute; border: 1px solid red; \n left: 10px;\n bottom: 10px; \n }\n';
    return styles;
}

function appendLineInChat(author, message) {
    var data = new Date();
    var time = data.getHours() + ':' + data.getMinutes();
    var line = time + ' ' + author + ': ' + message.toString();
    messageStor.push(author, message, time);
    msgContainer.innerHTML += line + '\n';
}

function restoreMessagesHistory() {
    messageStor.getArray().forEach(function (value) {
        msgContainer.innerHTML+=value[2] + ' ' + value[0] + ': ' + value[1]+'\n';
    });
}

initChat();