var tanyaChatStyles =
  '.yourChatWindowStyles {' +
  ' visibility: visible; ' +
  ' position: fixed;' +
  ' z-index: 99;' +
  ' width: 300px; ' +
  ' height: 450px; ' +
  ' background-color: white;' +
  ' right: 10px;' +
  ' bottom: 10px;' +
  ' border: 1px solid #369656;' +
  ' box-shadow: 0 0 5px 2px gray;' +
  '}' +
  '.chatWindowTableStyles {' +
  ' z-index: 99;' +
  ' border-collapse: collapse' +
  '}' +
  '.chatWindowTopTextStyles {' +
  ' height: 25px;' +
  ' font-family: sans-serif;' +
  ' background-color: white;' +
  ' padding-left: 15px' +
  '}' +
  '.chatWindowTopMinimizeButtonStyles {' +
  ' background-color: white;' +
  ' padding-left: 10px' +
  '}' +
  '.minimizeButtonStyles {' +
  ' width: 30px;' +
  ' height: 15px;' +
  ' font-family: sans-serif;' +
  ' text-align: center;' +
  ' background: #7DD99D;' +
  ' cursor:pointer;' +
  ' border-radius: 2px;' +
  ' padding-bottom: 2px;' +
  ' box-shadow: 0.2em 0.2em 3px rgba(122,122,122,0.5);' +
  '}' +
  '.chatWindowMessagesHistoryTdStyles{' +
  ' width: 284.4px;' +
  ' font-family: sans-serif;' +
  ' border-style: hidden;' +
  ' overflow-y: scroll;' +
  ' word-wrap: break-word;' +
  ' height: 311px;' +
  ' padding: 7px;' +
  ' vertical-align: top;' +
  ' background-color: #F9AC0B;' +
  '}' +
  '.chatWindowMessageTerritoryTextStyles {' +
  ' width: 230px;' +
  ' height: 94px;' +
  ' background-color: white;' +
  ' padding-left: 7px;' +
  '}' +
  '.chatInputMessageStyles {' +
  ' width: 230px;' +
  ' height: 78px;' +
  ' font-family: sans-serif;' +
  ' resize: none;' +
  ' text-align: top;' +
  ' box-shadow: 0.2em 0.2em 3px rgba(122,122,122,0.5);' +
  '}' +
  '.chatWindowMessageTerritoryButtonStyles {' +
  ' width: 45px;' +
  ' height: 94px;' +
  ' background: white;' +
  '}' +
  '.sendButtonStyles{' +
  ' width: 42px;' +
  ' font-family: sans-serif;' +
  ' height: 50px;' +
  ' text-align: center;' +
  ' background: #7DD99D;' +
  ' cursor:pointer;' +
  ' border-radius: 2px;' +
  ' padding-top: 35px;' +
  ' box-shadow: 0.2em 0.2em 3px rgba(122,122,122,0.5);' +
  '}' +
  '.minimizeWindowStyles {' +
  ' position: fixed;' +
  ' z-index: 99;' +
  ' width: 300px;' +
  ' height: 25px;' +
  ' background-color: white;' +
  ' right: 330px;' +
  ' bottom: 10px;' +
  ' visibility: hidden;' +
  ' border: 1px solid #369656;' +
  ' box-shadow: 0 0 5px 2px gray; ' +
  '}' +
  '.minimizeChatStyles {' +
  ' z-index: 99;' +
  ' border-collapse: collapse;' +
  '}' +
  '.minimizeChatTextStyles {' +
  ' width: 300px;' +
  ' font-family: sans-serif;' +
  ' height: 23px;' +
  ' background-color: white;' +
  ' padding-left: 15px;' +
  '}' +
  '.minimizeChatButtonTdStyles {' +
  ' background-color: white;' +
  ' padding-right: 5px;' +
  ' padding-bottom: 3px;' +
  '}' +
  '.minButtonStyles {' +
  ' width: 30px;' +
  ' height: 15px;' +
  ' text-align: center;' +
  ' background: #7DD99D;' +
  ' cursor: pointer;' +
  ' border-radius: 2px;' +
  ' font-family: sans-serif;' +
  ' padding-bottom: 5px;' +
  ' font-size: 15px;' +
  ' padding-right: 3px;' +
  ' padding-left: 3px;' +
  ' box-shadow: 0.2em 0.2em 3px rgba(122,122,122,0.5);' +
  '}';

function createStyles() {
  var cssStyles = document.createElement('style');
  cssStyles.id = 'idStylesTanyaChat';
  cssStyles.innerHTML = tanyaChatStyles;
  document.body.appendChild(cssStyles);
  return cssStyles;
}

