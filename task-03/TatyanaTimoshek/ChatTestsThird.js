/* global init,  scrollDown, sendMessage, getId, aboutUser, addMinChatSymbol, addUnreadMessageSymbol, makeUserName, makeUserId, closeActivePane, addUser, removeUserFromList, setUsersInList, myData, info*/
/* global QUnit */

function hideDashboard() {
  document.body.removeChild(document.getElementById('idOperatorDashboard'));
}

QUnit.module('Scrolling');

QUnit.test('Check scrolling the history of messages.', function(assert) {
  var history;
  init();
  history = document.getElementById('idHistory');
  history.innerHTML =
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck';
  scrollDown();
  assert.ok(
    history.clientHeight + history.scrollTop === history.scrollHeight,
    'The test is successful'
  );
  history.innerHTML = 'History';
});

QUnit.module('Message template');

QUnit.test('Check the format of the operator messages.', function(assert) {
  var currentTime = new Date();
  document.getElementById('idHistory').innerHTML = '';
  document.getElementById('idInputMessage').innerHTML = 'hello';
  sendMessage();
  assert.ok(
    document
      .getElementById('idHistory')
      .innerHTML.indexOf(
        currentTime.getHours() +
          ':' +
          currentTime.getMinutes() +
          ' Operator: hello'
      ) !== false,
    'The test is successful'
  );
  assert.ok(
    document.getElementById('idInputMessage').value === '',
    'The test is successful'
  );
});

QUnit.module('Сreating names with special characters');

QUnit.test('Check id extraction function.', function(assert) {
  assert.ok(
    getId('User (idOfUser1)') === 'idOfUser1',
    'The test is successful'
  );
});

QUnit.test(
  'Check adding a character for a collapsed and deployed chat.',
  function(assert) {
    aboutUser.minChat = true;
    assert.ok(addMinChatSymbol() === '&#128469;', 'The test is successful');
    aboutUser.minChat = false;
    assert.ok(addMinChatSymbol() === '&#128470;', 'The test is successful');
  }
);

QUnit.test('Check adding the character of an unread message.', function(
  assert
) {
  aboutUser.unreadMessages = true;
  assert.ok(addUnreadMessageSymbol() === '&#128386;', 'The test is successful');
  aboutUser.unreadMessages = false;
  assert.ok(addUnreadMessageSymbol() === '', 'The test is successful');
});

QUnit.test('Check the creation of the user name and id.', function(assert) {
  assert.ok(
    makeUserName('You', 'idOfUser1') === 'Guest (idOfUser1)',
    'The test is successful'
  );
  assert.ok(
    makeUserName('Jack', 'idOfUser1') === 'Jack (idOfUser1)',
    'The test is successful'
  );
  assert.ok(
    makeUserId('idOfUser1') === 'idOptionidOfUser1',
    'The test is successful'
  );
});

QUnit.module('Close the active window');

QUnit.test('Check closing button.', function(assert) {
  closeActivePane();
  assert.ok(
    document.getElementById('idMountains').style.visibility === 'visible',
    'The test is successful'
  );
  document.getElementById('idActive').style.visibility = 'visible';
  document.getElementById('idMountains').style.visibility = 'hidden';
});

QUnit.module('Creation and deletion of user options');

QUnit.test('Check user addition.', function(assert) {
  addUser('Jessie', '5Jessie55');
  assert.ok(
    document.getElementById('idOption5Jessie55') !== null,
    'The test is successful'
  );
});

QUnit.test('Check user deletion.', function(assert) {
  removeUserFromList('5Jessie55');
  assert.ok(
    document.getElementById('idOption5Jessie55') === null,
    'The test is successful'
  );
});

QUnit.module('Sorting and searching');

QUnit.test('Check user search.', function(assert) {
  var userNamesList;
  var count = 0;
  document.getElementById('idSortUsers').options[0].selected = true;
  for (i = 0; i < document.getElementById('idUsers').length; i++) {
    if (
      document
        .getElementById('idUsers')
        .options[i].innerHTML.indexOf('Guest') !== -1
    ) {
      count++;
    }
  }
  document.getElementById('idInputMessage').value = 'Guest';
  setUsersInList();
  assert.ok(
    document.getElementById('idUsers').length === count,
    'The test is successful'
  );
  document.getElementById('idInputMessage').value = '';
});

QUnit.test('Check user sorting.', function(assert) {
  var done;
  var holdOn = 1500;
  var index;
  aboutUser.userName = '007-agent';
  aboutUser.userId = 'willie333';
  myData(
    info.setUsersUrl + 'willie333' + info.jsonPart,
    info.requestPut,
    aboutUser
  );
  aboutUser.userName = 'zzzzzzzzz';
  aboutUser.userId = 'zzzzzzzzz';
  myData(
    info.setUsersUrl + 'zzzzzzzzz' + info.jsonPart,
    info.requestPut,
    aboutUser
  );
  document.getElementById('idSortUsers').options[2].selected = true;
  setUsersInList();
  done = assert.async();
  setTimeout(function() {
    assert.ok(
      document
        .getElementById('idUsers')
        .options[0].innerHTML.indexOf(
          makeUserName('007-agent', 'willie333')
        ) !== -1,
      'The test is successful'
    );
    index = document.getElementById('idUsers').length;
    assert.ok(
      document
        .getElementById('idUsers')
        .options[index - 1].innerHTML.indexOf(
          makeUserName('zzzzzzzzz', 'zzzzzzzzz')
        ) !== -1,
      'The test is successful'
    );
    myData(info.setUsersUrl + 'willie333' + info.jsonPart, 'DELETE', aboutUser);
    myData(info.setUsersUrl + 'zzzzzzzzz' + info.jsonPart, 'DELETE', aboutUser);
    hideDashboard();
    done();
  }, holdOn);
});
