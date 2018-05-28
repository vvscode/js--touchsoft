// var testMessageObject;
// var testMessageReply;

if (sessionStorage.getItem("reload-tested") === null) {
  sessionStorage.setItem("reload-tested", "false");
}

QUnit.module("Test initial chat state", {
  before(assert) {
    localStorage.clear();
    document.body.removeChild(document.getElementById("chat"));
    createChatMarkup();
  }
});
QUnit.test("should be collapsed at the first time", function(assert) {
  assert.equal(localStorage.getItem("chat"), "chat-collapsed");
});
QUnit.test("should have collapsed CSS-class", function(assert) {
  assert.ok(
    document.getElementById("chat").classList.contains("chat-collapsed")
  );
});

QUnit.module("Test configuration remaining", {
  before(assert) {
    if (sessionStorage.getItem("reload-tested") === "false") {
      sessionStorage.setItem("prev-chat-state", localStorage.getItem("chat"));
      sessionStorage.setItem(
        "prev-chat-style",
        document.getElementById("chat").classList[1]
      );
      sessionStorage.setItem(
        "prev-chat-messages",
        localStorage.getItem("chat-messages")
      );
      window.location.reload(true);
    }
  },
  after(assert) {
    sessionStorage.setItem("reload-tested", "true");
  }
});
QUnit.test("should save chat state", function(assert) {
  assert.equal(
    localStorage.getItem("chat"),
    sessionStorage.getItem("prev-chat-state")
  );
});
QUnit.test("should save chat style", function(assert) {
  assert.equal(
    document.getElementById("chat").classList[1],
    sessionStorage.getItem("prev-chat-style")
  );
});
QUnit.test("should save messages", function(assert) {
  assert.deepEqual(
    JSON.parse(localStorage.getItem("chat-messages")),
    JSON.parse(sessionStorage.getItem("prev-chat-messages"))
  );
});

QUnit.module("Test toggle-button");
QUnit.test("should change chat state", function(assert) {
  var prevChatState = localStorage.getItem("chat");
  document.getElementById("chat-toggle-button").onclick();
  assert.notEqual(localStorage.getItem("chat"), prevChatState);
});
QUnit.test("should change chat style", function(assert) {
  var prevChatStyle = document.getElementById("chat").classList[1];
  document.getElementById("chat-toggle-button").onclick();
  assert.notEqual(document.getElementById("chat").classList[1], prevChatStyle);
});

// QUnit.module("Test send button", {
//   before(assert) {
//     if (localStorage.getItem("chat") === "chat-collapsed") {
//       document.getElementById("chat-toggle-button").onclick();
//     }
//     document.getElementById("chat-toggle-button").onclick();
//     document.getElementById("chat-input-txt").value = "Тестовое сообщение";
//     testMessageObject = new Message(new Date(), "Вы:", "Тестовое сообщение");
//     document.getElementById("chat-message-button").onclick();
//   }
// });
// QUnit.test("should save new message to localStorage", function(assert) {
//   var messages = localStorage.getItem("chat-messages");
//   assert.deepEqual(
//     JSON.parse(messages)[messages.length - 1],
//     new Message(new Date(), "Вы:", "Тестовое сообщение")
//   );
// });
// QUnit.test("should have proper message format", function(assert) {
//   assert.deepEqual();
// });
// QUnit.test("should append new message to the form", function(assert) {});
// QUnit.test("should send reply on 15 sec delay", function(assert) {});
// QUnit.test("should save reply to localStorage", function(assert) {});
// QUnit.test("should append reply to the form", function(assert) {});
// QUnit.test("should have proper reply format", function(assert) {});
