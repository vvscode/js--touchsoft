'use strict';
QUnit.test( 'LocalStorage test', function(assert) {
    var messages = JSON.parse(localStorage.getItem("messages"));
    assert.ok((messages.length) !== 0, true);
    var state = JSON.parse(localStorage.getItem("state"));
    assert.ok((state.length) !== 0, true);
});

QUnit.test('Send message function test', function (assert) {
    inputMessage.value = 'Hi';
    var messages = list.getElementsByTagName('li');
    sendButtonOnClick();
    assert.ok(messages[messages.length-1].innerText.includes('Hi'), true);
    assert.ok(setTimeout(messages[messages.length-1].innerText.includes('Бот: Ответ на "Hi"'), 15000),true);
    assert.ok(inputMessage.value === '',true);
});

QUnit.test('Minimize function works as expected', function (assert) {
    assert.ok(document.getElementById('body').style.display === 'none' && document.getElementById('form').style.height === '40px');
});

QUnit.test('Chat form is shown correctly test', function (assert) {
    var chatForm = document.getElementsByClassName('chatForm')[0];
    assert.ok(chatForm, true);
});
