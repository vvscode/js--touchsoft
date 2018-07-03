var chatURL = 'https://mychat-b0091.firebaseio.com/';
var userList = document.getElementById('dashboard-users-list');
var sorterTag = document.getElementById('dashboard-sorter');
var filterTag = document.getElementById('dashboard-filter');
var closeButton = document.getElementById('dashboard-close');
var usersArray = userList.childNodes;
var selectUserId;
var needFilter = false;
var options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
 };

function sendRequestToDatabase(method, path, key, body) {
    return fetch(
        chatURL + path + key + '.json',
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: method,
            body: JSON.stringify(body)
        }
    )  
    .then(function getResponse(response) {
        return response.json();
    }).catch(function err(error) {
        console.log('There has been a problem with your fetch operation: ', error.message);
    });
}

function Message(time, sender, body) {
    this.time = time;
    this.sender = sender;
    this.body = body;
 
    this.showMessage = function showMsg() {

        return this.time.toLocaleString('en-US', options) + ' ' + '<br>' + this.sender + ': ' + this.body + '<br>';
    }
 }

 function sendMessage(userId) {
    var textArea = document.getElementById('dashboard-chat-textarea');
    var text = textArea.value;
    var message = new Message(new Date(), 'Operator', text);
    document.getElementById('dashboard-history-panel').innerHTML += '<br>' + message.showMessage();
    sendRequestToDatabase('POST', 'messages/', userId, message);
    textArea.value = '';
 }

function addHistoryToPage(userId) {
    sendRequestToDatabase('GET', 'messages/', userId).then(
        function displayMessages(body) {
            document.getElementById('dashboard-history-panel').innerHTML = '';
            var message;
            if (body) {
                Object.keys(body).forEach(function addEachMessage(key) {
                    message = new Message(new Date(body[key].time), body[key].sender, body[key].body);
                    document.getElementById('dashboard-history-panel').innerHTML += '<br>' + message.showMessage();

                });
            }
        }
    );    
}

function openChat(userId) {
    document.getElementById('dashboard-work-place').hidden = false;
    document.getElementById('dashboard-picture').hidden = true;
    sendRequestToDatabase('PUT', 'users/' + userId, '/isRead', true);
    addHistoryToPage(userId);

    document.getElementById('dashboard-chat-textarea').addEventListener('click', function f() {
        sendRequestToDatabase('PUT', 'users/' + userId, '/isRead', true);
    });

    document.getElementById('dashboard-chat-button').addEventListener('click', function f() {
        sendMessage(userId);
    });
}

function sortByUserName(userElement) {
    var lastElement = true;
    var newUserElementName = userElement.getElementsByClassName('user-name-element')[0].innerHTML;
    
    for (var i = 0; i < usersArray.length; i++) {
        if (newUserElementName <= usersArray[i].getElementsByClassName('user-name-element')[0].innerHTML) {
            userList.insertBefore(userElement, usersArray[i]);
            lastElement = false;
            break;
        }
    }

   if(lastElement) {
        userList.appendChild(userElement);
   }
}

function sortByOnline(userElement) {
    var lastElement = true;
    var newUserElementStatus = userElement.getElementsByClassName('user-status-element')[0].innerHTML;

    for (var i = 0; i < usersArray.length; i++) {
        if (newUserElementStatus === 'online') {
            userList.insertBefore(userElement, usersArray[i]);
            lastElement = false;
            break;
        }
    }

    if (lastElement) {
        userList.appendChild(userElement);
    }
}

function sortByChatState(userElement) {
    var lastElement = true;
    var newUserElementChatState = userElement.getElementsByClassName('chat-state-element')[0].innerHTML;

    for(var i = 0; i < usersArray.length; i++) {
        if(newUserElementChatState === '[ ]') {
            userList.insertBefore(userElement, usersArray[i]);
            lastElement = false;
            break;
        }
    }

    if(lastElement) {
        userList.appendChild(userElement);
    }
}

function addUser(userBody, userId) {

    var userElement = document.createElement('div');
    var userNameElement = document.createElement('div');
    var userStatusElement = document.createElement('div');
    var chatStateElement = document.createElement('div');
    userNameElement.classList.add('user-name-element');
    userStatusElement.classList.add('user-status-element');
    chatStateElement.classList.add('chat-state-element');

    userNameElement.innerHTML = userBody.userName ? userBody.userName : 'Anonymous';

    if (userBody.isChatHidden) {
        chatStateElement.innerHTML = ' - ';
    } else {
        chatStateElement.innerHTML = '[ ]';
    }

    if (!userBody.isRead) {
        userNameElement.classList.add('unread-state');
    }
    
    if (new Date() - new Date(userBody.lastMessageDate) <= 600000) {
        userStatusElement.innerHTML = 'online';
    }

    userElement.appendChild(chatStateElement);
    userElement.appendChild(userStatusElement);
    userElement.appendChild(userNameElement);
    
    if (sorterTag.value === 'User Name') {
        sortByUserName(userElement);
    } else if (sorterTag.value === 'Online') {
        sortByOnline(userElement);
    } else if (sorterTag.value === 'Chat state') {
        sortByChatState(userElement);
    } else  {
        userList.appendChild(userElement);
    }

    userElement.addEventListener('click', function readMessages() { 
        selectUserId = userId;
        openChat(userId);
        document.getElementById('active').innerHTML = 'Active:   ' + userNameElement.innerHTML;
        userNameElement.classList.add('read-state');
    });
}

function createUserList() {
    sendRequestToDatabase('GET', 'users/', '').then(function addUsers(body) {
      Object.keys(body).forEach(function appendEachUser(key) {
        addUser(body[key], key);
      });
    });
}

function removeChildren() {
    while (userList.lastChild) {
        userList.removeChild(userList.lastChild);
    }
}

function updateUserList() {
    sendRequestToDatabase('GET', 'users/', '').then(function updateChanges(body) {
        removeChildren(userList);
        Object.keys(body).forEach(function addChanges(key) {
            addUser(body[key], key);
            if (selectUserId) { 
                addHistoryToPage(selectUserId);
            }
        });
    })
    .then(function setFilter() {
        if (needFilter) {
            console.log('test');
            filterUsers(document.getElementById('dashboard-filter').value);
        }
    });
}

function filterUsers(value) {
    var filterValue = value.toLowerCase();
    needFilter = true;

    if (filterValue === '') {
        needFilter = false;
    }

    usersArray.forEach(function hideAllUsers(userContainer) {
        userContainer.hidden = false;
    });

    usersArray.forEach(function hideExcessUsers(userContainer) {
      if (userContainer.getElementsByClassName('user-name-element')[0]
          .innerHTML.toLowerCase()
          .lastIndexOf(filterValue) === -1
      ) {
        userContainer.hidden = true;
      }
    });
}

filterTag.addEventListener('keyup', function filter() {
    filterUsers(document.getElementById('dashboard-filter').value);
});

sorterTag.addEventListener('change', function createSortedUserList() {
    removeChildren();
    createUserList();
});

closeButton.addEventListener('click', function hideOperatorPanel() {
    document.getElementById('dashboard-work-place').hidden = true;
    document.getElementById('dashboard-picture').hidden = false;

}) 

setInterval(updateUserList, 5000)

window.addEventListener('DOMContentLoaded', createUserList);