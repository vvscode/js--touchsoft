/* exported createOperatorsDashboard */
var createOperatorsDashboard = (function createOperatorsDashboard() {
  function create() {
    var operatorDashboard = document.createElement("div");
    var operatorDashboardText = document.createElement("div");
    var active = document.createElement("div");
    var activeUser = document.createElement("div");
    var close = document.createElement("div");
    var chat = document.createElement("div");
    var control = document.createElement("div");
    var history = document.createElement("div");
    var inputMessage = document.createElement("textarea");
    var sendButton = document.createElement("div");
    var unknownField = document.createElement("div");
    var pic = document.createElement("div");
    var mountains = document.createElement("img");
    var filter = document.createElement("div");
    var filterUsers = document.createElement("input");
    var sortUsers = document.createElement("select");
    var selectSortBy = document.createElement("option");
    var selectActivity = document.createElement("option");
    var selectName = document.createElement("option");
    var selectUnreadMessages = document.createElement("option");
    var userPanel = document.createElement("div");
    var users = document.createElement("select");

    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://rawgit.com/TatyanaTimoshek/js--touchsoft/AWebPage/task-05/TatyanaTimoshek/css/AdminWindow.css";
    document.head.appendChild(link);

    operatorDashboard.className = "operatorDashboard fixedPosition";
    operatorDashboardText.className = "operatorDashboardText";
    active.className = "active fixedPosition borders";
    activeUser.className = "activeUser";
    close.className = "close fixedPosition";
    chat.className = "chat fixedPosition indents borders";
    control.className = "control fixedPosition indents borders";
    history.className = "history fixedPosition borders";
    inputMessage.className = "inputMessage fixedPosition borders";
    sendButton.className = "sendButton fixedPosition borders";
    unknownField.className = "unknownField fixedPosition borders";
    mountains.className = "mountains fixedPosition";
    filterUsers.className = "filterUsers forFilter";
    sortUsers.className = "filterUsers forSort";
    users.className = "userPanel borders";

    operatorDashboard.id = "idNewEl";
    active.id = "idActive";
    activeUser.id = "idActiveUser";
    close.id = "idClose";
    chat.id = "idChat";
    control.id = "idControl";
    history.id = "idHistory";
    inputMessage.id = "idInputMessage";
    sendButton.id = "idSendButton";
    unknownField.id = "idUnknownField";
    mountains.id = "idMountains";
    filterUsers.id = "idFilterUsers";
    sortUsers.id = "idSortUsers";
    selectSortBy.id = "idSelectSortBy";
    selectActivity.id = "idSelectActivity";
    selectName.id = "idSelectName";
    selectUnreadMessages.id = "idSelectUnreadMessages";
    userPanel.id = "idUserPanel";
    users.id = "idUsers";

    operatorDashboardText.innerHTML = "Operator's Dashboard";
    active.innerHTML = "Active:&#160;";
    activeUser.innerHTML = "User";
    close.innerHTML = "x";
    chat.innerHTML = "Chat";
    control.innerHTML = "Control";
    history.innerHTML = "History";
    sendButton.innerHTML = "Send";
    selectSortBy.innerHTML = "Sort by";
    selectActivity.innerHTML = "Activity";
    selectName.innerHTML = "Name";
    selectUnreadMessages.innerHTML = "Unread Messages";

    inputMessage.placeholder = "Enter your message..";
    mountains.src = "mountains.jpg";
    filterUsers.placeholder = " Filter";
    users.multiple = true;

    active.appendChild(activeUser);
    active.appendChild(close);
    active.appendChild(chat);
    active.appendChild(control);
    active.appendChild(history);
    active.appendChild(inputMessage);
    active.appendChild(sendButton);
    active.appendChild(unknownField);
    pic.appendChild(mountains);
    filter.appendChild(filterUsers);
    sortUsers.appendChild(selectSortBy);
    sortUsers.appendChild(selectActivity);
    sortUsers.appendChild(selectName);
    sortUsers.appendChild(selectUnreadMessages);
    userPanel.appendChild(users);

    operatorDashboard.appendChild(operatorDashboardText);
    operatorDashboard.appendChild(active);
    operatorDashboard.appendChild(pic);
    operatorDashboard.appendChild(filter);
    operatorDashboard.appendChild(sortUsers);
    operatorDashboard.appendChild(userPanel);

    return operatorDashboard;
  }
  return {
    createDashboard: create
  };
})();
