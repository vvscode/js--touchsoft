/* eslint-disable no-undef */

QUnit.module('Check Users List', {
  before() {
    setTimeout(function f() {
      removeChildren(userList);
    }, 500);
  }
});

QUnit.test('Creating of users list', function test(assert) {
  var done = assert.async();
  var listOfUsers;
  setTimeout(createUserList, 500);
  setTimeout(function f() {
    listOfUsers = userList.childNodes;
    assert.ok(listOfUsers.length !== 0, 'Users List was created!');
    done();
  }, 1000);
});


QUnit.module('Check user list');

QUnit.test('Check unread state', function test(assert) {
  var done = assert.async();
  sendRequestToDatabase('GET', 'users/', '').then(function f(body) {
    var usersKeys = Object.keys(body);
    var firstUserKey = usersKeys[0];
    console.log(firstUserKey);
    return sendRequestToDatabase('PUT', 'users/' + firstUserKey, '/isRead', false);
  })
  .then(function f() {
    removeChildren(userList);
    createUserList();
  });

  setTimeout(function f() {
    var isNotRead = false;
    console.log(userList.childNodes[0].getElementsByClassName('user-name-element')[0].className);

     if(userList.childNodes[0].getElementsByClassName('user-name-element')[0].className === 'user-name-element unread-state') {
         isNotRead = true;
     }
     
     assert.ok( isNotRead === true, 'Message was read!');
    done();
  }, 2000);
});

QUnit.test('Check user status', function test(assert) {
  var done = assert.async();
    sendRequestToDatabase('GET', 'users/', '').then(function f(body) {
      var userStateInner = '';
      var usersKeys = Object.keys(body);
      var firstUserKey = usersKeys[0];
      var chatState = userList.childNodes[0].getElementsByClassName('user-status-element')[0];
      
      if (new Date() - new Date(body[firstUserKey].lastMessageDate) <= 600000) {
        userStateInner = 'online';
      }
      
      assert.equal(userStateInner, chatState.innerHTML, 'User status is true!');
      done();
    });
});

QUnit.test('Sort by user name', function test(assert) {
  var done = assert.async();
  sorterTag.value = "User Name";
  removeChildren();
  createUserList();
  setTimeout(function f() {
      var sortUsers= [];
      var arrFromBD = [];
      var sortArr = sortUsers.sort();
      var i;
      var k;
      var j;

      for (var i = 0; i < usersArray.length; i++) {
           sortUsers[i] = usersArray[i].getElementsByClassName('user-name-element')[0].innerHTML;
      }

      for (var k = 0; k < sortUsers.length; k++){
          arrFromBD[k] = sortUsers[k];
      }
      
      for (var j = 0; j < sortArr.length; j++) {
          assert.ok(sortArr[j] === arrFromBD[j], 'Users was sorted!');
      }

      done();
  }, 1500);
});

QUnit.module('Check working place');

QUnit.test('Check format of the message', function test(assert) {
  var message = new Message(new Date(), 'YOU', 'Test message');
  var testMessage = (new Date()).toLocaleString('en-US', options) + ' <br>' + 'YOU: ' + 'Test message' + '<br>';
  assert.equal(testMessage, message.showMessage(), 'Format is suitable!');
});

QUnit.test('Open working place', function test(assert) {
  var done = assert.async();
  setTimeout(function f() {
    var isPictureHidden = document.getElementById('dashboard-picture').hidden;
    var isWorkPlace = document.getElementById('dashboard-work-place').hidden;
    userList.childNodes[0].click();
    assert.ok(isPictureHidden, 'Picture was closed!');
    assert.ok(!isWorkPlace, 'Working place was opened!');
    done();
  }, 1000);
});

QUnit.test('Check the adding messages to the history panel', function test(assert) {
  var done = assert.async();
  setTimeout(function addMessageToPanel() {
    var prevHistory = document.getElementById('dashboard-history-panel').innerHTML;
    document.getElementById('dashboard-chat-textarea').value = 'Test message';
    document.getElementById('dashboard-chat-button').click();
    assert.notStrictEqual(prevHistory, document.getElementById('dashboard-history-panel').innerHTML, 'The messages were added to the history panel!');
    done();
  }, 1100); 
});

QUnit.test('Open working place', function test(assert) {
  var done = assert.async();
  setTimeout(function f() {
    var isPictureHidden = document.getElementById('dashboard-picture').hidden;
    var isWorkPlace = document.getElementById('dashboard-work-place').hidden;
    document.getElementById('dashboard-close').click();
    assert.ok(!isPictureHidden, 'Picture was closed!');
    assert.ok(isWorkPlace, 'Working place was opened!');
    done();
  }, 1200);
});

QUnit.module('Connections to the Database');

QUnit.test('Check request sending', function test(assert) {
  var prevData;
  var done = assert.async();
  sendRequestToDatabase('GET', 'messages/', '')
        .then(function sendGetRequest(body) {
          prevData = body;
        });
  sendRequestToDatabase('POST', 'messages/', '', new Message(new Date(), 'YOU', 'New message'))
    .then(function sendPostRequest() {
      sendRequestToDatabase('GET', 'messages/', '')
        .then(function sendGetRequest(body) {
          assert.notStrictEqual(body, prevData, 'Fetch request are working!');
          done();
        });
    });
});