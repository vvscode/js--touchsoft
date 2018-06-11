var QUnit = window.QUnit;
QUnit.testDone(function () {
    var chats = window.document.querySelectorAll("#chat-panel");
    for (var i = 0; i < chats.length; i++) {
        chats[i].classList.add(window.hiddenClass);
    }
});

QUnit.test("test adding styles", function (assert) {
    var beforeInit = window.document.styleSheets.length;
    window.addStyle();
    assert.equal(beforeInit + 1, window.document.styleSheets.length, "Passed!");
});

QUnit.test("test init minimized", function (assert) {
    var testMinimized = true;
    localStorage.setItem(window.minimizedKey, testMinimized.toString());
    window.initMinimized();

    assert.equal(window.minimized, testMinimized, "Passed with true!");

    testMinimized = false;
    localStorage.setItem(window.minimizedKey, testMinimized.toString());
    window.initMinimized();

    assert.equal(window.minimized, testMinimized, "Passed with false!");
});

QUnit.test("test init userid", function (assert) {
    var userId = "test id";
    localStorage.setItem(window.userIdKey, window.userId);

    window.initUserId();

    assert.equal(window.userid, userId);
});

QUnit.test("test save userid", function (assert) {
    var id = "testId";
    window.userid = id;

    window.saveUserId();

    assert.equal(localStorage.getItem(window.userIdKey), id);
});

QUnit.test("test init side", function (assert) {
    var testSide = right;
    localStorage.setItem(window.sideKey, testSide);

    window.initSide();

    assert.equal(testSide, window.chatSide);
});

QUnit.test("test save side", function (assert) {
    window.chatSide = window.right;

    window.saveChatSide();

    assert.equal(localStorage.getItem(window.sideKey), window.right);
});

QUnit.test("test save minimized", function (assert) {
    window.minimized = true;

    window.saveMinimized();

    assert.equal(localStorage.getItem(window.minimizedKey), "true", "Passed!");

    window.minimized = false;

    window.saveMinimized();

    assert.equal(localStorage.getItem(window.minimizedKey), "false", "Passed!");
});

QUnit.test("test user authentification", function (assert) {
    var resultContentChildCount;
    var resultFormHidden = true;
    var resultUsername = "testUsername";

    localStorage.removeItem(window.userIdKey);
    window.initChat("test", true, right, true, "new bot", "https://chat-6a9d3.firebaseio.com/", "a", true, false, XHRNetwork);

    resultContentChildCount = window.document.querySelector("#" + window.chatContentClass).children.length + 2
    window.document.querySelector("#" + window.authFormClass).username.value = resultUsername;

    authUser.call(window.document.querySelector("#" + window.authFormClass), {
        preventDefault: function () {
        }
    });

    assert.equal(window.document.querySelector("#" + window.chatContentClass).children.length, resultContentChildCount);
    assert.equal(window.document.querySelector("#" + window.authFormClass).classList.contains(window.hiddenClass), resultFormHidden);
    assert.equal(window.username, resultUsername);
});

QUnit.test("test chat form initializing", function (assert) {
    var testForm = window.initChatForm();

    assert.ok(testForm != null);
    assert.equal(testForm.id, window.messageFormClass);
    assert.ok(testForm.querySelector("#current-message-area") != null);
});

QUnit.test("test chat content initializing", function (assert) {
    var testContent = window.initChatContent();
    assert.ok(testContent != null);
    assert.ok(testContent.classList.contains(window.messageHistoryClass));
});

QUnit.test("test authorization initializing", function (assert) {
    var testAuth = window.initAutorization();
    assert.ok(testAuth != null);
    assert.ok(testAuth.querySelector("#" + window.authFormClass) != null);
    assert.ok(testAuth.querySelector("#" + window.authFormClass).username != null);
});

QUnit.test("test chat box initializing", function (assert) {
    var cssClass = "test";
    var header = "header";
    var minimise = true;
    var testChat = window.initChatBox(header, minimise, cssClass, true);

    assert.ok(testChat != null);
    assert.ok(testChat.classList.contains(cssClass));
    assert.equal(testChat.querySelector("#chat-header").children[0].innerText, header);
    assert.ok(testChat.querySelector("#" + window.minimizeButtonClass) != null);
    assert.ok(testChat.classList.contains(window.dragClass));
});

QUnit.test("test content initializing", function (assert) {
    var chatContent = window.document.createElement("div");
    var resultChildren = 2;

    window.initContent(chatContent);

    assert.equal(chatContent.children.length, resultChildren);
    assert.ok(chatContent.querySelector("#" + window.messageFormClass) != null);
    assert.ok(chatContent.querySelector("." + window.messageHistoryClass) != null);
});