function createChat() {
  var yourChatWindow = document.createElement('div');
  var chatWindowTable = document.createElement('table');
  var chatWindowTop = document.createElement('tr');
  var chatWindowTopText = document.createElement('td');
  var chatWindowTopMinimizeButton = document.createElement('td');
  var minimizeButton = document.createElement('div');
  var chatWindowMessagesHistory = document.createElement('tr');
  var chatWindowMessagesHistoryTd = document.createElement('td');
  var history = document.createElement('div');
  var chatWindowMessageTerritory = document.createElement('tr');
  var chatWindowMessageTerritoryText = document.createElement('td');
  var chatInputMessage = document.createElement('textarea');
  var chatWindowMessageTerritoryButton = document.createElement('td');
  var sendButton = document.createElement('div');
  var meta = document.createElement('meta');

  yourChatWindow.id = 'idChatWindow';
  yourChatWindow.classList.add('yourChatWindowStyles');
  document.body.appendChild(yourChatWindow);

  chatWindowTable.classList.add('chatWindowTableStyles');

  chatWindowTop.id = 'idChatWindowTop';

  chatWindowTopText.id = 'idChatWindowTopText';
  chatWindowTopText.classList.add('chatWindowTopTextStyles');

  chatWindowTopText.innerHTML = 'Chat';

  chatWindowTopMinimizeButton.id = 'idChatWindowTopMinimizeButton';
  chatWindowTopMinimizeButton.classList.add(
    'chatWindowTopMinimizeButtonStyles'
  );
  minimizeButton.id = 'idMinimizeButton';
  minimizeButton.classList.add('minimizeButtonStyles');
  minimizeButton.innerHTML = '&#8212';
  chatWindowTopMinimizeButton.appendChild(minimizeButton);

  chatWindowTop.appendChild(chatWindowTopText);
  chatWindowTop.appendChild(chatWindowTopMinimizeButton);

  chatWindowMessagesHistory.id = 'idChatWindowMessagesHistory';
  history.id = 'idHistoryOfTanyaChat';
  history.classList.add('chatWindowMessagesHistoryTdStyles');
  chatWindowMessagesHistoryTd.colSpan = '2';
  chatWindowMessagesHistoryTd.appendChild(history);

  chatWindowMessagesHistory.appendChild(chatWindowMessagesHistoryTd);

  chatWindowMessageTerritory.id = 'idChatWindowMessageTerritory';

  chatWindowMessageTerritoryText.id = 'idChatWindowMessageTerritoryText';
  chatWindowMessageTerritoryText.classList.add(
    'chatWindowMessageTerritoryTextStyles'
  );
  chatInputMessage.id = 'idChatInputMessage';
  chatInputMessage.type = 'text';
  chatInputMessage.placeholder = 'Enter your message..';
  chatInputMessage.classList.add('chatInputMessageStyles');
  chatWindowMessageTerritoryText.appendChild(chatInputMessage);

  chatWindowMessageTerritoryButton.classList.add(
    'chatWindowMessageTerritoryButtonStyles'
  );
  sendButton.id = 'idSendButton';
  sendButton.classList.add('sendButtonStyles');
  sendButton.innerHTML = 'Send';
  chatWindowMessageTerritoryButton.appendChild(sendButton);

  chatWindowMessageTerritory.appendChild(chatWindowMessageTerritoryText);
  chatWindowMessageTerritory.appendChild(chatWindowMessageTerritoryButton);

  meta.httpEquiv = 'Content-Type';
  meta.content = 'text/html; charset=utf-8';
  chatWindowTable.appendChild(meta);

  chatWindowTable.appendChild(chatWindowTop);
  chatWindowTable.appendChild(chatWindowMessagesHistory);
  chatWindowTable.appendChild(chatWindowMessageTerritory);

  yourChatWindow.appendChild(chatWindowTable);
  chatInputMessage.focus();
  document.getElementById(
    'idHistoryOfTanyaChat'
  ).scrollTop = document.getElementById('idHistoryOfTanyaChat').scrollHeight;
  return yourChatWindow;
}

