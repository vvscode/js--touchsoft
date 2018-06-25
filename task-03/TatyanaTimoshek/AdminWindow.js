var chatURL = 'https://tanyachatfb.firebaseio.com';

var aboutUser = {
  userName: 'You',
  userId: '',
  minChat: false,
  online: false,
  unreadMessages: false
};

var findUser = {
  userName: 'You',
  userId: '',
  minChat: false,
  online: false,
  unreadMessages: false
};

var info = {
  messagesUrl: chatURL + '/messages/' + aboutUser.userId + '/.json',
  chatStatusUrl: chatURL + '/chatStatus/' + aboutUser.userId + '/.json',
  usersUrl: chatURL + '/users/' + aboutUser.userId + '/.json',
  settingsUrl: chatURL + '/settings/' + aboutUser.userId + '/.json',
  getUsersUrl: chatURL + '/users/.json',
  getMessagesUrl: chatURL + '/messages/',
  setUsersUrl: chatURL + '/users/',
  jsonPart: '/.json',
  requestPost: 'POST',
  requestGet: 'GET',
  requestPatch: 'PATCH',
  requestPut: 'PUT',
  infoUserId: '',
  messagesList: '',
  updateMess: false
};

var tofb = {
  time: '14:19',
  sender: 'Tan',
  text: 'letter'
};

