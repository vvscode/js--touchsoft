var currentUserName = 'user'
var botName = 'bot'
var isChatMinimized = true
var messageHistoryStorage
var chatName = 'Chat Name'
function getCssLocation() {
  return ''
}

function Message(time, userName, text) {
  this.time = time
  this.userName = userName
  this.text = text 
}

Message.prototype.getFullMessage = function getFullMessage() {
  return this.time + ' ' + this.userName + ': ' + this.text
}

function MessageHistoryStorage(storage) {
  console.log(storage)
  this.array = (storage !== null) ? JSON.parse(storage) : new Array(0)
}

MessageHistoryStorage.prototype.push = function pushMessage(message) {
      this.array.push(message);
      localStorage.setItem("messageHistory", JSON.stringify(this.array))
};

function loadCss() {
  var cssFile = document.createElement('link')
  cssFile.setAttribute('id', 'chatCss')
  cssFile.setAttribute('rel', 'stylesheet')
  cssFile.setAttribute('type', 'text/css')
  cssFile.setAttribute('href', getCssLocation() + 'chat.css')
  document.getElementsByTagName('head')[0].appendChild(cssFile)
}

function addMessageToList(fullMessage) {
  var listElement = document.createElement('li')
  listElement.innerText = fullMessage
  messageList.appendChild(listElement)
  listElement.scrollIntoView()
}

function postChatMessage(message, username) {
  var currentDate = new Date()
  var messageTime = currentDate.toLocaleTimeString().substr(0, 5)
  var newMessage = new Message(messageTime, username, message)
  messageHistoryStorage.push(newMessage)
  addMessageToList(newMessage.getFullMessage())  
}

function loadMessageHistory() {
  messageHistoryStorage.array.forEach(function loadMessage(message) {
    addMessageToList(message.getFullMessage())
  });
}

function toggleMinimization() {
  var currentState
  var newState
  if (isChatMinimized) {
    currentState = 'minimized'
    newState = 'maximized'
  } else {
    currentState = 'maximized'
    newState = 'minimized'
  }
  chatBody.classList.replace(currentState, newState)
  isChatMinimized = !isChatMinimized
}

function createChatHeader() {
  var chatHeader = document.createElement('div')
  var minimizeButton = document.createElement('span')
  var chatNameContainer = document.createElement('span')

  chatHeader.classList.add('chatHeader')
  minimizeButton.classList.add('minimizeButton')
  minimizeButton.innerHTML = '<a><b>X</b></a>'
  chatNameContainer.innerText = chatName
  minimizeButton.addEventListener('click', function() { toggleMinimization() })
 chatHeader.appendChild(minimizeButton)
  chatHeader.appendChild(chatNameContainer)
  return chatHeader
}

window.onload = function addChat() {
  var chatDiv = document.createElement('div')
  messageList = document.createElement('ul')
  var sendButton = document.createElement('button')
  var chatInput = document.createElement('textArea')
  var inputPanel = document.createElement('div')
  var messageListPanel = document.createElement('div')
  var chatHeader = createChatHeader()
  chatBody = document.createElement('div')
  messageHistoryStorage = new MessageHistoryStorage(localStorage.getItem('messageHistory'))
  loadCss()
  chatDiv.classList.add('chat')
  messageList.classList.add('chatMessageList')
  sendButton.classList.add('sendButton')
  chatInput.classList.add('chatInput')
  inputPanel.classList.add('inputPanel')
  chatBody.classList.add('chatBody', 'minimized')
  messageListPanel.classList.add('chatMessageListPanel')
  
  sendButton.innerText = 'Send'
  this.console.log(messageHistoryStorage.array.length)
  if (messageHistoryStorage.array.length > 0) {
    loadMessageHistory()
    this.console.log('Loaded')
  }

  sendButton.onclick = function sendClicked() {
    var messageText = chatInput.value
    var BOT_ANSWER_DELAY = 15000
    postChatMessage(messageText, currentUserName)
    setTimeout(function reply() {
      postChatMessage(
        'Answer to message ' + messageText.toUpperCase(),
        botName
      )
    }, BOT_ANSWER_DELAY)
  }

  

  document.body.appendChild(chatDiv)
  chatDiv.appendChild(chatHeader)
  chatDiv.appendChild(chatBody)
  chatBody.appendChild(messageListPanel)
  messageListPanel.appendChild(messageList)
  chatBody.appendChild(inputPanel)
  inputPanel.appendChild(chatInput)
  inputPanel.appendChild(sendButton)
}
