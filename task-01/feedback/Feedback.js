window.onload = function() {
    checkWindow();
};

function generateFeedback() {
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
    elem.value = localStorage.getItem("message");
}

function createCollapsedFeedback() {
    var bodyElement = document.body;
    bodyElement.appendChild(generateCollapsedFeedback());
}

function checkWindow() {
    var isOpen;
    if ((isOpen = localStorage.getItem("isOpen")) != null) {
        if (isOpen === "feedback") {
            createFeedback();
        } else {
            createCollapsedFeedback();
        }
    } else {
        localStorage.setItem("isOpen", "button");
        createCollapsedFeedback();
    }
}

function sendMessage() {
    var messageArea = document.getElementById("messageArea");
    var message = localStorage.getItem("message");
    var messageHistory;
    if (message) {
        messageHistory = message;
    } else {
        messageHistory = "";
        localStorage.setItem("message", messageHistory);
    }
    message = messageArea.value;
    var date = new Date();
    var minute = checkTime(date.getMinutes());
    var hour = checkTime(date.getHours());
    messageHistory =
        messageHistory + "\n" + [hour, minute].join(":") + " You: " + message;
    messageArea.value = "";
    if (document.getElementById("messageHistory")) {
        document.getElementById("messageHistory").value = messageHistory;
    }
    localStorage.setItem("message", messageHistory);
    setTimeout(getReplyForMessage(message), 15000);
}

function checkTime(time) {
    if (time < 10) {
        time = "0" + time;
    }
    return time;
}

function getReplyForMessage(message) {
    return function replyToMessage() {
        var messageHistory = localStorage.getItem("message");
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
        localStorage.setItem("message", messageHistory);
    };
}

function showFeedback() {
    var bodyElement = document.body;
    var changeElem = document.getElementById("elemShowFeedback");
    bodyElement.replaceChild(generateFeedback(), changeElem);
    localStorage.setItem("isOpen", "feedback");
    var elem = document.getElementById("messageHistory");
    elem.value = localStorage.getItem("message");
}

function hideFeedback() {
    var bodyElement = document.body;
    var changeElem = document.getElementById("feedBack");
    bodyElement.replaceChild(generateCollapsedFeedback(), changeElem);
    localStorage.setItem("isOpen", "button");
}
