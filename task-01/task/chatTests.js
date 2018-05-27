/* eslint-disable no-undef */

QUnit.module('About chat');

QUnit.test('Init style for chat', function (assert) {
  var styles = document.getElementsByTagName('style');
  Array.prototype.forEach.call(styles, function (value) {
    value.remove();
  });
  initStyle();
  assert.equal(true, document.getElementsByTagName('style')[0] !== undefined, 'Done');
});

QUnit.test('Init chat', function (assert) {
  var chat = document.getElementsByClassName('igorbobek-my-chat')[0];
  if (chat !== undefined) {
    chat.remove();
  }
  initChat();
  assert.equal(true, document.getElementsByClassName('igorbobek-my-chat')[0] !== undefined, 'Done');
});

QUnit.module('About cookie');

QUnit.test('Saving cooking(minimize)', function (assert) {
  var cookieName = 'minimize';
  document.cookie = 'minimize=' + 'false';
  assert.equal('false', getCookie(cookieName), 'Done');
});

QUnit.test('Deleting cooking(minimize)', function (assert) {
  var cookieName = 'minimize';
  if (getCookie('minimize') === '') {
    document.cookie = 'minimize=' + 'false';
  }
  document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  assert.equal('', getCookie('minimize'), 'Done');
});


QUnit.module('About local storage');

QUnit.test('Clearing local storage', function (assert) {
  localStorage.clear();
  assert.equal(0, localStorage.length, 'Done');
});

QUnit.module('About messages');

QUnit.test('Sending message to chat', function (assert) {
  var message = new Message('User', 'Sending message to chat', new Date(), true);
  assert.timeout(200);
  var done = assert.async();
  setTimeout( function () {
    content.innerHTML = '';
    message.sendMessage();
    assert.equal(1, content.childNodes.length, 'Done');
    done();
  }, 100);
});

QUnit.test('Saving message to local storage', function (assert) {
  localStorage.clear();
  var message = new Message('User', 'Hello World', new Date(), true);
  message.saveMessage();
  var jsonMessage = JSON.parse(localStorage.getItem('messages'))[0];

  assert.equal(new Date(jsonMessage.time).getTime(), message.time.getTime(), 'Done');
});


QUnit.test('Recovery messages from local storage', function (assert) {
  localStorage.clear();
  var message = new Message('User', 'Recovery messages from local storage', new Date(), true);
  message.saveMessage();
  assert.timeout(200);
  var done = assert.async();
  setTimeout( function () {
    recoveryMessages();
    assert.equal(true, content.childNodes.length !== 0, 'Done');
    done();
  }, 100);
});

QUnit.test('Updating status of the message', function (assert) {
  localStorage.clear();
  var message = new Message('User', 'Hello World', new Date(), true);
  message.saveMessage();
  message.answered = false;
  message.updateMessageInLocalStorage(message.time, false);
  var jsonMessage = JSON.parse(localStorage.getItem('messages'))[0];
  assert.equal(message.answered, jsonMessage.answered, 'Done');
  localStorage.clear();
});

QUnit.module('About bot');

QUnit.test('Answer to the user', function (assert) {
  localStorage.clear();
  assert.timeout(16000);
  var done = assert.async();
  var message = new Message('User', 'Answer to me', new Date(), false);
  message.sendMessage();
  setTimeout(function () {
    assert.equal(true, message.answered, 'Done');
    done();
  }, 15500);
});