function createMinimizeWindow() {
  var minimizeWindow = document.createElement('div');
  var minimizeChat = document.createElement('table');
  var minimizeChatPane = document.createElement('tr');
  var minimizeChatText = document.createElement('td');
  var minimizeChatButtonTd = document.createElement('td');
  var minButton = document.createElement('div');

  minimizeWindow.id = 'idMinimizeWindow';
  minimizeWindow.classList.add('minimizeWindowStyles');
  minimizeChat.classList.add('minimizeChatStyles');

  minimizeChatPane.id = 'idMinimizeChatPane';

  minimizeChatText.id = 'idMinimizeChatText';
  minimizeChatText.classList.add('minimizeChatTextStyles');
  minimizeChatText.innerHTML = 'Chat';

  minimizeChatButtonTd.id = 'idMinimizeChatButtonTd';
  minimizeChatButtonTd.classList.add('minimizeChatButtonTdStyles');
  minButton.id = 'idMinButton';
  minButton.classList.add('minButtonStyles');
  minButton.innerHTML = '[&nbsp&nbsp]';
  minimizeChatButtonTd.appendChild(minButton);

  minimizeChatPane.appendChild(minimizeChatText);
  minimizeChatPane.appendChild(minimizeChatButtonTd);
  minimizeChat.appendChild(minimizeChatPane);
  minimizeWindow.appendChild(minimizeChat);

  document.body.appendChild(minimizeWindow);
  return minimizeWindow;
}

function setVisibility() {
  if (localStorage.getItem('visibilityChatWindow') == null)
    document.getElementById('idChatWindow').style.visibility = 'visible';
  else
    document.getElementById(
      'idChatWindow'
    ).style.visibility = localStorage.getItem('visibilityChatWindow');
  if (localStorage.getItem('visibilityChatWindow') == null)
    document.getElementById('idMinimizeWindow').style.visibility = 'hidden';
  else
    document.getElementById(
      'idMinimizeWindow'
    ).style.visibility = localStorage.getItem('visibilityMinimizeWindow');
}

function forMinimizeButton() {
  if (document.getElementById('idChatWindow').style.visibility === 'visible') {
    document.getElementById('idChatWindow').style.visibility = 'hidden';
    document.getElementById('idMinimizeWindow').style.visibility = 'visible';
    localStorage.setItem('visibilityChatWindow', 'hidden');
    localStorage.setItem('visibilityMinimizeWindow', 'visible');
  }
}

function forMinButton() {
  if (
    document.getElementById('idMinimizeWindow').style.visibility === 'visible'
  ) {
    document.getElementById('idChatWindow').style.visibility = 'visible';
    document.getElementById('idMinimizeWindow').style.visibility = 'hidden';
    localStorage.setItem('visibilityChatWindow', 'visible');
    localStorage.setItem('visibilityMinimizeWindow', 'hidden');
  }
}

function setHistory() {
  localStorage.setItem(
    'history',
    document.getElementById('idHistoryOfTanyaChat').innerHTML
  );
}

function scrollDown() {
  document.getElementById(
    'idHistoryOfTanyaChat'
  ).scrollTop = document.getElementById('idHistoryOfTanyaChat').scrollHeight;
}

function botAnswer() {
  var currentTime = new Date();
  var message = document.getElementById('idChatInputMessage');
  document.getElementById('idHistoryOfTanyaChat').innerHTML =
    document.getElementById('idHistoryOfTanyaChat').innerHTML +
    currentTime.getHours() +
    ':' +
    currentTime.getMinutes() +
    ' Bot: Response to "' +
    message.value.toUpperCase() +
    '"<br>';
  scrollDown();
  setHistory();
}

function sendMessage() {
  var currentTime = new Date();
  var hangOnTenSeconds = 10000;
  var message = document.getElementById('idChatInputMessage');
  document.getElementById('idHistoryOfTanyaChat').innerHTML =
    document.getElementById('idHistoryOfTanyaChat').innerHTML +
    currentTime.getHours() +
    ':' +
    currentTime.getMinutes() +
    ' You: ' +
    message.value +
    '<br>';
  scrollDown();
  setHistory();
  setTimeout(botAnswer, hangOnTenSeconds);
}

function setOnclickFunctions() {
  document.getElementById('idMinimizeButton').onclick = forMinimizeButton;
  document.getElementById('idMinButton').onclick = forMinButton;
  document.getElementById('idSendButton').onclick = sendMessage;
}

function getHistoryFromLocalStorage() {
  document.getElementById(
    'idHistoryOfTanyaChat'
  ).innerHTML = localStorage.getItem('history');
}

function init() {
  createStyles();
  createChat();
  createMinimizeWindow();
  setVisibility();
  getHistoryFromLocalStorage();
  scrollDown();
  setOnclickFunctions();
}

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    init();
  });
})();

function hideChat() {
  var a = document.getElementById('idChatWindow');
  var b = document.getElementById('idMinimizeWindow');
  if (a != null) {
    a.remove();
  }
  if (b != null) {
    b.remove();
  }
}

QUnit.module('Chat creation');

QUnit.test('Check the connection of styles', function(assert) {
  assert.ok(createStyles() !== null, 'The test is successful');
  hideChat();
});

