window.QUnit.test("props printing", function (assert) {
    var properties = {
        prop1: "1",
        prop2: "2",
        prop3: "3"
    }
    window.pattern = "test properties prop1, prop2, prop3";

    assert.equal(window.printProperties(properties), pattern.replace("prop1", properties.prop1).replace("prop2", properties.prop2).replace("prop3", properties.prop3), "Passed!");
});

window.QUnit.test("parsing property", function (assert) {
    var elementTest = {
        type: "checkbox",
        value: "test text",
        checked: false
    }

    assert.equal(window.parseProperty(elementTest), elementTest.checked, "Passed!");

    elementTest.type = "text";
    assert.equal(window.parseProperty(elementTest), "\"" + elementTest.value + "\"", "Passed!");

    elementTest.type = "radio";
    assert.equal(window.parseProperty(elementTest), elementTest.value, "Passed!");

});

window.QUnit.test("initializing property", function (assert) {
    var formTest = {
        element1: {
            type: "checkbox",
            value: "test text",
            checked: false
        },
        element2: {
            type: "radio",
            value: "test text"
        },
        element3: {
            type: "radio",
            value: "test text1"
        }
    }

    var result = {
        element1: false,
        element2: "test text",
        element3: "test text1"
    }
     
    var tempKeys = window.keys.slice();
    window.keys = ["element1", "element2", "element3"];

    assert.propEqual(window.initProperties(formTest), result, "Passed!");

    window.keys = tempKeys;
});

window.QUnit.test("changing event", function (assert) {
    var event = {
        target: {
            name: "prop1",
            type: "radio",
            value: "test text",
            checked: false
        }
    }

    window.changeProperties(event);

    assert.equal(window.properties[event.target.name], event.target.value, "Passed!");
    assert.equal(document.getElementById(resultText).value, window.printProperties(properties), "Passed!");
});

window.QUnit.test("start generator", function (assert) {
    var form = document.getElementById("chat-configurator");
    var resultTextArea = window.document.getElementById(window.resultText);

    window.properties = {};
    window.startGenerator();

    assert.equal(form.onchange, window.changeProperties);
    assert.propEqual(properties, window.initProperties(form));
    assert.equal(resultTextArea.value, window.printProperties(properties));
});
