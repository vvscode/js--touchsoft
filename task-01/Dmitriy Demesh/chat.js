messages = [];
style = true;
minimized = true;

messagesKey = "messages";
minimizedKey = "minimized";

historyItemClass = "message-item";
messageTimeClass = "message-time";
messageSenderClass = "message-sender";
messageHistoryClass = "message-history";
messageFormClass = "chat-message";
minimizeButtonClass = "minimize-button";
chatContentClass = "chat-content";
hiddenClass = "hidden";
messageTextClass = "message-text";

messageSender = "Я";

answer = {
    insertionRegExp: /\[.*\]/,
    pattern: "Ответ на \"{[]}\"",
    sender: "Бот"
};

function HistoryItem(date, sender, text) {
    this.date = date.getHours() + ":" + date.getMinutes();
    this.sender = sender;
    this.text = text;
}

function toggleMinimize() {
    var content = document.getElementById(chatContentClass);
    content.classList.toggle(hiddenClass);
    minimized = content.classList.contains(hiddenClass);
}

function formatItem(item) {
    var historyItem = document.createElement("div");
    var messageTime = document.createElement("div");
    var sender = document.createElement("div");
    var text = document.createElement("div");

    historyItem.classList.add(historyItemClass);
    messageTime.classList.add(messageTimeClass);
    sender.classList.add(messageSenderClass);
    text.classList.add(messageTextClass);

    messageTime.innerText = item.date;
    sender.innerText = item.sender;
    text.innerText = item.text;

    historyItem.appendChild(messageTime);
    historyItem.appendChild(sender);
    historyItem.appendChild(text);

    return historyItem;
}

function printItems(items){
    var history = document.getElementsByClassName(messageHistoryClass)[0];

    for (var i = 0; i < items.length; i++) {
        history.appendChild(formatItem(items[i]));
    }
}

function sendMessage(event) {
    var history = document.getElementsByClassName(messageHistoryClass)[0];
    var sendDate = new Date();
    var item = new HistoryItem(sendDate, messageSender, this.text.value);

    history.appendChild(formatItem(item));
    messages.push(item);

    setTimeout(function () {
        sendAnswer(item);
    }, 15000);

    this.text.value = "";

    event.preventDefault();
}

function generateAnswer(message){
    return answer.pattern.replace(answer.insertionRegExp, message.toUpperCase());
}

function sendAnswer(item) {
    var sendDate = new Date();
    var answerItem = new HistoryItem(sendDate, answer.sender, generateAnswer(item.text));
    messages.push(answerItem);

    var history = document.getElementsByClassName(messageHistoryClass)[0];
    history.appendChild(formatItem(answerItem));
}

function addStyle() {
    var styles = document.createElement("style");
    styles.innerHTML = "#chat-panel {\n" +
        "    position: fixed;\n" +
        "    bottom: 0px;\n" +
        "    right: 10%;\n" +
        "\n" +
        "    background: #3C4896;\n" +
        "    color: white;\n" +
        "    padding: 10px;\n" +
        "    border-top-right-radius: 15px;\n" +
        "    border-top-left-radius: 15px;\n" +
        "\n" +
        "    width: 80%;\n" +
        "    max-width: 400px;\n" +
        "\n" +
        "    font-family: 'Open Sans', sans-serif;\n" +
        "}\n" +
        "#chat-header{\n" +
        "    text-align: right;\n" +
        "}\n" +
        "#chat-message{\n" +
        "    display: table;\n" +
        "    width: 100%;\n" +
        "}\n" +
        "#current-message{\n" +
        "    display: table-cell;\n" +
        "    vertical-align: middle;\n" +
        "    height: 30px;\n" +
        "    padding: 5px;\n" +
        "}\n" +
        "#current-message-area{\n" +
        "    -moz-box-sizing: border-box; /* Для Firefox */\n" +
        "    -webkit-box-sizing: border-box; /* Для Safari и Chrome */\n" +
        "    box-sizing: border-box;\n" +
        "    width: 100%;\n" +
        "    height: 30px;\n" +
        "}\n" +
        "#send-message{\n" +
        "    display: table-cell;\n" +
        "    vertical-align: middle;\n" +
        "    height: 30px;\n" +
        "    padding: 5px;\n" +
        "}\n" +
        "#send-message button{\n" +
        "    height: 30px;\n" +
        "    width: 100%;\n" +
        "}\n" +
        ".message-history{\n" +
        "    display: inline-block;\n" +
        "    background: white;\n" +
        "    color: #3C4896;\n" +
        "    height: 400px;\n" +
        "    width: 100%;\n" +
        "    overflow-y: auto;\n" +
        "    overflow-x: hidden;\n" +
        "    margin-top: 10px;\n" +
        "}\n" +
        ".message-item:after{\n" +
        "    clear: bottom;\n" +
        "}\n" +
        ".message-item{\n" +
        "    border: #8891CB 2px solid;\n" +
        "    padding-bottom: 5px;\n" +
        "    margin-bottom: 5px;\n" +
        "}\n" +
        ".message-item div{\n" +
        "    padding: 10px;\n" +
        "    float: left;\n" +
        "    margin-right: 5px;\n" +
        "    word-wrap: break-word;\n" +
        "    border-bottom-left-radius: 5px;\n" +
        "    border-bottom-right-radius: 5px;\n" +
        "}\n" +
        ".message-item .message-time{\n" +
        "    background-color: #8891CB;\n" +
        "    color: white;\n" +
        "}\n" +
        ".message-item .message-sender{\n" +
        "    background-color: #BBC1E5;\n" +
        "}\n" +
        ".message-item .message-text{\n" +
        "    float: none;\n" +
        "}"+
        ".hidden{\n" +
        "    display: none;\n" +
        "}";

    document.head.appendChild(styles);
}

function initElements() {
    var chatBox = "<div id=\"chat-panel\">\n" +
        "    <div id=\"chat-header\">\n" +
        "        <button id=\"" + minimizeButtonClass + "\">-</button>\n" +
        "    </div>\n" +
        "    <div id=\"" + chatContentClass + "\" class=\""+ (minimized ? "hidden":"") +"\">\n" +
        "        <div class=\"" + messageHistoryClass + "\">\n" +
        "        </div>\n" +
        "\n" +
        "        <form id=\"" + messageFormClass + "\">\n" +
        "            <div id=\"current-message\">\n" +
        "                <textarea id=\"current-message-area\" name=\"text\"></textarea>\n" +
        "            </div>\n" +
        "            <div id=\"send-message\">\n" +
        "                <button type=\"submit\">Send</button>\n" +
        "            </div>\n" +
        "        </form>\n" +
        "    </div>\n" +
        "</div>";

    document.body.innerHTML += chatBox;
}

function initMessages(){
    var messageString = localStorage.getItem(messagesKey);
    if (messageString) {
        messages = JSON.parse(messageString);
    }
}

function saveMessages(){
    localStorage.setItem(messagesKey, JSON.stringify(messages));
}

function initMinimized(){
    minimized = localStorage.getItem(minimizedKey) == "true";
}

function saveMinimized(){
    localStorage.setItem(minimizedKey, minimized.toString());
}

function initChat() {
    if (style) {
        addStyle();
    }

    initMinimized();

    initElements();
    var minimizeButton = document.getElementById(minimizeButtonClass);
    minimizeButton.onclick = toggleMinimize;

    initMessages();

    printItems(messages);

    var form = document.getElementById(messageFormClass);

    form.onsubmit = sendMessage;
}

function destroyChat() {
    saveMessages();
    saveMinimized();
}

window.onload = initChat;
window.onbeforeunload = destroyChat;