function create() {
  var yourChatWindow = document.createElement('div');
  yourChatWindow.id = 'idChatWindow';
  yourChatWindow.style =
    'visibility: visible; position: fixed; z-index: 99; width: 300px; height: 450px;\
  background-color: white; right: 10px; bottom: 10px; border: 1px solid #369656; box-shadow: 0 0 5px 2px gray; ';
  document.body.appendChild(yourChatWindow);

  var chatWindowTable = document.createElement('table');
  chatWindowTable.style =
    'background-color: blue; z-index: 99; border-collapse: collapse';

  var chatWindowTop = document.createElement('tr');
  chatWindowTop.id = 'idChatWindowTop';

  var chatWindowTopText = document.createElement('td');
  chatWindowTopText.id = 'idChatWindowTopText';
  chatWindowTopText.style =
    'height: 25px; background-color: white; padding-left: 15px';
  chatWindowTopText.innerHTML = 'Chat';

  var chatWindowTopMinimizeButton = document.createElement('td');
  chatWindowTopMinimizeButton.id = 'idChatWindowTopMinimizeButton';
  chatWindowTopMinimizeButton.style =
    'background-color: white; padding-left: 10px';
  var minimizeButton = document.createElement('div');
  minimizeButton.id = 'idMinimizeButton';
  minimizeButton.style =
    'width: 30px; height: 15px; text-align: center; background: #7DD99D; cursor:pointer;\
  border-radius: 2px; padding-bottom: 2px; box-shadow: 0.2em 0.2em 3px rgba(122,122,122,0.5);';
  minimizeButton.innerHTML = '&#8212';
  chatWindowTopMinimizeButton.appendChild(minimizeButton);

  chatWindowTop.appendChild(chatWindowTopText);
  chatWindowTop.appendChild(chatWindowTopMinimizeButton);

  var chatWindowMessagesHistory = document.createElement('tr');
  chatWindowMessagesHistory.id = 'idChatWindowMessagesHistory';
  var chatWindowMessagesHistoryTd = document.createElement('td');
  var history = document.createElement('div');
  history.id = 'idHistory';
  history.style =
    'width: 284.4px; border-style: hidden; overflow-y: scroll; word-wrap: break-word;\
     height: 311px; padding: 7px; vertical-align: top; background-color: #F9AC0B';
  chatWindowMessagesHistoryTd.colSpan = '2';
  chatWindowMessagesHistoryTd.appendChild(history);

  chatWindowMessagesHistory.appendChild(chatWindowMessagesHistoryTd);

  var chatWindowMessageTerritory = document.createElement('tr');
  chatWindowMessageTerritory.id = 'idChatWindowMessageTerritory';

  var chatWindowMessageTerritoryText = document.createElement('td');
  chatWindowMessageTerritoryText.id = 'idChatWindowMessageTerritoryText';
  chatWindowMessageTerritoryText.style =
    'width: 230px; height: 94px; background-color: white; padding-left: 7px';
  var chatInputMessage = document.createElement('textarea');
  chatInputMessage.id = 'idChatInputMessage';
  chatInputMessage.type = 'text';
  chatInputMessage.placeholder = 'Enter your message..';
  chatInputMessage.style =
    'width: 230px; height: 78px; size: 20; resize: none; text-align: top; \
    box-shadow: 0.2em 0.2em 3px rgba(122,122,122,0.5);';
  chatWindowMessageTerritoryText.appendChild(chatInputMessage);

  var chatWindowMessageTerritoryButton = document.createElement('td');
  chatWindowMessageTerritoryButton.style =
    'width: 45px; height: 94px; background: white;';
  var sendButton = document.createElement('div');
  sendButton.id = 'idSendButton';
  sendButton.style =
    'width: 42px; height: 50px; text-align: center; background: #7DD99D; cursor:pointer;\
  border-radius: 2px; padding-top: 35px; box-shadow: 0.2em 0.2em 3px rgba(122,122,122,0.5);';
  sendButton.innerHTML = 'Send';
  chatWindowMessageTerritoryButton.appendChild(sendButton);

  chatWindowMessageTerritory.appendChild(chatWindowMessageTerritoryText);
  chatWindowMessageTerritory.appendChild(chatWindowMessageTerritoryButton);

  var meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Type';
  meta.content = 'text/html; charset=utf-8';
  chatWindowTable.appendChild(meta);

  chatWindowTable.appendChild(chatWindowTop);
  chatWindowTable.appendChild(chatWindowMessagesHistory);
  chatWindowTable.appendChild(chatWindowMessageTerritory);

  yourChatWindow.appendChild(chatWindowTable);
  chatInputMessage.focus();
  history.scrollTop = history.scrollHeight;
  //*****************************************************************************************************************
  var minimizeWindow = document.createElement('div');
  minimizeWindow.id = 'idMinimizeWindow';
  minimizeWindow.style =
    'position: fixed; z-index: 99; width: 300px; height: 25px; background-color: white; right: 330px;\
     bottom: 10px; visibility: hidden; border: 1px solid #369656; box-shadow: 0 0 5px 2px gray; ';

  var minimizeChat = document.createElement('table');
  minimizeChat.style =
    'background-color: blue; z-index: 99; border-collapse: collapse';

  var minimizeChatPane = document.createElement('tr');
  minimizeChatPane.id = 'idMinimizeChatPane';

  var minimizeChatText = document.createElement('td');
  minimizeChatText.id = 'idMinimizeChatText';
  minimizeChatText.style =
    'width: 300px; height: 23px; background-color: white; padding-left: 15px';
  minimizeChatText.innerHTML = 'Chat';

  var minimizeChatButtonTd = document.createElement('td');
  minimizeChatButtonTd.id = 'idMinimizeChatButtonTd';
  minimizeChatButtonTd.style =
    'background-color: white; padding-right: 5px; padding-bottom: 3px';
  var minButton = document.createElement('div');
  minButton.id = 'idMinButton';
  minButton.style =
    'width: 30px; height: 15px; text-align: center; background: #7DD99D; cursor:pointer;\
  border-radius: 2px; padding-bottom: 5px; font-size: 15px;  padding-right: 3px;  \
  padding-left: 3px; box-shadow: 0.2em 0.2em 3px rgba(122,122,122,0.5);';
  minButton.innerHTML = '[&nbsp&nbsp]';
  minimizeChatButtonTd.appendChild(minButton);

  minimizeChatPane.appendChild(minimizeChatText);
  minimizeChatPane.appendChild(minimizeChatButtonTd);
  minimizeChat.appendChild(minimizeChatPane);
  minimizeWindow.appendChild(minimizeChat);

  document.body.appendChild(minimizeWindow);
}

