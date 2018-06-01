var pattern = "touchsoft_chat-launcher_";
var after = [
    "chatTitle", "botName", "chatUrl", "chatClass", "chatPositionSelect",
    "allowMinimize", "allowDrag", "requireName", "showTime", "networkRadioXMR",
    "networkRadioFetch", "scriptCode"
];
var DOMVariables = {};

for(var i = 0; i < after.length; i++) {
    DOMVariables[after[i]] = document.getElementById(pattern + after[i]);
}


for(var j = 0; j < after.length-1; j++) {
    DOMVariables[after[j]].addEventListener("change", function () {
        createSctipt();
    });
}

function createSctipt() {
    var src = "https://rawgit.com/UnacceptableCondition/Homework_2/master/js/chat.js?title='" +
        DOMVariables.chatTitle.value + "'&botName='" +
        DOMVariables.botName.value + "'&chatUrl='" +
        DOMVariables.chatUrl.value + "'&cssClass='" +
        DOMVariables.chatClass.value + "'&position='" +
        DOMVariables.chatPositionSelect.value + "'&allowMinimize='" +
        DOMVariables.allowMinimize.checked + "'&allowDrag='" +
        DOMVariables.allowDrag.checked + "'&showDateTime='" +
        DOMVariables.showTime.checked + "'&requireName='" +
        DOMVariables.requireName.checked + "'&requests='";
    if(DOMVariables.networkRadioXMR.checked) {
        src += "XMR'";
    } else {
        src += "fetch'";
    }
        // DOMVariables.chatTitle.value + "'";
    DOMVariables.scriptCode.innerHTML = src;
}