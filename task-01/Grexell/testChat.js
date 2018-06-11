var QUnit = window.QUnit;
QUnit.testDone(function (details) {
  var chats = window.document.querySelectorAll("#chat-panel");
  for (var i = 0; i < chats.length; i++) {
    chats[i].classList.add(hiddenClass);
  }
});

QUnit.test("test adding styles", function (assert) {
  var beforeInit = window.document.styleSheets.length;
  addStyle();
  assert.equal(beforeInit + 1, window.document.styleSheets.length, "Passed!");
});

QUnit.test("test init minimized", function (assert) {
  var testMinimized = true;
  localStorage.setItem(minimizedKey, testMinimized.toString());
  initMinimized();

  assert.equal(minimized, testMinimized, "Passed with true!");

  testMinimized = false;
  localStorage.setItem(minimizedKey, testMinimized.toString());
  initMinimized();

  assert.equal(minimized, testMinimized, "Passed with false!");
});

QUnit.test("test init userid", function (assert) {
  var userId = "test id";
  localStorage.setItem(userIdKey, userId);
  
  initUserId();

  assert.equal(userid, userId);
});

QUnit.test("test save userid", function (assert) {
  var id = "testId";
  userid = id;
  
  saveUserId();

  assert.equal(localStorage.getItem(userIdKey), id);
});

QUnit.test("test init side", function (assert) {
  var testSide = right;
  localStorage.setItem(sideKey, testSide);
  
  initSide();

  assert.equal(testSide, chatSide);
});

QUnit.test("test save side", function (assert) {
  chatSide = right;
  
  saveChatSide();

  assert.equal(localStorage.getItem(sideKey), right);
});

QUnit.test("test save minimized", function (assert) {
  minimized = true;

  saveMinimized();

  assert.equal(localStorage.getItem(minimizedKey), "true", "Passed!");

  minimized = false;

  saveMinimized();

  assert.equal(localStorage.getItem(minimizedKey), "false", "Passed!");
});

QUnit.test("test user authentification", function (assert) {
  var resultContentChildCount;
  var resultFormHidden = true;
  var resultUsername = "testUsername";

  localStorage.removeItem(userIdKey);
  initChat("test", true, right, true, "new bot", "https://chat-6a9d3.firebaseio.com/", "a", true, false, XHRNetwork);

  resultContentChildCount = window.document.querySelector("#" + chatContentClass).children.length + 2
  window.document.querySelector("#" + authFormClass).username.value = resultUsername;

  authUser.call(window.document.querySelector("#" + authFormClass), {
    preventDefault: function () { }
  });

  assert.equal(window.document.querySelector("#" + chatContentClass).children.length, resultContentChildCount);
  assert.equal(window.document.querySelector("#" + authFormClass).classList.contains(hiddenClass), resultFormHidden);
  assert.equal(username, resultUsername);
});

QUnit.test("test chat form initializing", function (assert) {
  var testForm = initChatForm();

  assert.ok(testForm != null);
  assert.equal(testForm.id, messageFormClass);
  assert.ok(testForm.querySelector("#current-message-area") != null);
});

QUnit.test("test chat content initializing", function (assert) {
  var testContent = initChatContent();
  assert.ok(testContent != null);
  assert.ok(testContent.classList.contains(messageHistoryClass));
});

QUnit.test("test authorization initializing", function (assert) {
  var testAuth = initAutorization();
  assert.ok(testAuth != null);
  assert.ok(testAuth.querySelector("#" + authFormClass) != null);
  assert.ok(testAuth.querySelector("#" + authFormClass).username != null);
});

QUnit.test("test chat box initializing", function (assert) {
  var cssClass = "test";
  var header = "header";
  var minimise = true;
  var testChat = initChatBox(header, minimise, cssClass, true);
  
  assert.ok(testChat != null);
  assert.ok(testChat.classList.contains(cssClass));
  assert.equal(testChat.querySelector("#chat-header").children[0].innerText, header);
  assert.ok(testChat.querySelector("#" + minimizeButtonClass) != null);
  assert.ok(testChat.classList.contains(dragClass));
});

QUnit.test("test content initializing", function (assert) {
  var chatContent = window.document.createElement("div");
  var resultChildren = 2;
  
  initContent(chatContent);
  
  assert.equal(chatContent.children.length, resultChildren);
  assert.ok(chatContent.querySelector("#" + messageFormClass) != null);
  assert.ok(chatContent.querySelector("." + messageHistoryClass) != null);
});

