var configJS = (function configJS() {
  var newConfig = {
    chatTitle: "Chat",
    botName: "Bot",
    chatUrl: "https://tanyachatfb.firebaseio.com",
    cssClass: "tsChatGreen",
    position: "right",
    allowToMinimize: false,
    allowToDragAndDrop: false,
    requireName: false,
    showTime: false,
    networkXHR: true,
    networkFetch: false
  };

  var listener;

  function createPage() {
    var importTag = document.createElement("div");
    importTag.id = "idNewEl";
    importTag.innerHTML =
      '<div class="configClass borders"><div><div><div id="idChatTitleText" class="topChatTitle chatConfigSettings">Chat Title</div><input type="text" class="chatConfigSettings" id="chatTitle"></div><div>' +
      '<div id="idBotName" class="chatConfigSettings">Bot Name</div><input class="chatConfigSettings" type="text" id="botName"></div><div>' +
      '<div id="idChatUrl" class="chatConfigSettings">Chat URL</div><input class="chatConfigSettings" type="text" id="chatUrl" value="https://tanyachatfb.firebaseio.com"></div>' +
      '<div><div id="idCssClass"  class="chatConfigSettings">CSS class</div><input type="text"  class="chatConfigSettings" id="cssClass" value="tsChatOrange"></div>' +
      '<div style="width: 50px"><div id="idPosition"  style="width: 50px" class="chatConfigSettings">Position</div><select class="selectClass chatConfigSettings" id="chatPositionSelect"><option id="idSelectRight">Right</option>' +
      '<option  class="chatConfigSettings" id="idSelectLeft">Left</option></select></div>' +
      '<div><div id="idAllowToMinimize"  class="chatConfigSettings">Allow to minimize</div><div><input type="checkbox"  class="chatConfigSettings" id="allowToMinimize"></div>' +
      '<div   class="chatConfigSettings" id="idAllowToDrag">Allow drag</div><div><input type="checkbox"  class="chatConfigSettings" id="allowToDragAndDrop"></div>' +
      '<div  class="chatConfigSettings" id="idRequireName">Require name</div><div><input type="checkbox"  class="chatConfigSettings" id="requireName"></div>' +
      '<div  class="chatConfigSettings" id="idShowTime">Show time</div><div><input type="checkbox"  class="chatConfigSettings" id="showTime"></div></div>' +
      '<form action=""><div  class="chatConfigSettings" id="idXhr">XHR</div><input type="radio"  class="chatConfigSettings" name="contact" id="networkRadioXHR">' +
      '<div id="idFetch"  class="chatConfigSettings">fetch</div><input type="radio" name="contact"  class="chatConfigSettings" id="networkRadioFetch"></form></div>' +
      '<container><div id="generatedCode"  class="scriptSettings"></div></container></div>';
    return importTag;
  }

  function sendSettings() {
    var id = localStorage.getItem("idForTanyaChat");
    fetch(newConfig.chatUrl + "/settings/" + id + "/.json", {
      method: "PUT",
      body: JSON.stringify(newConfig),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(function a(response) {
        return response.json();
      })
      .then(function b(res) {
        return res;
      });
  }

  function changeConfiguration() {
    var generatedCode = document.getElementById("generatedCode");
    generatedCode.innerText =
      '<script type="text/javascript" src="https://rawgit.com/TatyanaTimoshek/js--touchsoft/AWebPage/task-05/TatyanaTimoshek/js/chat.js"></script>\n' +
      '<script type="text/javascript">' +
      "newConfig = {\n" +
      '    chatTitle: "' +
      newConfig.chatTitle +
      '",\n' +
      '    botName: "' +
      newConfig.botName +
      '",\n' +
      '    chatURL: "' +
      newConfig.chatUrl +
      '",\n' +
      '    CSS: "' +
      newConfig.cssClass +
      '",\n' +
      '    position: "' +
      newConfig.position +
      '",\n' +
      "    allowToMinimize:" +
      newConfig.allowToMinimize +
      ",\n" +
      "    allowToDragAndDrop:" +
      newConfig.allowToDragAndDrop +
      ",\n" +
      "    requireName:" +
      newConfig.requireName +
      ",\n" +
      "    showTime:" +
      newConfig.showTime +
      ",\n" +
      "    networkFetch:" +
      newConfig.networkFetch +
      ",\n" +
      "    networkXHR:" +
      newConfig.networkXHR +
      ",\n" +
      "}</script>";
    sendSettings();
  }

  function applyConfiguration() {
    var chatTitle = document.getElementById("chatTitle");
    var botName = document.getElementById("botName");
    var chatUrl = document.getElementById("chatUrl");
    var cssClass = document.getElementById("cssClass");
    var chatPositionSelect = document.getElementById("chatPositionSelect");
    var allowToMinimize = document.getElementById("allowToMinimize");
    var allowToDragAndDrop = document.getElementById("allowToDragAndDrop");
    var requireName = document.getElementById("requireName");
    var showTime = document.getElementById("showTime");
    var xhr = document.getElementById("networkRadioXHR");
    var fetch = document.getElementById("networkRadioFetch");
    chatTitle.addEventListener("change", function c() {
      if (chatTitle.value !== "" && chatTitle.value !== " ") {
        newConfig.chatTitle = chatTitle.value;
        changeConfiguration();
      }
    });
    botName.addEventListener("change", function d() {
      if (botName.value !== "" && botName.value !== " ") {
        newConfig.botName = botName.value;
        changeConfiguration();
      }
    });
    chatUrl.addEventListener("change", function e() {
      if (chatUrl.value !== "" && chatUrl.value !== " ") {
        newConfig.chatUrl = chatUrl.value;
        changeConfiguration();
      }
    });
    cssClass.addEventListener("change", function f() {
      if (cssClass.value !== "" && cssClass.value !== " ") {
        newConfig.cssClass = cssClass.value;
        changeConfiguration();
      }
    });
    chatPositionSelect.addEventListener("change", function g() {
      var position = chatPositionSelect.value;
      if (position === "Left") {
        newConfig.position = "left";
      } else {
        newConfig.position = "right";
      }
      changeConfiguration();
    });
    allowToMinimize.addEventListener("change", function h() {
      newConfig.allowToMinimize = allowToMinimize.checked;
      changeConfiguration();
    });
    allowToDragAndDrop.addEventListener("change", function i() {
      newConfig.allowToDragAndDrop = allowToDragAndDrop.checked;
      changeConfiguration();
    });
    requireName.addEventListener("change", function j() {
      newConfig.requireName = requireName.checked;
      changeConfiguration();
    });
    showTime.addEventListener("change", function k() {
      newConfig.showTime = showTime.checked;
      changeConfiguration();
    });
    xhr.addEventListener("change", function l() {
      newConfig.networkXHR = true;
      newConfig.networkFetch = false;
      changeConfiguration();
    });
    fetch.addEventListener("change", function m() {
      newConfig.networkXHR = false;
      newConfig.networkFetch = true;
      changeConfiguration();
    });
  }

  listener = function done() {
    applyConfiguration();
    changeConfiguration();
  };
  return {
    create: createPage,
    init: listener
  };
})();
