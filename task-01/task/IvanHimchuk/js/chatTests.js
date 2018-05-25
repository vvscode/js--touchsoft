QUnit.module("test functions and variables of ChatForTouchSoft class");
QUnit.test("should create a valid css link element", function(assert) {
    var testLink = chatForTouchSoft.createCSSLink(
        "https://rawgit.com/UnacceptableCondition/Homework_1/master/css/chat.css",
        "stylesheet",
        "text/css",
        "touch-soft-chat-css"
    );
    var openTag = "<" + testLink.tagName;
    for (var i = 0; i < testLink.attributes.length; i++) {
        var attrib = testLink.attributes[i];
        openTag += " " + attrib.name + "=" + attrib.value;
    }
    openTag += ">";
    assert.equal(
        openTag,
        "<LINK id=touch-soft-chat-css rel=stylesheet type=text/css href=https://rawgit.com/UnacceptableCondition/Homework_1/master/css/chat.css>",
        "this test is fine"
    );
});
QUnit.test("appDOMVariables has valid style classes", function(assert) {
    assert.ok(
        chatForTouchSoft
            .getDOMVariables("messagesBlock")
            .classList.contains("root_chat_for_touchsoft__top_messages"),
        "this test is fine"
    );
    assert.ok(
        chatForTouchSoft
            .getDOMVariables("minimizeStyleChatBlock")
            .classList.contains("root_chat_for_touchsoft_minimize-style"),
        "this test is fine"
    );
    assert.ok(
        chatForTouchSoft
            .getDOMVariables("mainStyleChatBlock")
            .classList.contains("root_chat_for_touchsoft"),
        "this test is fine"
    );
    assert.ok(
        chatForTouchSoft
            .getDOMVariables("messagesTextArea")
            .classList.contains("root_chat_for_touchsoft__textarea"),
        "this test is fine"
    );
    assert.ok(
        chatForTouchSoft
            .getDOMVariables("messagesInput")
            .classList.contains(
            "root_chat_for_touchsoft_minimize-style__message-input"
        ),
        "this test is fine"
    );
    assert.ok(
        chatForTouchSoft
            .getDOMVariables("mainSendButton")
            .classList.contains("root_chat_for_touchsoft__bottom_send-button"),
        "this test is fine"
    );
    assert.ok(
        chatForTouchSoft
            .getDOMVariables("minimizeSendButton")
            .classList.contains(
            "root_chat_for_touchsoft_minimize-style__send-button"
        ),
        "this test is fine"
    );
    assert.ok(
        chatForTouchSoft
            .getDOMVariables("setMinimizeStyleButton")
            .classList.contains("root_chat_for_touchsoft__top_minimize-button"),
        "this test is fine"
    );
    assert.ok(
        chatForTouchSoft
            .getDOMVariables("setMaxStyleButton")
            .classList.contains("root_chat_for_touchsoft_minimize-style__max-button"),
        "this test is fine"
    );
});
QUnit.test("appDOMVariables has valid type", function(assert) {
    assert.equal(
        chatForTouchSoft.getDOMVariables("messagesBlock").toString(),
        "[object HTMLDivElement]",
        "this test is fine"
    );
    assert.equal(
        chatForTouchSoft.getDOMVariables("minimizeStyleChatBlock").toString(),
        "[object HTMLDivElement]",
        "this test is fine"
    );
    assert.equal(
        chatForTouchSoft.getDOMVariables("mainStyleChatBlock").toString(),
        "[object HTMLDivElement]",
        "this test is fine"
    );
    assert.equal(
        chatForTouchSoft.getDOMVariables("messagesTextArea").toString(),
        "[object HTMLTextAreaElement]",
        "this test is fine"
    );
    assert.equal(
        chatForTouchSoft.getDOMVariables("messagesInput").toString(),
        "[object HTMLInputElement]",
        "this test is fine"
    );
    assert.equal(
        chatForTouchSoft.getDOMVariables("mainSendButton").toString(),
        "[object HTMLDivElement]",
        "this test is fine"
    );
    assert.equal(
        chatForTouchSoft.getDOMVariables("minimizeSendButton").toString(),
        "[object HTMLDivElement]",
        "this test is fine"
    );
    assert.equal(
        chatForTouchSoft.getDOMVariables("setMinimizeStyleButton").toString(),
        "[object HTMLDivElement]",
        "this test is fine"
    );
    assert.equal(
        chatForTouchSoft.getDOMVariables("setMaxStyleButton").toString(),
        "[object HTMLDivElement]",
        "this test is fine"
    );
});
QUnit.test("should changes app style", function(assert) {
    var firstCondition = chatForTouchSoft.isMinimizeStyle();
    chatForTouchSoft.minMaxStyleToggle();
    var secondCondition = chatForTouchSoft.isMinimizeStyle();
    assert.notEqual(firstCondition, secondCondition, "this test is fine");
    chatForTouchSoft.minMaxStyleToggle();
    secondCondition = chatForTouchSoft.isMinimizeStyle();
    assert.equal(firstCondition, secondCondition, "this test is fine");
});
QUnit.test("should save history message", function(assert) {
    localStorage.removeItem("testItem");
    var firstCondition = localStorage.getItem("testItem");
    assert.notOk(firstCondition, "firstly testItem is null");
    chatForTouchSoft.saveHistoryCorrespondence("TEST", "testItem", []);
    assert.equal(
        localStorage.getItem("testItem"),
        '["TEST"]',
        'secondly testItem is "[\\"TEST\\"]"'
    );
});
QUnit.test("should get history message", function(assert) {
    localStorage.removeItem("testItem");
    var firstCondition = localStorage.getItem("testItem");
    assert.notOk(firstCondition, "firstly testItem is null");
    localStorage.setItem("testItem", JSON.stringify([1, 2]));
    assert.deepEqual(
        chatForTouchSoft.getHistoryCorrespondence("testItem"),
        [1, 2],
        "secondly testItem is [1,2]"
    );
});

