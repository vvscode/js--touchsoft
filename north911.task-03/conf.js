function changeCode() {

    var codeTranscript = document.getElementById('codeTranscript');
    var chatTitle = document.getElementById('chatTitle').value;
    var botName = document.getElementById('botName').value;
    var chatURL = document.getElementById('chatURL').value;
    var cssClass = document.getElementById('cssClass').value;
    var position = document.getElementById('position').value;
    var allowMin = document.getElementById('allowMin').checked;
    var allowDrag = document.getElementById('allowDrag').checked;
    var reqName = document.getElementById('reqName').checked;
    var showTime = document.getElementById('showTime').checked;
    var requestType = document.querySelector('input[name="optionsRadiosInline"]:checked').value;


    codeTranscript.innerHTML = '';
    codeTranscript.innerHTML += '<script>\n';
    codeTranscript.innerHTML += 'function createConfigObject (){\n' + 'var configParams = {\n' +
        'chatTitle : \"' + chatTitle + '\",\n' +
        'botName : \"' + botName + '\",\n' +
        'chatURL : \"' + chatURL + '\",\n' +
        'cssClass : \"' + cssClass + '\",\n' +
        'position : \"' + position + '\",\n' +
        'allowMin : \"' + allowMin + '\",\n' +
        'allowDrag : \"' + allowDrag + '\",\n' +
        'reqName : \"' + reqName + '\",\n' +
        'showTime : \"' + showTime + '\"\n' +
        'requestType : \"' + requestType + '\",\n' +
        '};\n' +
        'return configParams;\n}\n';
    codeTranscript.innerHTML += '</script>\n';

}


