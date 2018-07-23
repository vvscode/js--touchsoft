/* global QUnit */
QUnit.module("Hash");

QUnit.test("Check configurators hash.", function test(assert) {
  window.location.hash = "";

  document.getElementById("idConfiguratorWP").click();
  assert.ok(
    window.location.hash === "#/configurator",
    "The test is successful"
  );
});

QUnit.test("Check setting of dashboards hash.", function test(assert) {
  window.location.hash = "";

  document.getElementById("idOperatorsDashboardWP").click();
  assert.ok(
    window.location.hash === "#/operatorsDashboard",
    "The test is successful"
  );
});

QUnit.test("Check setting of about pages hash.", function test(assert) {
  window.location.hash = "";

  document.getElementById("idAboutProjectWP").click();
  assert.ok(
    window.location.hash === "#/aboutProject",
    "The test is successful"
  );
});

QUnit.module("Adding DOM-elements", {
  beforeEach() {
    window.location.hash = "";
  }
});

QUnit.test("Adding configurator.", function test(assert) {
  var done = assert.async();
  document.getElementById("idConfiguratorWP").click();
  setTimeout(function a() {
    assert.ok(
      document.getElementById("idChatTitleText") !== null,
      "The test is successful"
    );
    done();
  }, 500);
});

QUnit.test("Adding operator's dashboard.", function test(assert) {
  var done = assert.async();
  document.getElementById("idOperatorsDashboardWP").click();
  setTimeout(function b() {
    assert.ok(
      document.getElementById("idActive") !== null,
      "The test is successful"
    );
    done();
  }, 500);
});

QUnit.test("Adding information about project.", function test(assert) {
  var done = assert.async();
  document.getElementById("idAboutProjectWP").click();
  setTimeout(function c() {
    assert.ok(
      document.getElementById("idAuthorClass") !== null,
      "The test is successful"
    );
    done();
  }, 500);
  setTimeout(function d() {
    document.getElementById("idHeaderWP").className = "";
    document.getElementById("idConfiguratorWP").innerHTML = "";
    document.getElementById("idOperatorsDashboardWP").innerHTML = "";
    document.getElementById("idAboutProjectWP").innerHTML = "";
    document
      .getElementById("idBlackBoard")
      .removeChild(document.getElementById("idNewEl"));
  }, 1000);
});
