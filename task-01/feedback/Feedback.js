window.onload = function() {
    checkWindow();
};

function generateFeedback() {
    var bodyElement = document.body;
    var container = document.createElement("container");
    container.id = "feedBack";
    container.style.backgroundColor = "black";
    container.style.position = "fixed";
    container.style.border = "solid";
    container.style.right = "5vw";
    container.style.top = "50vh";
    container.innerHTML =
        "<form><input type='button' value='>>' id='collapse' onclick='hideFeedback()'><p><textarea id='messageHistory' rows=\"8\" cols=\"30\" name=\"text\" disabled>" +
        '</textarea></p><textarea id=\'messageArea\' rows="3" cols="30" name="text"></textarea>' +
        "<br></ber><input type='button' id='sendMessageButton' value='Send Message' onclick='sendMessage()'></form>";
    return container;
}

function generateCollapsedFeedback() {
    var collapsedFeedback = document.createElement("div");
    collapsedFeedback.id = "elemShowFeedback";
    collapsedFeedback.style.position = "fixed";
    collapsedFeedback.style.right = "5vw";
    collapsedFeedback.style.top = "80vh";
    collapsedFeedback.innerHTML =
        "<form><input type='text' id='messageArea'><input type='button' id='sendMessageButton' value='Send Message' onclick='sendMessage()'><input type='button' value='<<' id='maximize' onclick='showFeedback()'></form>";
    return collapsedFeedback;
}

function createFeedback() {
    var bodyElement = document.body;
    bodyElement.appendChild(generateFeedback());
    var elem = document.getElementById("messageHistory");
    elem.value = sessionStorage.getItem("message");
}

function createCollapsedFeedback() {
    var bodyElement = document.body;
    bodyElement.appendChild(generateCollapsedFeedback());
}

function checkWindow() {
    var isOpen;
    if ((isOpen = sessionStorage.getItem("isOpen")) != null) {
        if (isOpen === "feedback") {
            createFeedback();
        } else {
            createCollapsedFeedback();
        }
    } else {
        sessionStorage.setItem("isOpen", "button");
        createCollapsedFeedback();
    }
}

function sendMessage() {
    var messageArea = document.getElementById("messageArea");
    var message = sessionStorage.getItem("message");
    if (message) {
        var messageHistory = message;
    } else {
        var messageHistory = "";
        sessionStorage.setItem("message", messageHistory);
    }
    var message = messageArea.value;
    var date = new Date();
    var minute = checkTime(date.getMinutes());
    var hour = checkTime(date.getHours());
    messageHistory =
        messageHistory + "\n" + [hour, minute].join(":") + " You: " + message;
    messageArea.value = "";
    if (document.getElementById("messageHistory")) {
        document.getElementById("messageHistory").value = messageHistory;
    }
    sessionStorage.setItem("message", messageHistory);
    setTimeout(getReplyForMessage(message), 15000);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function getReplyForMessage(message) {
    var rtm = function replyToMessage() {
        var messageHistory = sessionStorage.getItem("message");
        var date = new Date();
        var minute = checkTime(date.getMinutes());
        var hour = checkTime(date.getHours());
        messageHistory =
            messageHistory +
            "\n" +
            [hour, minute].join(":") +
            " Bot: Response to '" +
            message +
            "'";
        if (document.getElementById("messageHistory")) {
            document.getElementById("messageHistory").value = messageHistory;
        }
        sessionStorage.setItem("message", messageHistory);
    };
    return rtm;
}

function showFeedback() {
    var bodyElement = document.body;
    var changeElem = document.getElementById("elemShowFeedback");
    bodyElement.replaceChild(generateFeedback(), changeElem);
    sessionStorage.setItem("isOpen", "feedback");
    var elem = document.getElementById("messageHistory");
    elem.value = sessionStorage.getItem("message");
}

function hideFeedback() {
    var bodyElement = document.body;
    var changeElem = document.getElementById("feedBack");
    bodyElement.replaceChild(generateCollapsedFeedback(), changeElem);
    sessionStorage.setItem("isOpen", "button");
}
