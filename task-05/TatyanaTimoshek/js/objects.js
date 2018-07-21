/*global connectionsWithDataBase*/
var objectsStorage = (function objectsStorage() {
  var chatURL = connectionsWithDataBase.url;
  function info(id) {
    return {
      messagesUrl: chatURL + "/messages/" + id + "/.json",
      chatStatusUrl: chatURL + "/chatStatus/" + id + "/.json",
      usersUrl: chatURL + "/users/" + id + "/.json",
      settingsUrl: chatURL + "/settings/" + id + "/.json",
      getUsersUrl: chatURL + "/users/.json",
      getMessagesUrl: chatURL + "/messages/",
      setUsersUrl: chatURL + "/users/",
      jsonPart: "/.json",
      requestPost: "POST",
      requestGet: "GET",
      requestPatch: "PATCH",
      requestPut: "PUT",
      infoUserId: "",
      messagesList: "",
      updateMess: false
    };
  }

  function tofb() {
    return {
      time: "14:19",
      sender: "Tan",
      text: "letter"
    };
  }
  return {
    infoObj: info,
    tofbObj: tofb
  };
})();
