QUnit.module('Chat creation');

QUnit.test('Check the connection of styles', function(assert) {
  assert.ok(createStyles() !== null, 'The test is successful');
});

QUnit.test('Check the creation of chat', function(assert) {
  assert.ok(createChat() !== null, 'The test is successful');
});

QUnit.test('Check the creation of a collapsed chat', function(assert) {
  assert.ok(createMinimizeWindow() !== null, 'The test is successful');
});

QUnit.test('Check the location of the chat (right).', function(assert) {
  createStyles();
  createChat();
  assert.ok(
    document.getElementById('idChatWindow').getBoundingClientRect().left > 1000,
    'The test is successful'
  );
});

QUnit.test('Check the visibility of the chat', function(assert) {
  createStyles();
  createChat();
  createMinimizeWindow();
  localStorage.removeItem('visibilityChatWindow');
  localStorage.removeItem('visibilityMinimizeWindow');
  setVisibility();
  assert.ok(
    document.getElementById('idChatWindow').style.visibility == 'visible',
    'The test is successful'
  );
  assert.ok(
    document.getElementById('idMinimizeWindow').style.visibility == 'hidden',
    'The test is successful'
  );
});

QUnit.module('Operations with local storage');

QUnit.test('Check the work with the history.', function(assert) {
  localStorage.removeItem('history');
  document.getElementById('idHistoryOfTanyaChat').innerHTML =
    'history Of TanyaChat';
  setHistory();
  assert.ok(
    localStorage.getItem('history') == 'history Of TanyaChat',
    'The test is successful'
  );
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
    document.getElementById('idChatWindow').style.visibility == 'hidden',
    'The test is successful'
  );
  assert.ok(
    document.getElementById('idMinimizeWindow').style.visibility == 'visible',
    'The test is successful'
  );
  forMinButton();
  assert.ok(
    document.getElementById('idChatWindow').style.visibility == 'visible',
    'The test is successful'
  );
  assert.ok(
    document.getElementById('idMinimizeWindow').style.visibility == 'hidden',
    'The test is successful'
  );
});

QUnit.module('Work with messages');

QUnit.test('Check the sending of user messages.', function(assert) {
  init();
  var before = document.getElementById('idHistoryOfTanyaChat').innerHTML.length;
  document.getElementById('idChatInputMessage').innerHTML = 'hello';
  sendMessage();
  var after = document.getElementById('idHistoryOfTanyaChat').innerHTML.length;
  assert.ok(before < after, 'The test is successful');
  // alert(document.getElementById('idHistoryOfTanyaChat').innerHTML);
});

QUnit.test('Check the bot response.', function(assert) {
  init();
  document.getElementById('idStylesTanyaChat').innerHTML = '';
  document.getElementById('idChatInputMessage').innerHTML = 'hello';
  botAnswer();
  assert.ok(
    document
      .getElementById('idHistoryOfTanyaChat')
      .innerHTML.indexOf('HELLO') != -1,
    'The test is successful'
  );
});

QUnit.test('Check the format of the user and bot messages.', function(assert) {
  init();
  var currentTime = new Date();
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
      ) != -1,
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
      ) != -1,
    'The test is successful'
  );
});

QUnit.module('Scrolling');

QUnit.test('Check scrolling the history of messages.', function(assert) {
  init();
  var history = document.getElementById('idHistoryOfTanyaChat');
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
    history.clientHeight + history.scrollTop == history.scrollHeight,
    'The test is successful'
  );
});
