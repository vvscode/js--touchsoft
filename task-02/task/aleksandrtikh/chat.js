var currentUserName = 'user'
var botName = 'bot'
var isChatMinimized = true
var messageHistoryStorage
var minClass = 'minimized'
var maxClass = 'maximized'
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
    addMessageToList(new Message(message.time, message.userName, message.text).getFullMessage())
  });
}

function toggleMinimization() {
  var currentState
  var newState
  if (isChatMinimized) {
    currentState = minClass
    newState = maxClass
  } else {
    currentState = maxClass
    newState = minClass
  }
  chatBody.classList.replace(currentState, newState)
  isChatMinimized = !isChatMinimized
  localStorage.setItem('isTsChatMinimized', isChatMinimized)
}

function createChatHeader() {
  var chatHeader = document.createElement('div')
  var minimizeButton = document.createElement('button')
  var chatNameContainer = document.createElement('span')

  chatHeader.classList.add('chatHeader')
  minimizeButton.classList.add('minimizeButton')
  minimizeButton.innerText = '-'
  chatNameContainer.innerText = chatName
  minimizeButton.addEventListener('click', function() { toggleMinimization() })
 chatHeader.appendChild(minimizeButton)
  chatHeader.appendChild(chatNameContainer)
  return chatHeader
}

function createChatBody() {
  var body = document.createElement('div')
  var sendButton = document.createElement('button')
  var chatInput = document.createElement('textArea')
  var inputPanel = document.createElement('div')
  var messageListPanel = document.createElement('div')

}

window.onload = function addChat() {
  chatDiv = document.createElement('div')
  messageList = document.createElement('ul')
  
  chatHeader = createChatHeader()
  chatBody = createChatBody()

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
    var botAnswerDelay = 15000
    chatInput.value = ''
    postChatMessage(messageText, currentUserName)
    setTimeout(function reply() {
      postChatMessage(
        'Answer to message ' + messageText.toUpperCase(),
        botName
      )
    }, botAnswerDelay)
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