function myData(url, requestType, data) {
  var body;
  if (requestType !== 'GET') {
    body = {
      method: requestType,
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
  } else {
    body = {
      method: requestType,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
  }
  return fetch(url, body)
    .then(function a(response) {
      return response.json();
    })
    .then(function b(res) {
      return res;
    });
}

function scrollDown() {
  document.getElementById('idHistory').scrollTop = document.getElementById(
    'idHistory'
  ).scrollHeight;
}

function addMes(time, sender, text) {
  var h = document.getElementById('idHistory');
  var man;
  if (sender === 'You') man = 'User';
  else man = sender;
  h.innerHTML = h.innerHTML + time + ': ' + man + ': ' + text + '<br>';
  scrollDown();
}

function loadHistory(id) {
  var newMessUrl = info.getMessagesUrl + id + info.jsonPart;
  myData(newMessUrl, info.requestGet, tofb).then(function c(messages) {
    if (messages !== null) {
      document.getElementById('idHistory').innerHTML = '';
      Object.keys(messages).forEach(function d(message) {
        addMes(
          messages[message].time,
          messages[message].sender,
          messages[message].text
        );
      });
    }
  });
}

function sendMessage() {
  var currentTime = new Date();
  var message = document.getElementById('idInputMessage').value;
  var makeUrl = info.getMessagesUrl + info.infoUserId + info.jsonPart;
  tofb.sender = 'Operator';
  tofb.time = currentTime.getHours() + ':' + currentTime.getMinutes();
  tofb.text = message;
  addMes(tofb.time, tofb.sender, tofb.text);
  myData(makeUrl, info.requestPost, tofb);
  scrollDown();
  document.getElementById('idInputMessage').value = '';
}

function getId(name) {
  var a = name.indexOf('(') + 1;
  return name.substr(a, 9);
}

function addMinChatSymbol() {
  if (aboutUser.minChat) return '&#128469;';
  return '&#128470;';
}

function addUnreadMessageSymbol() {
  if (aboutUser.unreadMessages) return '&#128386;';
  return '';
}

function findSelectedUser(id) {
  var newUrl = info.setUsersUrl + id + info.jsonPart;
  findUser.userId = id;
  myData(newUrl, info.requestGet, aboutUser).then(function e(users) {
    if (users !== null && id !== null) {
      if (users.userId === findUser.userId) {
        findUser.userName = users.userName;
        findUser.minChat = users.minChat;
        findUser.online = users.online;
        findUser.unreadMessages = users.unreadMessages;
      }
    }
  });
}

function makeUserName(name, id) {
  if (name === 'You') return 'Guest (' + id + ')';
  return name + ' (' + id + ')';
}

function makeUserId(id) {
  return 'idOption' + id;
}

function updateUsersValues() {
  var id = makeUserId(aboutUser.userId);
  var userInList = document.getElementById(id);
  if (id && userInList)
    userInList.innerHTML =
      makeUserName(aboutUser.userName, aboutUser.userId) +
      addUnreadMessageSymbol() +
      addMinChatSymbol();
}

function putInfoAboutUser() {
  var newUrl = info.setUsersUrl + findUser.userId + info.jsonPart;
  findUser.unreadMessages = false;
  myData(newUrl, info.requestPut, findUser);
}

function setListaners(myOption, userName) {
  var value;
  myOption.addEventListener('click', function f() {
    document.getElementById('idHistory').innerHTML = '';
    value = this.value;
    info.infoUserId = getId(value);
    findSelectedUser(info.infoUserId);
    loadHistory(info.infoUserId);
    document.getElementById('idActiveUser').innerHTML = userName;
    document.getElementById('idActive').style.visibility = 'visible';
    document.getElementById('idMountains').style.visibility = 'hidden';
    setTimeout(putInfoAboutUser, 700);
    updateUsersValues();
  });
}

function addUser(name, id) {
  var option = document.createElement('option');
  var userPanel = document.getElementById('idUsers');
  option.innerHTML = makeUserName(name, id);
  option.id = makeUserId(id);
  option.style.backgroundColor = '#FF6A66';
  option.style.paddingTop = '5px';
  option.style.paddingBottom = '5px';
  userPanel.appendChild(option);
  setListaners(option, option.innerHTML);
}

function removeUserFromList(id) {
  var removeUser = document.getElementById(makeUserId(id));
  if (removeUser) document.getElementById('idUsers').removeChild(removeUser);
}

function updateList(user) {
  var currentTime = new Date();
  var onlinePeriod = 120000;
  aboutUser.minChat = user.minChat;
  aboutUser.online = user.online;
  aboutUser.unreadMessages = user.unreadMessages;
  aboutUser.userId = user.userId;
  aboutUser.userName = user.userName;
  updateUsersValues();
  currentTime = currentTime.getTime();
  if (user.online !== false && currentTime - user.online < onlinePeriod) {
    document.getElementById(makeUserId(user.userId)).style.backgroundColor =
      '#78E061';
  } else {
    document.getElementById(makeUserId(user.userId)).style.backgroundColor =
      '#FF6A66';
  }
}

function sortUsers(option, user) {
  var currentTime = new Date();
  var onlinePeriod = 120000;
  var name = makeUserName(user.userName, user.userId);
  var newName;
  currentTime = currentTime.getTime();
  if (user.unreadMessages) newName = name + '&#128386;';
  if (option === 'Sort by') return true;
  if (option === 'Unread Messages' && newName.indexOf('&#128386;') !== -1)
    return true;
  if (option === 'Activity' && currentTime - user.online < onlinePeriod) {
    return true;
  }
  return false;
}

function setUsersInList() {
  var find = document.getElementById('idFilterUsers').value;
  var n = document.getElementById('idSortUsers').options.selectedIndex;
  var sortOption = document.getElementById('idSortUsers').options[n].value;
  var toSortNames = [];
  var toSort = [];
  var i;
  var j;
  myData(info.getUsersUrl, info.requestGet, aboutUser).then(function g(users) {
    if (users !== null) {
      Object.keys(users).forEach(function h(user) {
        removeUserFromList(users[user].userId);
        if (
          makeUserName(users[user].userName, users[user].userId).indexOf(
            find
          ) !== -1 &&
          sortUsers(sortOption, users[user])
        ) {
          addUser(users[user].userName, users[user].userId);
          updateList(users[user]);
        } else removeUserFromList(users[user].userId);
        if (sortOption === 'Name') {
          toSort.push(users[user]);
          toSortNames.push(
            makeUserName(users[user].userName, users[user].userId)
          );
        }
      });
      if (sortOption === 'Name') {
        toSortNames.sort();
        for (i = 0; i < toSortNames.length; i++) {
          for (j = 0; j < toSortNames.length; j++) {
            if (
              toSortNames[i].indexOf(toSort[j].userId) !== -1 &&
              makeUserName(toSort[j].userName, toSort[j].userId).indexOf(
                find
              ) !== -1
            ) {
              addUser(toSort[j].userName, toSort[j].userId);
              updateList(toSort[j]);
              break;
            }
          }
        }
      }
    }
  });
}

function updateUsersMessages() {
  if (document.getElementById('idHistory').innerHTML === 'History') return;
  loadHistory(getId(document.getElementById('idActiveUser').innerHTML));
  scrollDown();
}

function closeActivePane() {
  var n = document.getElementById('idUsers').options.selectedIndex;
  document.getElementById('idActive').style.visibility = 'hidden';
  document.getElementById('idMountains').style.visibility = 'visible';
  if (n > -1) {
    document.getElementById('idUsers').options[n].selected = false;
  }
}

function setListenerForSendAndExit() {
  document
    .getElementById('idSendButton')
    .addEventListener('click', sendMessage);
  document.getElementById('idClose').addEventListener('click', closeActivePane);
}

function setSearchListener() {
  document
    .getElementById('idFilterUsers')
    .addEventListener('change', setUsersInList);
}

function init() {
  var updateIntervar = 5000;
  setUsersInList();
  setListenerForSendAndExit();
  document.getElementById('idActive').style.visibility = 'visible';
  document.getElementById('idMountains').style.visibility = 'hidden';
  setInterval(setUsersInList, updateIntervar);
  setInterval(updateUsersMessages, updateIntervar);
  setSearchListener();
}

(function i() {
  document.addEventListener('DOMContentLoaded', function j() {
    init();
  });
})();
