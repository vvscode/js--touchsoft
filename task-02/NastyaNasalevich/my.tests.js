QUnit.module('Create a chat', {
  after() {
    document.body.removeChild(main);
  }
});

QUnit.test('Creating of chat', function test(assert) {
  setTimeout(function checkChatCreating() {
    var chat = createChat();
  }, 1000);
  assert.ok(chat !== null, 'Chat created!');
});

QUnit.test('Creating of style', function test(assert) {
  var style = createStyle();
  assert.ok(style !== null, 'Style created!');
});

QUnit.module('Change chat state', {
  afterEach() {
    stateButton.click();
  }
});

QUnit.test('Change chat state', function test(assert) {
  var prevState;
  setTimeout(function findoutChatState() {
    sendRequestToDatabase('GET', 'users/', 'isChatHidden').then(
      function setState(body) {
        prevState = body;
        stateButton.click();
      }
    );
  }, 1000);

  var done = assert.async();
  setTimeout(function findoutChatState() {
    sendRequestToDatabase('GET', 'users/', 'isChatHidden').then(
      function setState(body) {
        assert.notStrictEqual(body, prevState, 'Chat state was changed!');
        done();
      }
    );
  }, 1500);
});

QUnit.test('Hire chat history', function test(assert) {
  var chatHistory = historyElement.style.display;
  stateButton.click();
  assert.notStrictEqual(historyElement.style.display, chatHistory, 'History was hired!');
});

QUnit.test('Change the inner on the button', function test(assert) {
  var buttonInner = stateButton.innerHTML;
  stateButton.click();
  assert.notStrictEqual(buttonInner, stateButton.innerHTML, 'State button was changed!');
});

QUnit.module('Sending messages');

QUnit.test('Check format of the message', function test(assert) {
  var message = new Message(new Date(), 'YOU', 'Test message');
  var testMessage = (new Date()).toLocaleString('en-US', options) + ' YOU' + '<br>' + 'Test message' + '<br>';
  assert.equal(testMessage, message.showMessage(), 'Format is suitable!');
});

QUnit.test('Check the adding messages to the history panel', function test(assert) {
  var done = assert.async();
  setTimeout(function addMessageToPanel() {
    var prevHistory = historyPanel.innerHTML;
    textarea.value = 'Test message';
    sendButton.click();
    assert.notStrictEqual(prevHistory, historyPanel.innerHTML, 'The messages were added to the history panel!');
    done();
  }, 1000); 
});

QUnit.module('Set Username');

QUnit.test('Check saving Username to database', function test(assert) {

  var nameRequest = createDivForNameRequest();
  main.appendChild(nameRequest);
  requireNameInput.value = 'Luis Suarez';
  requireNameButton.click();

  var done = assert.async();
  setTimeout(function sendRequest() {
    sendRequestToDatabase('GET', 'users/', 'userName').then(
      function checkUserName(body) {
        assert.equal(body, 'Luis Suarez', 'Username was determined!');
        done();
      }
    );
  }, 1000);
});

QUnit.module('Connections to the Database');

QUnit.test('Check fetch request', function test(assert) {
  var prevData;
  var done = assert.async();
  sendFetchRequest('GET', 'messages/', '')
        .then(function sendRequest(body) {
          prevData = body;
        });
  sendFetchRequest('POST', 'messages/', '', new Message(new Date(), 'YOU', 'New message'))
    .then(function sendRequest() {
      sendFetchRequest('GET', 'messages/', '')
        .then(function sendRequest(body) {
          assert.notStrictEqual(body, prevData, 'Fetch request are working!');
          done();
        });
    });
});

QUnit.test('Check XHR request', function test(assert) {
  var prevData;
  var done = assert.async();
  sendXhrRequest('GET', 'messages/', '')
        .then(function sendRequest(body) {
          prevData = body;
        });
  sendXhrRequest('POST', 'messages/', '', new Message(new Date(), 'YOU', 'New message'))
    .then(function sendRequest() {
      sendXhrRequest('GET', 'messages/', '')
        .then(function sendRequest(body) {
          assert.notStrictEqual(body, prevData, 'XHR request are working!');
          done();
        });
    });
});