QUnit.test("test init chat", function (assert) {
  var beforeInit = window.document.styleSheets.length;
  var testHeader = "test";
  var botname = "new bot";
  var chatURL = "https://chat-6a9d3.firebaseio.com/";
  var cssClass = "a";
  messages = [];
  testMinimized = false;
  localStorage.setItem(minimizedKey, testMinimized.toString());

  initChat(testHeader, true, right, true, botname, chatURL, cssClass, true, false, XHRNetwork);

  assert.equal(beforeInit + 1, window.document.styleSheets.length);
  assert.ok(window.document.getElementById("chat-panel") != null);
  assert.equal(window.document.getElementById("chat-header").firstChild.innerText, testHeader);
  assert.equal(window.document.getElementById(authFormClass) != null, !localStorage.getItem(userIdKey));
  assert.equal(chatSide, right);
  assert.ok(window.document.getElementById(minimizeButtonClass) != null);
  assert.equal(answer.sender, botname);
  assert.equal(urlAPI, chatURL);
  assert.ok(window.document.getElementById("chat-panel").classList.contains(cssClass));
  assert.ok(window.document.getElementById("chat-panel").classList.contains(dragClass));
  assert.ok(window.document.getElementById("chat-panel").classList.contains(dragClass));
  assert.equal(time, false);
  assert.equal(chatNetwork, XHRNetwork);
  assert.equal(minimized, testMinimized);
});

QUnit.test("test move chat chat", function (assert) {
  var afterMoveX = 10;
  var afterMoveY = 20;
  
  initChat("test", true, right, true, "new bot", "https://chat-6a9d3.firebaseio.com/", "a", true, false, XHRNetwork);
  moveToPoint(window.document.querySelector("#chat-panel"), afterMoveX, afterMoveY);

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

  var testItem = new HistoryItem(testDate, result.sender, result.text);

  assert.propEqual(testItem, result, "Passed!");
});

QUnit.test("test minimized changing", function (assert) {
  var testMinimized;

  minimized = false;
  testMinimized = minimized;
  window.document.getElementById(chatContentClass).classList.remove(hiddenClass);
  toggleMinimize();

  assert.equal(minimized, !testMinimized, "Passed!");
  assert.equal(window.document.getElementById(chatContentClass).classList.contains(hiddenClass), minimized, "Passed!");
  testMinimized = minimized;

  toggleMinimize();

  assert.equal(minimized, !testMinimized, "Passed!");
  assert.equal(window.document.getElementById(chatContentClass).classList.contains(hiddenClass), minimized, "Passed!");

  toggleMinimize();
});

QUnit.test("test formating item", function (assert) {
  var testDate = new Date();
  var testItem = new HistoryItem(testDate, "test sender", "test message");
  var itemElement;

  time = true;
  itemElement = formatItem(testItem)

  assert.notEqual(itemElement, null, "Passed!");
  assert.equal(itemElement.children[0].innerText, testItem.date, "Passed!");
  assert.equal(itemElement.children[1].innerText, testItem.sender, "Passed!");
  assert.equal(itemElement.children[2].innerText, testItem.text, "Passed!");
});

QUnit.test("test formating item", function (assert) {
  var result;
  messages.push(new HistoryItem(new Date(), "test sender", "test message1"));
  messages.push(new HistoryItem(new Date(), "test sender", "test message2"));
  messages.push(new HistoryItem(new Date(), "test sender", "test message3"));

  result = window.document.getElementsByClassName(messageHistoryClass)[0].children.length + messages.length;

  printItems(messages);

  assert.equal(window.document.getElementsByClassName(messageHistoryClass)[0].children.length, result, "Passed!");
});

QUnit.test("test sending message", function (assert) {
  var resultMessagesCount = messages.length + 1;
  var resultChildrenCount = window.document.getElementsByClassName(messageHistoryClass)[0].children.length + 1;
  var resultMessage;

  text = {
    value: "test message"
  };

  resultMessage = new HistoryItem(new Date(), messageSender, text.value);

  sendMessage({
    preventDefault: function () { }
  });

  assert.equal(messages.length, resultMessagesCount, "Passed!");
  assert.equal(window.document.getElementsByClassName(messageHistoryClass)[0].children.length, resultChildrenCount, "Passed!");
});

QUnit.test("test answer generating", function (assert) {
  var message = "test message";
  var resultAnswer = "Ответ на \"{" + message.toUpperCase() + "}\"";

  assert.equal(generateAnswer(message), resultAnswer, "Passed!");
});

QUnit.test("test answer sending", function (assert) {
  var resultMessagesCount = messages.length + 1;
  var resultChildrenCount = window.document.getElementsByClassName(messageHistoryClass)[0].children.length + 1;
  var testMessage = new HistoryItem(new Date(), messageSender, "test message");
  var resultMessage = new HistoryItem(new Date(), answer.sender, generateAnswer(testMessage.text));

  sendAnswer(testMessage);

  assert.equal(messages.length, resultMessagesCount, "Passed!");
  assert.propEqual(messages[messages.length - 1], resultMessage, "Passed!");
  assert.equal(window.document.getElementsByClassName(messageHistoryClass)[0].children.length, resultChildrenCount, "Passed!");
});