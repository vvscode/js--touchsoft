var variables = ['cfg-chat-title', 'cfg-bot-name', 'cfg-chatURL',
    'cfg-css-class', 'cfg-position', 'cfg-allow-minimize',
    'cfg-allow-drag', 'cfg-require-name', 'cfg-show-date-time',
    'cfg-xhr', 'cfg-fetch'
];
var chatVariables = {};
var containerForScript;

function showScript() {
    var variablesStr = JSON.stringify(chatVariables)
        .replace(new RegExp(',', 'g'), ',\n');
    containerForScript.innerText = '<script src="ChatScript.js"></script>\n' +
        '<script>\n' +
        '(function(){\nnew Chat(configChat,\n' + variablesStr + ');\n})();' +
        '\n</script>';
}

function initChatURL() {
    variables.forEach(function fun(element) {
        var elem = document.getElementById(element);
        if (elem.type === 'text') {
            chatVariables[elem.name] = elem.value;
        } else if (elem.type === 'checkbox') {
            chatVariables[elem.name] = elem.checked;
        } else if (elem.type === 'radio') {
            chatVariables.requests =
                document.querySelector('input[name="requests"]:checked').value;
        } else if (elem.type === 'select-one') {
            chatVariables.position = elem.selectedOptions[0].value;
        }
    });
    showScript();
}

document.addEventListener('DOMContentLoaded', function load() {
    containerForScript = document.getElementById('script');
    initChatURL();
    variables.forEach(function f(element) {
        document.getElementById(element).addEventListener('input', function () {
            initChatURL();
        });
    });
});