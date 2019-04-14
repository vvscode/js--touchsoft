var title = document.getElementById('title');
var botName = document.getElementById('bot-name');
var url = document.getElementById('url');
var classCSS = document.getElementById('classCSS');
var position = document.getElementById('position-chat');
var minimize = document.getElementById('minimize');
var drag = document.getElementById('drag');
var requireName = document.getElementById('requireName');
var dateTime = document.getElementById('dateTime');
var codeForInsert = document.getElementById('codeForInsert');
var radioBox1 = document.getElementById('radioBox1');
var radioBox2 = document.getElementById('radioBox2');

function loadConfig(){
    title.addEventListener('input', updateConfig);
    botName.addEventListener('input', updateConfig);
    url.addEventListener('input', updateConfig);
    classCSS.addEventListener('input', updateConfig);
    position.addEventListener("change", updateConfig);
    minimize.addEventListener("change", updateConfig);
    drag.addEventListener('change', updateConfig);
    requireName.addEventListener('change', updateConfig);
    dateTime.addEventListener('change', updateConfig);
    radioBox1.addEventListener('change', updateConfig);
    radioBox2.addEventListener('change', updateConfig);
}

function getPosition() {
    if (position.value !== 'Left/Right') return position.value;
    else return 'Right';
}

function getRadioChange() {
    if (radioBox1.checked) return 'XHR';
    else return 'fetch';
}

function kav() {
    return '"';
}

function updateConfig(){
    codeForInsert.innerText =
        "<script src=" + kav() + "js/script.js?" +
        "title='" + title.value + "'&" +
        "botName='" + botName.value + "'&" +
        "chatUrl='" + url.value + "'&" +
        "cssClass='" + classCSS.value + "'&" +
        "position='" + getPosition() + "'&" +
        "allowMinimize='" + minimize.checked + "'&" +
        "allowDrag='" + drag.checked + "'&" +
        "showDateTime='" + requireName.checked + "'&" +
        "requireName='" + dateTime.checked + "'&" +
        "requests='" + getRadioChange() + "'" + kav() + "" +
        "></script>"
}


window.onload = function() {
    updateConfig();
    loadConfig();
};

