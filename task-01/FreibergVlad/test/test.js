/* global QUnit */
/* global frame , minBtn, sendBtn, msgLog, msgInput, isActive, sendBtnOnClick, minBtnOnClick */

QUnit.test(
  'chat frame and inner content should be created successfully',
  function testChatFrameExistence(assert) {
    assert.equal(
      true,
      frame !== undefined &&
        minBtn !== undefined &&
        sendBtn !== undefined &&
        msgLog !== undefined &&
        msgInput !== undefined
    );
  }
);

QUnit.test('by default chat is minimized', function testMinimizingByDefault(assert) {
  assert.equal(isActive, false);
});

QUnit.test(
  "when click on 'send' button, than message appears in message log",
  function testMessageSending(assert) {
    var message;
    msgInput.value = 'Test';
    message = sendBtnOnClick();
    assert.equal(message !== undefined, true);
    assert.equal(message.content, 'Test');
    assert.equal(msgInput.value, '');
    function getLastMessage() {
          var messages = msgLog.getElementsByTagName('li');
          return messages[messages.length - 1].innerText;
    }
    assert.equal(getLastMessage().includes('Test'), true);
  }
);

QUnit.test('minimize button works correctly', function testMinimizeButton(assert) {
  minBtnOnClick();
  assert.equal(isActive, true);
  minBtnOnClick();
  assert.equal(isActive, false);
});

QUnit.test('messages were saved in local storage', function testLocalStorage(assert) {
  var messages = JSON.parse(localStorage.messages);
  assert.equal(messages.length !== 0, true);
});
