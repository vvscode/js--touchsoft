'use strict';
QUnit.test('Send message function test', function (assert) {
    inputMessage.value = 'Hi';
    sendButtonOnClick();
    var messages = JSON.parse(localStorage.getItem("messages"));
    assert.equal(messages[messages.length-1].includes('Hi'), true);
	setTimeout(function() {
		assert.equal(messages[messages.length-1].innerText.includes('Бот'), true);
	});
    assert.equal(inputMessage.value === '',true);
});

QUnit.test('Minimize function works as expected', function (assert) {
    assert.equal(document.getElementById('body').style.display === 'none' && document.getElementById('form').style.height === '40px', true);
});

QUnit.test('Chat form is shown correctly test', function (assert) {
    var chatForm = document.getElementsByClassName('chatForm')[0];
    assert.equal(chatForm !== undefined, true);
});

QUnit.test('LocalStorage test', function(assert) {
    var messages = JSON.parse(localStorage.getItem("messages"));
    assert.equal((messages.length) !== 0, true);
});
