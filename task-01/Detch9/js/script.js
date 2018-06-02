'use strict';
/*Touch Soft Task1*/

var frame;
var sendButton;
var inputMessage;
var list;
var minimize;
var state;
var messages = [];

window.onload = function () {
    createForm();
    loadCSS();
    loadHistoryFromLocalStorage();
    minimizeChat();
};

function createForm() {
    frame = document.createElement('div');
    frame.innerHTML =
        "<div class='chatForm' id='form'>" +
            "<div class='chatHead'><button id='head-button'>-</button></div>" +
            "<div class='chatBody' id='body' style='display: none'>" + "" +
                "<div class='messagesList'><ul id='list'><li></li></ul></div>"+
                "<div class='messageBoard'>"+
                "<div class='messageInput'><textarea id='input-message'></textarea><button id='send-button' >Send!</button></div></div>" +
            "</div>" +
        "</div>";

    document.body.appendChild(frame);

    sendButton = document.getElementById('send-button');
    inputMessage = document.getElementById('input-message');
    list = document.getElementById('list');
    minimize = document.getElementById('head-button');
    
    sendButton.addEventListener('click', sendButtonOnClick);
    minimize.addEventListener('click', minimizeOnClick);
}

function minimizeOnClick() {
    minimizeChat(); 
}

function minimizeChat(){
    if (!state) {
        state = true;
        document.getElementById('body').style.display = 'none';
        document.getElementById('form').style.height = '40px';
        localStorage.setItem("state", JSON.stringify(true));
    }
    else {
        state = false;
        document.getElementById('body').style.display = 'block';
        document.getElementById('form').style.height = '400px';
        localStorage.setItem("state", JSON.stringify(false));
        scroll();
    }
}

function sendButtonOnClick(){
    var message = inputMessage.value;
    if (message !== '' && message!= null){
        sendMessage(message, 'Вы: ');
        setTimeout(sendMessage, 15000, '"' + message.toUpperCase() + '"', 'Бот: Ответ на ');
        inputMessage.value = '';
        scroll();
    }
}

function sendMessage(message, sender){
    var li = document.createElement('li');
    var textMessage = getDate() + ' ' + sender + message;
    li.appendChild(document.createTextNode(textMessage));
    list.appendChild(li);
    addMessageToLocalStorage(textMessage);
}

function loadCSS() {
    var head = document.getElementsByTagName('head')[0];
    var load = document.createElement('link');
    load.rel = 'stylesheet';
    load.href = 'https://rawgit.com/Detch9/js--touchsoft/master/task-01/Detch9/css/app.css';
    head.appendChild(load);
}

function getDate() {
    return new Date().toLocaleTimeString().substr(0, 5);
}

function loadHistoryFromLocalStorage() {
    messages = JSON.parse(localStorage.getItem("messages"));
    if(localStorage) {
        if(localStorage.getItem("messages")) {
            var messages = JSON.parse(localStorage.getItem("messages"));
            for(var i in messages) {
                var li = document.createElement('li');
                var textMessage = messages[i];
                li.appendChild(document.createTextNode(textMessage));
                list.appendChild(li);
                scroll();
            }  
            scroll();
        }
        else {
            localStorage.setItem("messages", JSON.stringify([]));
        }
        state = localStorage.getItem("state")  === 'false';
    }   
}

function addMessageToLocalStorage(message){
    var messages = JSON.parse(localStorage.getItem("messages"));
    messages.push(message);
    localStorage.setItem("messages", JSON.stringify(messages));
}

function scroll(){
    list.scrollTop = list.scrollHeight;
}