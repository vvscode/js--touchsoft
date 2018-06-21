/* global QUnit */
/* global chat */
/* global AdminChat */
/* global Message */
/* global dashboard */

var test = QUnit.test;

QUnit.module('About dashboard');



test('Dashboard container exists', function (assert) {
    var container = document.getElementById('container');
    assert.ok(container !== null);
});

test('Menu container is exists', function (assert) {
    var menu = document.getElementById('menu');
    assert.ok(menu !== null);
});

test('Chat container is exists', function (assert) {
    var chat = document.getElementById('chat');
    assert.ok(chat !== null);
});

test('Dashboard object is created', function (assert) {
    assert.ok(dashboard !== undefined);
});

test('Chat is created', function (assert) {
   assert.ok (chat !== undefined);
});

test('Chat for admin', function (assert) {
   assert.ok(chat instanceof AdminChat);
});

test('Close button has a listener ', function (assert) {
    var closeButton = document.getElementById('button-close-dashboard');
    var activeContainer = document.getElementById('active-container');
    var click = new Event('click');
    closeButton.dispatchEvent(click);
    assert.ok(activeContainer.classList.contains('hide'));
});

test('Clear an user list containe', function (assert) {
    var containerForUsers = document.getElementById('user-list');
    dashboard.clearUserListContainer();
    assert.equal('', containerForUsers.innerHTML);
});

test('Sort select has listener', function (assert) {
    var sortElement = document.getElementById('sort');
    var saver = {function: dashboard.showUsers, value: dashboard.sort};
    var event = new Event('change');
    var flag = false;
    dashboard.showUsers = function(){
        flag = true;
    };
    sortElement.dispatchEvent(event);
    dashboard.showUsers = saver.function;
    dashboard.sort = saver.value;
    assert.ok(flag === true);
});

test('Init user list', function (assert) {
   var done = assert.async();
   dashboard.initUserChatsList().then( function(data) {
           assert.ok(data === true);
           done();
       }
   );
});

test('Get users', function (assert){
    var done = assert.async();
    dashboard.getUsers().then(function () {
       assert.ok(true);
       done();
    }).catch(function () {
       assert.ok(false);
       done();
    })
});

QUnit.module('About message');

test('Save messages', function (assert) {
    var done = assert.async();
    var promise = new Promise(function (resolve) {
        setTimeout(function () {
            var message = new Message('test', 'message', new Date().getTime());
            message.saveMessage();
            resolve(true)
        }, 2000);
    });
    promise.then(function () {
        assert.ok(true);
        done();
    }).catch(function () {
        assert.ok(false);
        done();
    });
});

QUnit.module('About Chat');

test('Get messages by chat UID', function (assert) {
    var done = assert.async();
    chat.getMessagesByChatUID('uid').then(function () {
        assert.ok(true);
        done();
    }).catch(function () {
        assert.ok(false);
        done();
    })
});