QUnit.test('Check the creation of chat', function(assert) {
  assert.ok(createChat() !== null, 'The test is successful');
  hideChat();
});

QUnit.test('Check the creation of a collapsed chat', function(assert) {
  assert.ok(createMinimizeWindow() !== null, 'The test is successful');
  hideChat();
});

QUnit.test('Check the location of the chat (right).', function(assert) {
  createStyles();
  createChat();
  assert.ok(
    document.getElementById('idChatWindow').getBoundingClientRect().left > 1000,
    'The test is successful'
  );
  hideChat();
});

QUnit.test('Check the visibility of the chat', function(assert) {
  createStyles();
  createChat();
  createMinimizeWindow();
  localStorage.removeItem('visibilityChatWindow');
  localStorage.removeItem('visibilityMinimizeWindow');
  setVisibility();
  assert.ok(
    document.getElementById('idChatWindow').style.visibility === 'visible',
    'The test is successful'
  );
  assert.ok(
    document.getElementById('idMinimizeWindow').style.visibility === 'hidden',
    'The test is successful'
  );
  hideChat();
});

QUnit.module('Operations with local storage');

QUnit.test('Check the work with the history.', function(assert) {
  init();
  localStorage.removeItem('history');
  document.getElementById('idHistoryOfTanyaChat').innerHTML =
    'history Of TanyaChat';
  setHistory();
  assert.ok(
    localStorage.getItem('history') === 'history Of TanyaChat',
    'The test is successful'
  );
  hideChat();
});

QUnit.test('Check the folding of the chat.', function(assert) {
  createStyles();
  createChat();
  createMinimizeWindow();
  localStorage.removeItem('visibilityChatWindow');
  localStorage.removeItem('visibilityMinimizeWindow');
  setVisibility();
  setOnclickFunctions();
  forMinimizeButton();
  assert.ok(
    document.getElementById('idChatWindow').style.visibility === 'hidden',
    'The test is successful'
  );
  assert.ok(
    document.getElementById('idMinimizeWindow').style.visibility === 'visible',
    'The test is successful'
  );
  forMinButton();
  assert.ok(
    document.getElementById('idChatWindow').style.visibility === 'visible',
    'The test is successful'
  );
  assert.ok(
    document.getElementById('idMinimizeWindow').style.visibility === 'hidden',
    'The test is successful'
  );
  hideChat();
});

QUnit.module('Work with messages');

QUnit.test('Check the sending of user messages.', function(assert) {
  var before;
  var after;
  init();
  before = document.getElementById('idHistoryOfTanyaChat').innerHTML.length;
  document.getElementById('idChatInputMessage').innerHTML = 'hello';
  sendMessage();
  after = document.getElementById('idHistoryOfTanyaChat').innerHTML.length;
  assert.ok(before < after, 'The test is successful');
  hideChat();
});

QUnit.test('Check the bot response.', function(assert) {
  init();
  document.getElementById('idStylesTanyaChat').innerHTML = '';
  document.getElementById('idChatInputMessage').innerHTML = 'hello';
  botAnswer();
  assert.ok(
    document
      .getElementById('idHistoryOfTanyaChat')
      .innerHTML.indexOf('HELLO') !== -1,
    'The test is successful'
  );
  hideChat();
});

QUnit.test('Check the format of the user and bot messages.', function(assert) {
  var currentTime = new Date();
  init();
  document.getElementById('idHistoryOfTanyaChat').innerHTML = '';
  document.getElementById('idChatInputMessage').innerHTML = 'hello';
  sendMessage();
  assert.ok(
    document
      .getElementById('idHistoryOfTanyaChat')
      .innerHTML.indexOf(
        currentTime.getHours() +
          ':' +
          currentTime.getMinutes() +
          ' You: ' +
          document.getElementById('idChatInputMessage').innerHTML
      ) !== -1,
    'The test is successful'
  );
  botAnswer();
  assert.ok(
    document
      .getElementById('idHistoryOfTanyaChat')
      .innerHTML.indexOf(
        currentTime.getHours() +
          ':' +
          currentTime.getMinutes() +
          ' Bot: Response to "HELLO"'
      ) !== -1,
    'The test is successful'
  );
  hideChat();
});

QUnit.module('Scrolling');

QUnit.test('Check scrolling the history of messages.', function(assert) {
  var history;
  init();
  history = document.getElementById('idHistoryOfTanyaChat');
  history.innerHTML =
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck';
  scrollDown();
  assert.ok(
    history.clientHeight + history.scrollTop === history.scrollHeight,
    'The test is successful'
  );
  hideChat();
});
