'use strict';

QUnit.test('chat frame and inner content should be created successfully', function (assert) {
    assert.equal(true, frame !== undefined && minBtn !== undefined && sendBtn !== undefined && msgLog !== undefined && msgInput !== undefined);
});

QUnit.test("by default chat is minimized", function (assert) {
    assert.equal(isActive, false);
});

QUnit.test("when click on 'send' button, than message appears in message log", function (assert) {
    msgInput.value = 'Test';
    var message = sendBtnOnClick();
    assert.equal(message !== undefined, true);
    assert.equal(message.content, 'Test');
    assert.equal(msgInput.value, '');
    assert.equal(getLastMessage().includes('Test'), true);
});

QUnit.test('minimize button works correctly', function (assert) {
    minBtnOnClick();
    assert.equal(isActive, true);
    minBtnOnClick();
    assert.equal(isActive, false);
});

QUnit.test('messages were saved in local storage', function (assert) {
    var messages = JSON.parse(localStorage.messages);
    assert.equal(messages.length !== 0, true);
});

function getLastMessage() {
    var messages = msgLog.getElementsByTagName('li');
    return messages[messages.length-1].innerText;
}