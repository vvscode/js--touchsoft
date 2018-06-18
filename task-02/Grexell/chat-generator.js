(function(){
    var checkbox = "checkbox";
    var text = "text";
    var slash = "\"";

    window.keys = [
    "chat-title",
    "user-name-check",
    "position-chat",
    "minimize-check",
    "bot-name",
    "chat-url",
    "css-class",
    "drop-check",
    "chat-date-check",
    "chat-network"
    ];
    
    window.chatTitile = "chat-title";
    window.botName = "bot-name";
    window.chatURL = "chat-url";
    window.cssClass = "css-class";
    window.position = "position-chat";
    window.minimize = "minimize-check";
    window.drop = "drop-check";
    window.username = "user-name-check";
    window.time = "chat-date-check";
    window.network = "chat-network";
    
    window.properties = {

    };

    window.pattern = "<script src='" + window.scriptURL + "'></script>\n<script> (function(){\n" + 
    "initChat(" + window.keys.join(", ") + ");"
    + "})();</script";
    window.scriptURL = "https://rawgit.com/Grexell/js--touchsoft/master/task-01/Grexell/chat.js";
    window.resultText = "chat-script-uses";
    
    window.printProperties = function (prop) {
        var result = window.pattern;
    
        Object.keys(prop).forEach(function (element) {
            result = result.replace(element, prop[element]);
        });
    
        return result;
    };
    
    window.parseProperty = function (element){
        var result;
    
        if (element.type === checkbox) {
            result = element.checked;
        } else if (element.type === text){
            result = slash + element.value + slash;
        } else {
            result = element.value;
        }
        
        return result;
    };
    
    window.initProperties = function (form) {
        var props = {};
    
        window.keys.forEach(function(element){
            props[element] = parseProperty(form[element]);
        });
    
        return props;
    };
    
    window.changeProperties = function (event) {
        var resultTextArea = window.document.getElementById(resultText);
        if (this != event.target && event.target != resultTextArea) {
            window.properties[event.target.name] = window.parseProperty(event.target);
            resultTextArea.value = window.printProperties(window.properties);
        }
    };
    
    window.startGenerator = function () {
        var form = window.document.getElementById("chat-configurator");
        var resultTextArea = window.document.getElementById(resultText);
    
        properties = window.initProperties(form);
        resultTextArea.value = window.printProperties(properties);
    
        form.onchange = window.changeProperties;
    };
    window.onload = startGenerator;  
})();