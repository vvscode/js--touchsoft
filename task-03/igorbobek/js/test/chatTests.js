/* eslint-disable no-undef */

var test = QUnit.test;
var chat = ChatInstance.getInstance();
QUnit.config.autostart = false;


setTimeout(function () {
    QUnit.start();
}, 1600);

QUnit.module('About chat');

test('Chat is created', function fun(assert) {
    assert.equal(ChatInstance.getInstance() instanceof Object, true);
});

test('Create chat firebase', function (assert) {
    var done;
    assert.timeout(1000);
    done = assert.async();
    chat.connectToChatFirebase();
    setTimeout(function () {
        assert.ok(getObjectFromLocalStorage('chat').name !== undefined);
        done();
    }, 800);
});

test('Init chat style', function fun(assert) {
    var saver = document.body.appendChild;
    var result;
    document.body.appendChild = function(item){
        result = item;
    };
    ChatInstance.getInstance().initStyle();
    document.body.appendChild = saver;
    assert.equal('STYLE', result.tagName);
});

test('Set title', function (assert){
   var newTitle = '1234A';
   ChatInstance.getInstance().setTitle(newTitle);
   assert.equal(newTitle, iconChat.innerText);
});

test('Set position', function (assert){
    var position = 'left';
    ChatInstance.getInstance().setPosition(position);
    assert.equal(mainDiv.style !== undefined, true);
});

test('Set cssClass', function (assert){
    var saver = mainDiv.className;
    var cssClass;
    ChatInstance.getInstance().setCssClass('bla');
    cssClass = mainDiv.className;
    mainDiv.className = saver;
   assert.equal('bla', cssClass);
});

test('Allow require name', function(assert){
    var saver = chat.addRequireContainer;
    var flag;
    chat.addRequireContainer = function(s){
        flag = true;
    };
    chat.requireName(true);
    chat.addRequireContainer = saver;
    assert.equal(true, flag);
});

test('Init config', function (assert) {
    var config;
    var newConfig = 'cfg';
    var saver = ChatInstance.getInstance().config;
    ChatInstance.getInstance().initConfig(newConfig);
    config = ChatInstance.getInstance().config;
    ChatInstance.getInstance().initConfig(saver);
    assert.equal(newConfig, config);
});

QUnit.module('About message');

test('Sending message to chat', function(assert) {
    var message ;
    var done;
    message = new Message('User', 'Sending message to chat', (new Date()).getTime(), true);
    assert.timeout(5000);
    done = assert.async();
    setTimeout(function() {
        content.innerHTML = '';
    message.sendMessage();
    assert.equal(1, content.childNodes.length, 'Done');
    done();
    }, 100);
});

test('Save a message to firebase', function (assert) {
    var saver = chat.makeRequest;
    var message = new Message(
        'User',
        'Sending message to chat',
        (new Date()).getTime(),
        true
    );
    var dataMessage;
    chat.makeRequest = function (url, type, data, header){
        dataMessage = data;
    };

    message.saveMessage();
    chat.makeRequest = saver;

    assert.equal(dataMessage, JSON.stringify(message));

});

QUnit.module('About user');

test('Init user', function f(assert){
    var done;
    assert.timeout(1000);
    done = assert.async();
    chat.user.name = 'iamuser';
    chat.user.init();
    setTimeout(function () {
        assert.equal(getObjectFromLocalStorage('user').name, chat.user.name);
        done();
    }, 800);
});

/* eslint no-unused-vars: ["error", { "args": "none" }] */
test('Save user to firebase', function(assert){
    var saver = chat.makeRequest;
    var data;
    chat.makeRequest = function (url, type, dataUser, headers) {
        data = dataUser;
    };
    chat.user.saveToFirebase();
    chat.makeRequest = saver;
    assert.equal(data, JSON.stringify(chat.user));
});


QUnit.module('About utils');

test('Object to URI', function(assert){
    assert.equal('first=1&second=2&', encodeURI({
        'first': '1',
        'second': '2'
    }));
});

test('Save object to local storage', function(assert){
    var saver = window.localStorage.setItem;
    var result;
    window.localStorage.setItem = function (key, value) {
        result = {key: value};
    };
    window.localStorage.setItem('key', 'value');
    window.localStorage.setItem = saver;
    assert.equal(JSON.stringify(result), JSON.stringify({'key': 'value'}));
});