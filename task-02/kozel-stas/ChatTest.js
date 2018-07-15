QUnit.module("Test variables in local storage");
QUnit.test("Test isMin", function (assert) {
    assert.ok(localStorage.getItem("isMin") != null);
    assert.equal(localStorage.getItem("isMin"), chat.config.isMin.toString());
});
QUnit.module("Test config");
QUnit.test("Test config", function (assert) {
    if (chat.config.isMin) {
        assert.ok(!chat.config.DOMVariables.chatComponentRoot.elemDOM.classList.contains("visibility"));
        assert.ok(chat.config.DOMVariables.chatComponentRootMin.elemDOM.classList.contains("visibility"));
    } else {
        assert.ok(chat.config.DOMVariables.chatComponentRoot.elemDOM.classList.contains("visibility"));
        assert.ok(!chat.config.DOMVariables.chatComponentRootMin.elemDOM.classList.contains("visibility"));
    }
});
QUnit.test("Test trigStatusChat function", function (assert) {
    if (chat.config.isMin) {
        chat.config.isMin = !chat.config.isMin;
        chat.trigStatusChat();
        assert.ok(chat.config.DOMVariables.chatComponentRoot.elemDOM.classList.contains("visibility"));
        assert.ok(!chat.config.DOMVariables.chatComponentRootMin.elemDOM.classList.contains("visibility"));
        chat.config.isMin = !chat.config.isMin;
        chat.trigStatusChat();
        assert.ok(!chat.config.DOMVariables.chatComponentRoot.elemDOM.classList.contains("visibility"));
        assert.ok(chat.config.DOMVariables.chatComponentRootMin.elemDOM.classList.contains("visibility"));
    } else {
        chat.config.isMin = !chat.config.isMin;
        chat.trigStatusChat();
        assert.ok(!chat.config.DOMVariables.chatComponentRoot.elemDOM.classList.contains("visibility"));
        assert.ok(chat.config.DOMVariables.chatComponentRootMin.elemDOM.classList.contains("visibility"));
        chat.config.isMin = !chat.config.isMin;
        chat.trigStatusChat();
        assert.ok(chat.config.DOMVariables.chatComponentRoot.elemDOM.classList.contains("visibility"));
        assert.ok(!chat.config.DOMVariables.chatComponentRootMin.elemDOM.classList.contains("visibility"));
    }
});
