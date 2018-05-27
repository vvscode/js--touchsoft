function clearWorkSpace() {
    var elem;
    if ((elem = document.getElementById("elemShowFeedback"))) {
        document.body.removeChild(elem);
    }
    if ((elem = document.getElementById("feedBack"))) {
        document.body.removeChild(elem);
    }
    sessionStorage.clear();
}

QUnit.test("Time change", function(assert) {
    assert.equal(checkTime(9), "09", "Equal");
    assert.notEqual(checkTime(9)), "19", "Not equal";
});
QUnit.module("Create and show");
QUnit.test("Create feedback", function(assert) {
    sessionStorage.setItem("message", "test");
    createFeedback();
    assert.ok(document.getElementById("feedBack"), "feedback show");
    assert.equal(
        document.getElementById("messageHistory").value,
        "test",
        "content correct"
    );
});

QUnit.test("Create collapsed feedback", function(assert) {
    createCollapsedFeedback();
    assert.ok(
        document.getElementById("elemShowFeedback"),
        "collapsed feedback created"
    );
});

QUnit.test("Show and hide feedback test", function(assert) {
    clearWorkSpace();
    createFeedback();
    hideFeedback();
    assert.ok(
        document.getElementById("elemShowFeedback"),
        "collapse feedback show"
    );
    console.log(document.getElementById("feedBack"));
    assert.ok(document.getElementById("feedBack") === null);
    showFeedback();
    assert.ok(document.getElementById("feedBack"), "feedback show");
});
QUnit.module("Check session storage");
QUnit.test("Check window test", function(assert) {
    clearWorkSpace();
    sessionStorage.setItem("isOpen", "button");
    checkWindow();
    assert.ok(
        document.getElementById("elemShowFeedback"),
        "collapse feedback created"
    );
    clearWorkSpace();
    sessionStorage.setItem("isOpen", "feedback");
    checkWindow();
    assert.ok(document.getElementById("feedBack"), "feedback created");
});
QUnit.module("Send message and response");
QUnit.test("Send message test", function(assert) {
    clearWorkSpace();
    createFeedback();
    var messageArea = document.getElementById("messageArea");
    messageArea.value = "test";
    sendMessage();
    var date = new Date();
    var minute = checkTime(date.getMinutes());
    var hour = checkTime(date.getHours());
    message = "\n" + [hour, minute].join(":") + " You: " + "test";
    assert.equal(
        message,
        sessionStorage.getItem("message"),
        "value in sessionStorage"
    );
    var messageHistory = document.getElementById("messageHistory").value;
    assert.equal(messageHistory, message, "true value in chat");
});

QUnit.test("response to message", function(assert) {
    clearWorkSpace();
    createFeedback();
    sessionStorage.setItem("message", "");
    getReplyForMessage("test")();
    var messageHistory = document.getElementById("messageHistory").value;
    var date = new Date();
    var minute = checkTime(date.getMinutes());
    var hour = checkTime(date.getHours());
    correctMessageHistory =
        "\n" + [hour, minute].join(":") + " Bot: Response to 'test'";
    assert.equal(messageHistory, correctMessageHistory, "correct response");
});
QUnit.module("test send by press button");
QUnit.test("send message by pressing the button", function(assert) {
    clearWorkSpace();
    createFeedback();
    var messageArea = document.getElementById("messageArea");
    messageArea.value = "test";
    var sendButton = document.getElementById("sendMessageButton");
    sendButton.click();
    var date = new Date();
    var minute = checkTime(date.getMinutes());
    var hour = checkTime(date.getHours());
    message = "\n" + [hour, minute].join(":") + " You: " + "test";
    assert.equal(
        message,
        document.getElementById("messageHistory").value,
        "correct send message"
    );
});
QUnit.module("test collapse and maximize by press button");
QUnit.test("collapse feedback", function(assert) {
    clearWorkSpace();
    createFeedback();
    assert.ok(document.getElementById("feedBack"), "feedBack show");
    document.getElementById("collapse").click();
    assert.ok(
        document.getElementById("elemShowFeedback"),
        "collapse feedback show"
    );
    assert.ok(document.getElementById("feedBack") == null, "feedback not show");
});
QUnit.test("maximize feedback", function(assert) {
    clearWorkSpace();
    createCollapsedFeedback();
    assert.ok(
        document.getElementById("elemShowFeedback"),
        "collapse feedback show"
    );
    document.getElementById("maximize").click();
    assert.ok(document.getElementById("feedBack"), "feedback show");
    assert.ok(
        document.getElementById("elemShowFeedback") == null,
        "collapse feedback not show"
    );
    clearWorkSpace();
});