function deleteCookie(cookie_name) {
  var cookie_date = new Date();
  cookie_date.setTime(cookie_date.getTime() - 1);
  document.cookie = cookie_name += '=; expires=' + cookie_date.toGMTString();
}

function getCookie(cookie_name) {
  var results = document.cookie.match(
    '(^|;) ?' + cookie_name + '=([^;]*)(;|$)'
  );
  if (results) return unescape(results[2]);
  else return null;
}

function init() {
  create();
  if (getCookie('visibilityChatWindow') == null)
    document.getElementById('idChatWindow').style.visibility = 'visible';
  else
    document.getElementById('idChatWindow').style.visibility = getCookie(
      'visibilityChatWindow'
    );
  if (getCookie('visibilityChatWindow') == null)
    document.getElementById('idMinimizeWindow').style.visibility = 'hidden';
  else
    document.getElementById('idMinimizeWindow').style.visibility = getCookie(
      'visibilityMinimizeWindow'
    );
  document.getElementById('idMinimizeButton').onclick = function() {
    if (document.getElementById('idChatWindow').style.visibility == 'visible') {
      document.getElementById('idChatWindow').style.visibility = 'hidden';
      document.getElementById('idMinimizeWindow').style.visibility = 'visible';
      deleteCookie('visibilityChatWindow');
      deleteCookie('visibilityMinimizeWindow');
      document.cookie =
        'visibilityChatWindow=hidden; expires=31/11/2019 00:00:00';
      document.cookie =
        'visibilityMinimizeWindow=visible; expires=31/11/2019 00:00:00';
    }
  };
  document.getElementById('idMinButton').onclick = function() {
    if (
      document.getElementById('idMinimizeWindow').style.visibility == 'visible'
    ) {
      document.getElementById('idChatWindow').style.visibility = 'visible';
      document.getElementById('idMinimizeWindow').style.visibility = 'hidden';
      deleteCookie('visibilityChatWindow');
      deleteCookie('visibilityMinimizeWindow');
      document.cookie =
        'visibilityChatWindow=visible; expires=31/11/2019 00:00:00';
      document.cookie =
        'visibilityMinimizeWindow=hidden; expires=31/11/2019 00:00:00';
    }
  };
  document.getElementById('idSendButton').onclick = sendMessage;
  document.getElementById('idHistory').innerHTML = getCookie('history');
  document.getElementById('idHistory').scrollTop = document.getElementById(
    'idHistory'
  ).scrollHeight;
  // alert(document.cookie);
  // deleteCookie('history');
}

function botAnswer() {
  var currentTime = new Date();
  var message = document.getElementById('idChatInputMessage');
  document.getElementById('idHistory').innerHTML =
    document.getElementById('idHistory').innerHTML +
    currentTime.getHours() +
    ':' +
    currentTime.getMinutes() +
    ' Bot: Response to "' +
    message.value.toUpperCase() +
    '"<br>';
  document.getElementById('idHistory').scrollTop = document.getElementById(
    'idHistory'
  ).scrollHeight;
  document.getElementById('idHistory').scrollTop = document.getElementById(
    'idHistory'
  ).scrollHeight;
  document.cookie =
    'history=' +
    document.getElementById('idHistory').innerHTML +
    '; expires=31/11/2019 00:00:00';
  message.value = '';
}

function sendMessage() {
  var currentTime = new Date();
  var message = document.getElementById('idChatInputMessage');
  document.getElementById('idHistory').innerHTML =
    document.getElementById('idHistory').innerHTML +
    currentTime.getHours() +
    ':' +
    currentTime.getMinutes() +
    ' You: ' +
    message.value +
    '<br>';
  document.getElementById('idHistory').scrollTop = document.getElementById(
    'idHistory'
  ).scrollHeight;
  setTimeout(botAnswer, 10000);
}

function trim(text) {
  return (text || '').replace(/^\s+|\s+$/g, '');
}
