var responseTimeInSeconds = 15;

window.onload = function (ev) {
    var chatbox = document.createElement("div");
    chatbox.className = "chatbox";

    chatbox.style = "position: fixed; right:0; bottom: 0; background: green; width: 300px; height: 50px";

    chatbox.innerHTML = "<div style='position: relative'></div>" +
        "<h2>Start chat</h2>" +
        "<div class='buttonCloseOpen' style='position: absolute; top: 0; right: 0; cursor: pointer;'>^</div>" +
        "<div class='chatlogs' id='chatlogs' style='padding: 10px; height: 257px; overflow-y: auto'></div>" +
        "<div class='chat-form'>" +
        "<form class='sendForm' id='sendForm'>" +
        "<textarea name='textarea' placeholder='Type a message...' style='width: 235px; height: 50px'></textarea>" +
        "<button style='position: relative; bottom: 21px; width: 59px; height: 62px;'>Send</button>" +
        "</form>" +
        "</div>";

    document.getElementsByTagName("body")[0].appendChild(chatbox);
    document.querySelector('.chatlogs').innerHTML = localStorage.getItem('listMessages');

    if ('true' === localStorage.getItem("isOpen")) {
        getParametersOpenForm();
        chatbox.classList.add("active");
    }
    else {
        getParametersCloseForm();
    }

    document.querySelector(".buttonCloseOpen").onclick = function () {
        var chatbox = document.querySelector(".chatbox");
        if (chatbox.classList.contains("active")) {
            getParametersCloseForm();
            localStorage.setItem('isOpen', false);
        } else {
            getParametersOpenForm();
            localStorage.setItem('isOpen', true);
        }
        chatbox.classList.toggle("active");
    };

    document.getElementById("sendForm").onsubmit = function (event) {
        event.preventDefault();
        var isClient = true;
        var text = this.textarea.value;

        sendMessage(isClient, text);
        setTimeout(sendMessage, responseTimeInSeconds * 1000, !isClient, text);
        this.textarea.value = '';
    };
};

function sendMessage(isClient, text) {
    if ('' != text) {
        var message;
        var date = new Date();
        var time = date.getMinutes() + ":" + date.getSeconds();

        var chatlogs = document.querySelector('.chatlogs');
        var log = document.createElement("div");

        var p = document.createElement('p');
        p.style = "word-wrap: break-word;";

        if (isClient) {
            message = time + ' Вы: ' + text;
        }
        else {
            message = time + ' Bot: Ответ на : ' + text.toUpperCase();
        }

        p.innerHTML = message;

        log.appendChild(p);
        chatlogs.appendChild(log);

        localStorage.setItem('listMessages', chatlogs.innerHTML);
    }
}

function getParametersOpenForm() {
    document.querySelector(".chatbox").style.height = "400px";
    document.querySelector(".chatbox h2").innerText = "Chat";
    document.querySelector(".buttonCloseOpen").innerText = "X";
}

function getParametersCloseForm() {
    document.querySelector(".chatbox").style.height = "50px";
    document.querySelector(".chatbox h2").innerText = "Start chat";
    document.querySelector(".buttonCloseOpen").innerText = "^";
}