QUnit.module("test DOM from result page");
QUnit.test("should find link with chat css", function(assert) {
    var link = document.getElementById("touch-soft-chat-css");
    assert.equal(
        link.getAttribute("id"),
        "touch-soft-chat-css",
        "link's id is true"
    );
    assert.equal(link.getAttribute("rel"), "stylesheet", "link's rel is true");
    assert.equal(link.getAttribute("type"), "text/css", "link's type is true");
    assert.equal(
        link.getAttribute("href"),
        "https://rawgit.com/UnacceptableCondition/Homework_1/master/css/chat.css",
        "link's href is true"
    );
});
QUnit.test("should find main-style div and compare his DOM", function(assert) {
    var mainDiv = document.getElementsByClassName("root_chat_for_touchsoft")[0];
    assert.ok(
        mainDiv.firstElementChild.classList.contains(
            "root_chat_for_touchsoft__top"
        ),
        "first child ok"
    );
    assert.ok(
        mainDiv.firstElementChild.firstElementChild.classList.contains(
            "root_chat_for_touchsoft__top_messages"
        ),
        "first child, second level DOM, first element ok"
    );
    assert.ok(
        mainDiv.firstElementChild.lastElementChild.classList.contains(
            "root_chat_for_touchsoft__top_minimize-button"
        ),
        "first child, second level DOM, last element ok"
    );
    assert.ok(
        mainDiv.lastElementChild.classList.contains(
            "root_chat_for_touchsoft__bottom"
        ),
        "last child ok"
    );
    assert.ok(
        mainDiv.lastElementChild.firstElementChild.classList.contains(
            "root_chat_for_touchsoft__bottom_user-message"
        ),
        "last child, second level DOM, first element ok"
    );
    assert.ok(
        mainDiv.lastElementChild.lastElementChild.classList.contains(
            "root_chat_for_touchsoft__bottom_send-button"
        ),
        "last child, second level DOM, second element ok"
    );
    assert.ok(
        mainDiv.lastElementChild.firstElementChild.firstElementChild.classList.contains(
            "root_chat_for_touchsoft__textarea"
        ),
        "textArea is ok"
    );
});
QUnit.test("should find minimize-style div and compare his DOM", function(
    assert
) {
    var minDiv = document.getElementsByClassName(
        "root_chat_for_touchsoft_minimize-style"
    )[0];
    assert.ok(
        minDiv.firstElementChild.classList.contains(
            "root_chat_for_touchsoft_minimize-style__message"
        ),
        "first child ok"
    );
    assert.ok(
        minDiv.firstElementChild.firstElementChild.classList.contains(
            "root_chat_for_touchsoft_minimize-style__message-input"
        ),
        "input is ok"
    );
    assert.ok(
        minDiv.lastElementChild.classList.contains(
            "root_chat_for_touchsoft_minimize-style__max-button"
        ),
        "last child ok"
    );
    assert.ok(
        minDiv.lastElementChild.previousElementSibling.classList.contains(
            "root_chat_for_touchsoft_minimize-style__send-button"
        ),
        "midle child is ok"
    );
});
