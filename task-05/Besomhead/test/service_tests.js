/* global QUnit */
/* global window */

var module = QUnit.module;
var test = QUnit.test;

function getTestEvent() {
  return new CustomEvent("click", { bubbles: true });
}

if (sessionStorage.getItem("reloadTested") === null) {
  sessionStorage.setItem("reloadTested", "false");
}

module("Test markup");
test("should append 3 buttons", function testCase(assert) {
  assert.equal(
    document
      .getElementById("service-buttons-container")
      .getElementsByTagName("button").length,
    3
  );
});
test("should append buttons with proper routing values", function testCase(assert) {
  var buttons = Array.from(
    document
      .getElementById("service-buttons-container")
      .getElementsByTagName("button")
  );
  assert.equal(buttons.shift().value, "#configurator");
  assert.equal(buttons.shift().value, "#dashboard");
  assert.equal(buttons.shift().value, "#about");
});

module("Test configurator button");
test("should change hash", function testCase(assert) {
  var event = getTestEvent();

  window.location.hash = "";
  document
    .getElementById("service-buttons-container")
    .getElementsByTagName("button")[0]
    .dispatchEvent(event);
  assert.notEqual("", window.location.hash);
});
test("should set proper hash", function testCase(assert) {
  var event = getTestEvent();

  document
    .getElementById("service-buttons-container")
    .getElementsByTagName("button")[0]
    .dispatchEvent(event);
  assert.equal(window.location.hash, "#configurator");
});
test("should append proper content", function testCase(assert) {
  var event = getTestEvent();

  document
    .getElementById("service-buttons-container")
    .getElementsByTagName("button")[0]
    .dispatchEvent(event);
  assert.notEqual(
    document
      .getElementById("service-selected-content-container")
      .src.indexOf("chat_configurator.html"),
    -1
  );
});

module("Test dashboard button");
test("should change hash", function testCase(assert) {
  var event = getTestEvent();

  window.location.hash = "";
  document
    .getElementById("service-buttons-container")
    .getElementsByTagName("button")[1]
    .dispatchEvent(event);
  assert.notEqual("", window.location.hash);
});
test("should set proper hash", function testCase(assert) {
  var event = getTestEvent();

  document
    .getElementById("service-buttons-container")
    .getElementsByTagName("button")[1]
    .dispatchEvent(event);
  assert.equal(window.location.hash, "#dashboard");
});
test("should append proper content", function testCase(assert) {
  var event = getTestEvent();

  document
    .getElementById("service-buttons-container")
    .getElementsByTagName("button")[1]
    .dispatchEvent(event);
  assert.notEqual(
    document
      .getElementById("service-selected-content-container")
      .src.indexOf("dashboard.html"),
    -1
  );
});

module("Test about button");
test("should change hash", function testCase(assert) {
  var event = getTestEvent();

  window.location.hash = "";
  document
    .getElementById("service-buttons-container")
    .getElementsByTagName("button")[2]
    .dispatchEvent(event);
  assert.notEqual("", window.location.hash);
});
test("should set proper hash", function testCase(assert) {
  var event = getTestEvent();

  document
    .getElementById("service-buttons-container")
    .getElementsByTagName("button")[2]
    .dispatchEvent(event);
  assert.equal(window.location.hash, "#about");
});
test("should append proper content", function testCase(assert) {
  var event = getTestEvent();

  document
    .getElementById("service-buttons-container")
    .getElementsByTagName("button")[2]
    .dispatchEvent(event);
  assert.notEqual(
    document
      .getElementById("service-selected-content-container")
      .src.indexOf("about.html"),
    -1
  );
});

module("Test reload", {
  before() {
    if (sessionStorage.getItem("reloadTested") === "false") {
      sessionStorage.removeItem("prevHash");
      sessionStorage.removeItem("prevStateTest");
    }
  },
  after() {
    sessionStorage.setItem("reloadTested", "true");
  }
});
test("should save hash", function testCase(assert) {
  if (sessionStorage.getItem("prevHash") === null) {
    sessionStorage.setItem("prevHash", window.location.hash);
    window.location.reload(false);
  } else {
    assert.equal(window.location.hash, sessionStorage.getItem("prevHash"));
  }
});
test("should save app state", function testCase(assert) {
  if (sessionStorage.getItem("prevStateTest") === null) {
    window.location.hash = "#about";
    sessionStorage.setItem("prevStateTest", "true");
    window.location.reload(false);
  } else {
    assert.notEqual(
      document
        .getElementById("service-selected-content-container")
        .src.indexOf("about.html"),
      -1
    );
  }
});
