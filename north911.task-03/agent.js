function addNewUser() {

    var tab = document.getElementById('usersTab');
    var count = 0;
    var keys = new Array();
    fetch('https://touchsoftchat.firebaseio.com/users.json').then(function (r) {
        return r.json();
    }).then(function (obj) {
        keys = Object.keys(obj);
        return Object.values(obj);
    }).then(function (list) {
        return list.map(function (i) {
            var opt = document.createElement('option');
            opt.value = keys[count];
            opt.text = 'user' + count;
            count++;
            tab.appendChild(opt);
            return i;
        });
    }).then(console.log);

    var select = document.getElementById('usersTab');
    select.addEventListener("change", addChatLogFromFireBase);
}

var addChatLogFromFireBase = function () {

    document.getElementById('logArea').textContent='';
    var logArea = document.getElementById('logArea');
    var userID = document.getElementById('usersTab').value;
    fetch('https://touchsoftchat.firebaseio.com/users/' + userID +
        '/messages.json').then(function (r) {
        return r.json();
    }).then(function (obj) {
        return Object.values(obj);
    }).then(function (list) {
        return list.map(function (i) {
            logArea.innerHTML += i[0].message.replace('<br>', '');
            return i[0];
        });
    }).then(console.log);
}

var sendButtonController = function () {

    var content = document.getElementById('msgInput').value;
    sendMessage('Agent', content);
}

var sendMessage = function (sender, message) {

    var chatLog = document.getElementById('logArea');
    var date = new Date;

    var hours = date.toLocaleTimeString();
    chatLog.innerHTML += hours;

    chatLog.innerHTML += " " + sender + ': ' + message + '\n';
    document.getElementById('msgInput').value = '';
    var userId = document.getElementById('usersTab').value;
    saveMessageToFireBase(hours + " " + sender + ': ' + message +'\n'+ '<br>', userId);
}

var saveMessageToFireBase = function (message, userId) {

    fetch('https://touchsoftchat.firebaseio.com/users/' + userId + '/messages.json', {
        method: 'POST',
        body: JSON.stringify([
            {
                message: message,
            },
        ]),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(console.log);
}

var chatInit = function () {
    var sendBtn = document.getElementById('sendBtn');
    sendBtn.addEventListener('click', sendButtonController)
}

setInterval(function(){
    addChatLogFromFireBase();
}, 5000);

window.addEventListener('load', addNewUser);
window.addEventListener('load', chatInit);