QUnit.test("test init chat", function (assert) {
    var beforeInit = window.document.styleSheets.length;
    var testHeader = "test";
    var botname = "new bot";
    var chatURL = "https://chat-6a9d3.firebaseio.com/";
    var cssClass = "a";
    window.messages = [];
    testMinimized = false;
    localStorage.setItem(window.minimizedKey, testMinimized.toString());

    window.initChat(testHeader, true, window.right, true, botname, chatURL, cssClass, true, false, window.XHRNetwork);

    assert.equal(beforeInit + 1, window.document.styleSheets.length);
    assert.ok(window.document.getElementById("chat-panel") != null);
    assert.equal(window.document.getElementById("chat-header").firstChild.innerText, testHeader);
    assert.equal(window.document.getElementById(window.authFormClass) != null, !localStorage.getItem(window.userIdKey));
    assert.equal(window.chatSide, window.right);
    assert.ok(window.document.getElementById(window.minimizeButtonClass) != null);
    assert.equal(window.answer.sender, botname);
    assert.equal(window.urlAPI, chatURL);
    assert.ok(window.document.getElementById("chat-panel").classList.contains(cssClass));
    assert.ok(window.document.getElementById("chat-panel").classList.contains(window.dragClass));
    assert.ok(window.document.getElementById("chat-panel").classList.contains(window.dragClass));
    assert.equal(window.time, false);
    assert.equal(window.chatNetwork, window.XHRNetwork);
    assert.equal(window.minimized, window.testMinimized);
});

QUnit.test("test move chat chat", function (assert) {
    var afterMoveX = 10;
    var afterMoveY = 20;

    window.initChat("test", true, window.right, true, "new bot", "https://chat-6a9d3.firebaseio.com/", "a", true, false, window.XHRNetwork);
    window.moveToPoint(window.document.querySelector("#chat-panel"), afterMoveX, afterMoveY);

    assert.equal(window.document.querySelector("#chat-panel").style.top, afterMoveY + "px");
    assert.equal(window.document.querySelector("#chat-panel").style.left, afterMoveX + "px");
});

QUnit.test("test HistoryItem constructor", function (assert) {
    var testDate = new Date();

    var result = {
        date: testDate.getHours() + ":" + testDate.getMinutes(),
        sender: "test sender",
        text: "testMessage"
    };

    var testItem = new window.HistoryItem(testDate, result.sender, result.text);

    assert.propEqual(testItem, result, "Passed!");
});

QUnit.test("test minimized changing", function (assert) {
    var testMinimized;

    window.minimized = false;
    testMinimized = window.minimized;
    window.document.getElementById(window.chatContentClass).classList.remove(window.hiddenClass);
    window.toggleMinimize();

    assert.equal(window.minimized, !testMinimized, "Passed!");
    assert.equal(window.document.getElementById(window.chatContentClass).classList.contains(window.hiddenClass), window.minimized, "Passed!");
    testMinimized = window.minimized;

    window.toggleMinimize();

    assert.equal(window.minimized, !testMinimized, "Passed!");
    assert.equal(window.document.getElementById(window.chatContentClass).classList.contains(window.hiddenClass), window.minimized, "Passed!");

    window.toggleMinimize();
});

QUnit.test("test formating item", function (assert) {
    var testDate = new Date();
    var testItem = new window.HistoryItem(testDate, "test sender", "test message");
    var itemElement;

    window.time = true;
    itemElement = window.formatItem(testItem)

    assert.notEqual(itemElement, null, "Passed!");
    assert.equal(itemElement.children[0].innerText, testItem.date, "Passed!");
    assert.equal(itemElement.children[1].innerText, testItem.sender, "Passed!");
    assert.equal(itemElement.children[2].innerText, testItem.text, "Passed!");
});

QUnit.test("test formating item", function (assert) {
    var result;
    window.messages.push(new HistoryItem(new Date(), "test sender", "test message1"));
    window.messages.push(new HistoryItem(new Date(), "test sender", "test message2"));
    window.messages.push(new HistoryItem(new Date(), "test sender", "test message3"));

    result = window.document.getElementsByClassName(window.messageHistoryClass)[0].children.length + window.messages.length;

    window.printItems(window.messages);

    assert.equal(window.document.getElementsByClassName(window.messageHistoryClass)[0].children.length, result, "Passed!");
});

QUnit.test("test sending message", function (assert) {
    var resultMessagesCount = window.messages.length + 1;
    var resultChildrenCount = window.document.getElementsByClassName(window.messageHistoryClass)[0].children.length + 1;
    var resultMessage;

    text = {
        value: "test message"
    };

    resultMessage = new HistoryItem(new Date(), window.messageSender, text.value);

    sendMessage({
        preventDefault: function () {
        }
    });

    assert.equal(window.messages.length, resultMessagesCount, "Passed!");
    assert.equal(window.document.getElementsByClassName(window.messageHistoryClass)[0].children.length, resultChildrenCount, "Passed!");
});

QUnit.test("test answer generating", function (assert) {
    var message = "test message";
    var resultAnswer = "Ответ на \"{" + message.toUpperCase() + "}\"";

    assert.equal(window.generateAnswer(message), resultAnswer, "Passed!");
});

QUnit.test("test answer sending", function (assert) {
    var resultMessagesCount = window.messages.length + 1;
    var resultChildrenCount = window.document.getElementsByClassName(window.messageHistoryClass)[0].children.length + 1;
    var testMessage = new HistoryItem(new Date(), window.messageSender, "test message");
    var resultMessage = new HistoryItem(new Date(), window.answer.sender, window.generateAnswer(testMessage.text));

    window.sendAnswer(testMessage);

    assert.equal(window.messages.length, resultMessagesCount, "Passed!");
    assert.propEqual(window.messages[window.messages.length - 1], resultMessage, "Passed!");
    assert.equal(window.document.getElementsByClassName(window.messageHistoryClass)[0].children.length, resultChildrenCount, "Passed!");
});