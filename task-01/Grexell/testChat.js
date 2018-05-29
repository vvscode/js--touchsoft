QUnit.testDone( function( details ) {
    var chats = window.document.querySelectorAll("#chat-panel");
    for (var i = 0; i < chats.length; i++) {
      chats[i].hidden = true; 
    }
  } );
  
  QUnit.test( "test adding styles", function( assert ) {
    var beforeInit = window.document.styleSheets.length;
    addStyle();
    assert.equal( beforeInit + 1,  window.document.styleSheets.length, "Passed!" );
  });
  
  QUnit.test( "test init elements", function( assert ) {
    initElements();
    assert.ok(window.document.getElementById("chat-panel") != null, "Passed!" );
  });
  
  QUnit.test( "test init minimized", function( assert ) {
    var testMinimized = true;
    localStorage.setItem(minimizedKey, testMinimized.toString());
    initMinimized();
    
    assert.equal(minimized, testMinimized, "Passed with true!" );
    
    testMinimized = false;
    localStorage.setItem(minimizedKey, testMinimized.toString());
    initMinimized();
    
    assert.equal(minimized, testMinimized, "Passed with false!" );
    
  });
  
  QUnit.test( "test init messages", function( assert ) {
    var testMessages = [];
    testMessages.push(new HistoryItem(new Date(), "1", "2"));
    localStorage.setItem(messagesKey, JSON.stringify(testMessages));
    initMessages();
    
    assert.propEqual(messages, testMessages, "Passed!");
  });
  
  QUnit.test( "test save minimized", function( assert ) {
    minimized = true;
    
    saveMinimized();
    
    assert.equal(localStorage.getItem(minimizedKey), "true", "Passed!");
    
    minimized = false;
    
    saveMinimized();
    
    assert.equal(localStorage.getItem(minimizedKey), "false", "Passed!");
  });
  
  QUnit.test( "test save messages", function( assert ) {
    messages.push(new HistoryItem(new Date(), "1", "2"));
    
    saveMessages();
    
    assert.propEqual(localStorage.getItem(messagesKey), JSON.stringify(messages), "Passed!");
  });
  
  QUnit.test( "test init chat", function( assert ) {
    var beforeInit = window.document.styleSheets.length;
    var testMessages = [];
    
    style = true;
    
    testMessages.push(new HistoryItem(new Date(), "1", "2"));
    localStorage.setItem(messagesKey, JSON.stringify(testMessages));
    messages = [];
    
    testMinimized = false;
    localStorage.setItem(minimizedKey, testMinimized.toString());
    
    initChat();
    
    assert.equal( beforeInit + 1,  window.document.styleSheets.length, "Passed!" );
    assert.ok(window.document.getElementById("chat-panel") != null, "Passed!" );
    assert.propEqual(messages, testMessages, "Passed!" );
    assert.equal(minimized, testMinimized, "Passed!" );  
  });
  
  QUnit.test( "test destoy chat", function( assert ) {
    minimized = false;
    messages = [];
    messages.push(new HistoryItem(new Date(), "1", "2"));
    
    destroyChat();
    
    assert.propEqual(localStorage.getItem(messagesKey), JSON.stringify(messages), "Passed!");
    assert.equal(localStorage.getItem(minimizedKey), "false", "Passed!");
  });
  
  QUnit.test( "test HistoryItem constructor", function( assert ) {
    var testDate = new Date();
    
    var result = {
      date: testDate.getHours() + ":" + testDate.getMinutes(),
      sender: "test sender",
      text : "testMessage"
    };
    
    var testItem = new HistoryItem(testDate, result.sender, result.text);
    
    assert.propEqual(testItem, result, "Passed!");
  });
  
  QUnit.test( "test minimized changing", function( assert ) {
    var testMinimized;
   
    minimized = false;
    testMinimized = minimized;
    window.document.getElementById(chatContentClass).classList.remove(hiddenClass);
    toggleMinimize();
    
    assert.equal(minimized, !testMinimized, "Passed!");
    assert.equal(window.document.getElementById(chatContentClass).classList.contains(hiddenClass), minimized, "Passed!");
    testMinimized = minimized;
   
    toggleMinimize();
    
    assert.equal(minimized, !testMinimized, "Passed!");
    assert.equal(window.document.getElementById(chatContentClass).classList.contains(hiddenClass), minimized, "Passed!");
    
    toggleMinimize();
  });
  
  QUnit.test( "test formating item", function( assert ) {
    var testDate = new Date();
    var testItem = new HistoryItem(testDate, "test sender", "test message");
    
    var itemElement = formatItem(testItem);
    
    assert.notEqual(itemElement, null, "Passed!");
    assert.equal(itemElement.children[0].innerText, testItem.date, "Passed!");
    assert.equal(itemElement.children[1].innerText, testItem.sender, "Passed!");
    assert.equal(itemElement.children[2].innerText, testItem.text, "Passed!");
  });
  
  QUnit.test( "test formating item", function( assert ) {
    var result;
    messages.push(new HistoryItem(new Date(), "test sender", "test message1"));
    messages.push(new HistoryItem(new Date(), "test sender", "test message2"));
    messages.push(new HistoryItem(new Date(), "test sender", "test message3"));
   
    result = window.document.getElementsByClassName(messageHistoryClass)[0].children.length + messages.length;
    
    printItems(messages);
    
    assert.equal(window.document.getElementsByClassName(messageHistoryClass)[0].children.length, result, "Passed!");
  });
  
  QUnit.test( "test sending message", function( assert ) {
    var resultMessagesCount = messages.length + 1;
    var resultChildrenCount = window.document.getElementsByClassName(messageHistoryClass)[0].children.length + 1;
    var resultMessage;
    
    text = {
       value: "test message"
    };
    
    resultMessage = new HistoryItem(new Date(), messageSender, text.value);
    
    sendMessage({
      preventDefault: function(){}
    });
    
    assert.equal(messages.length, resultMessagesCount, "Passed!");
    assert.equal(window.document.getElementsByClassName(messageHistoryClass)[0].children.length, resultChildrenCount, "Passed!");
  });
  
  QUnit.test( "test answer generating", function( assert ) {
    var message = "test message";
    var resultAnswer = "Ответ на \"{" + message.toUpperCase() + "}\"";
    
    assert.equal(generateAnswer(message), resultAnswer, "Passed!");
  });
  
  QUnit.test( "test answer sending", function( assert ) {
    var resultMessagesCount = messages.length + 1;
    var resultChildrenCount = window.document.getElementsByClassName(messageHistoryClass)[0].children.length + 1;  
    var testMessage = new HistoryItem(new Date(), messageSender, "test message");
    var resultMessage = new HistoryItem(new Date(), answer.sender, generateAnswer(testMessage.text));
  
    sendAnswer(testMessage);
    
    assert.equal(messages.length, resultMessagesCount, "Passed!");
    assert.propEqual(messages[messages.length - 1], resultMessage, "Passed!");
    assert.equal(window.document.getElementsByClassName(messageHistoryClass)[0].children.length, resultChildrenCount, "Passed!");
  });