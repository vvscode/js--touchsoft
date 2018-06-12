QUnit.module('Create a chat', {
  after() {
    document.body.removeChild(document.getElementById("chat"));
  }
});

QUnit.test('Creating of chat', function(assert) {
  var chat = createChat();
  addHistoryToPage();
  assert.ok(chat !== null, 'Chat created!');
});

QUnit.test('Creating of style', function(assert) {
  var style = createStyle();
  assert.ok(style !== null, 'Style created!');
});

QUnit.module('Check chat state', {
  afterEach() {
    document.getElementById("stateButton").click();
  }
});

QUnit.test('Change chat state', function test(assert) {
  var a = JSON.parse(localStorage.getItem('isChatHidden'));
  document.getElementById('stateButton').click();
  assert.equal(!a, JSON.parse(localStorage.getItem('isChatHidden')), 'Chat state was changed!');
});

QUnit.test('Hire chat history', function test(assert) {
  var chatHistory = historyElement.style.display;
  document.getElementById('stateButton').click();
  assert.notPropEqual(historyElement.style.display, chatHistory, 'History was hired!');
});

QUnit.test('Change the inner on the button', function test(assert) {
  var stateButton = document.getElementById("stateButton");
  var buttonInner = stateButton.innerHTML;
  stateButton.click();
  assert.notPropEqual(buttonInner, stateButton.innerHTML, 'State button was changed!');
});

QUnit.module('Format of the message');

QUnit.test('Check format of the message', function(assert) {
  var message = new Message(new Date(), 'YOU', 'Test message');
  var testMessage = (new Date()).toLocaleString("en-US", options) + " YOU" + '<br>' + 'Test message' + '<br>';
  assert.equal(testMessage, message.showMessage(), 'Format is suitable!');
});

QUnit.module('Check clicking on send button');

QUnit.test('Saving new message to localStorage', function test(assert) {
  var messagesArrayLength;
  var newMessagesArrayLength;
  var messagesArray = JSON.parse(localStorage.getItem("historyArray"));
  if (messagesArray !== null) {
    messagesArrayLength = messagesArray.length;
  }
    document.getElementById("textarea").value = "Test message";
    document.getElementById("sendButton").click();
    newMessagesArrayLength = JSON.parse(localStorage.getItem("historyArray")).length;
    assert.equal(1, newMessagesArrayLength - messagesArrayLength, 'Message was added to localStorage!');
});

QUnit.test('Display new message on history panel', function test(assert) {
  var previosMessages = historyPanel.innerHTML;
  document.getElementById("textarea").value = "Test message";
  document.getElementById("sendButton").click();
  assert.notPropEqual(previosMessages, historyPanel.innerHTML, 'Message was displayed on history panel!');
});

QUnit.test('Saving reply to localStorage', function test(assert) {
  var messagesArrayLength;
  var done;
  document.getElementById("textarea").value = "Test message";
  document.getElementById("sendButton").click();
  messagesArrayLength = JSON.parse(localStorage.getItem("historyArray")).length;
  done = assert.async();
  setTimeout(function () {
    assert.ok( JSON.parse(localStorage.getItem("historyArray")).length - messagesArrayLength > 0, 'Answer was added!');
    done();
  }, 15000);
});

QUnit.test('Display reply on history panel', function test(assert) {
  var previosMessages;
  var done;
  document.getElementById("textarea").value = "Test message";
  document.getElementById("sendButton").click();
  previosMessages = historyPanel.innerHTML;
  done = assert.async();
  setTimeout(function () {
    assert.notPropEqual( historyPanel.innerHTML, previosMessages, 'Answer was displayed on history panel!');
    done();
  }, 15000);
});