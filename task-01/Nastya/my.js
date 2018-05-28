var isChatHidden = false;
var chatElement;
var createChat = function () {           
   var main = document.createElement('div');
   main.style.background = '#d3cadb';
   main.style.width = '300px';
   main.style['max-height'] = '400px';
   main.style.position = 'fixed';
   main.style.right = '20px';
   main.style.bottom = '20px';
   main.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.75)';
   main.style.borderRadius = '10px';
  
   var history = createHistory();
   chatElement = history;
   var stateButton = createStateButton();
   var textInput = createTextInput();
   var button = createButton();

   main.appendChild(stateButton);
   main.appendChild(history);
   main.appendChild(textInput);
   main.appendChild(button); 

   var parentElem = document.body;
   parentElem.appendChild(main);

}

function addHistoryToPage() {
   var historyArray = localStorage.getItem('historyArray');
   if (historyArray !== null) {
   var messages = JSON.parse(historyArray);
   var historyPanel = document.getElementById('historyPanel');
   messages.forEach(function (element) {
       var message = new Message(new Date(element.time), element.sender, element.body);
       historyPanel.innerHTML += '<br>' + message.showMessage();
   }
   );
   isChatHidden = JSON.parse(getChatStatus());
   chatElement.style.display = isChatHidden ? 'none' : 'block';
    }
}

window.addEventListener('load', createChat);
window.addEventListener('load', addHistoryToPage);

function createTextInput() {
   var textArea = document.createElement('textArea');
   textArea.id = 'txt';
   textArea.style.border = '1px solid #545459';
   textArea.style.background = 'transparent';
   textArea.style.width = '70%';
   textArea.style.height = '80px';
   textArea.style.color = '#545459';
   textArea.style.float = 'left';

   return textArea;
}

function createButton() {
   var button = document.createElement('button');
   button.id = 'btn';
   button.style.width = '25%';
   button.style.border = '1px solid #545459';
   button.style.background = 'transparent';
   button.style.color = '#545459';
   button.style.height = '35px';
   button.style.float = 'right';
   button.innerHTML = 'Send message';
   button.addEventListener("click", sendMessage);

   return button;
}

function createStateButton() {
   var stateButton = document.createElement('button');
   stateButton.id = 'stateButton';
   stateButton.style.width = '20px';
   stateButton.style.height = '20px';
   stateButton.style.float = 'right';
   stateButton.innerHTML = '?';

   stateButton.addEventListener('click', function(){       
       isChatHidden = !isChatHidden;
       setChatStatus(isChatHidden);
       chatElement.style.display = isChatHidden ? 'none' : 'block';               
   });

   return stateButton;
}

function createHistory() {
   var historyPanel = document.createElement("div");
   historyPanel.style.height = "290px";
   historyPanel.style.padding = '10px';
   historyPanel.style.overflowY = "scroll";   
   historyPanel.id = 'historyPanel';   

   return historyPanel;
}


function sendMessage() {
   var text = document.getElementById('txt');
   addMessage(text.value);
   addAnswer(text.value);
   text.value = '';
}

function addMessage(text) {
   var message = new Message(new Date(), 'YOU', text);
   var historyPanel = document.getElementById('historyPanel');
   historyPanel.innerHTML += '<br>' + message.showMessage();
   saveMessageToLocalStorage(message);
}

function addAnswer(text) {
   var createAnswer = function () {
       var message = new Message(new Date(), "WALL-E", 'The answer to the "' + text.toUpperCase() + '"');
       var historyPanel = document.getElementById('historyPanel');
       historyPanel.innerHTML += '<br>' + message.showMessage();
       saveMessageToLocalStorage(message);

       return message;
   }
   setTimeout(createAnswer, 15000);
}

function saveMessageToLocalStorage(message) {
   var historyArray = localStorage.getItem('historyArray');
   var messages;
   if (historyArray === null) {
       messages = new Array();
   } else {
       messages = JSON.parse(historyArray);
   }

   messages.push(message);
   localStorage.setItem('historyArray', JSON.stringify(messages));
}

var options = {
   year: 'numeric',
   month: 'long',
   day: 'numeric',
};

function Message(time, sender, body) {
   this.time = time;
   this.sender = sender;
   this.body = body;

   this.showMessage = function () {
       return this.time.toLocaleString("en-US", options) + " " + this.time.getHours() + ":" + time.getMinutes() + " " + this.sender + '<br>' + this.body + '<br>';
   }
}

function getChatStatus() {
   return localStorage.getItem('isChatHidden');
}

function setChatStatus(isChatHidden) {
   localStorage.setItem('isChatHidden', isChatHidden);
}