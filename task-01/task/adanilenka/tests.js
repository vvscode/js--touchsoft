QUnit.test('button init', function (assert) {

    assert.ok(createMinButton() != null, 'создание кнопки');

});

QUnit.test('logArea init', function (assert) {

    assert.ok(createLogArea() != null, 'создание поля чата');

});

QUnit.test('sendButton init', function (assert) {

    assert.ok(createSendButton() != null, 'создание кнопки send');

});

QUnit.test('textInput init', function (assert) {

    assert.ok(createTextInput() != null, 'создание поля ввода');

});

QUnit.test('doStyles check', function (assert) {

    assert.ok(doStyles() != null, 'создание стилей');

});

QUnit.test('chat onLoad', function (assert) {

    var isMinimized = localStorage.getItem("isMinimized");

    assert.ok(isMinimized != null, 'создание чата');

});

QUnit.test('logArea isnt empty', function (assert) {

    addChatLogFromLocalStorage();
    assert.ok(document.getElementById('logArea') != null, 'лог чата');

});

QUnit.test('messages are saving in LS', function (assert) {

    saveMessageToLocalStorage('test message');
    var dataFromLocalStorage = localStorage.getItem("messageLog");
    assert.ok(dataFromLocalStorage != null, 'сохранение в локал стор.');

});

QUnit.test('isMinimized changed when button is clicked', function (assert) {

    var isMinimized = localStorage.getItem("isMinimized");
    changeStateOfChatWindow();
    assert.equal(!isMinimized, !localStorage.getItem("isMinimized"), 'изменение переменной');

});



