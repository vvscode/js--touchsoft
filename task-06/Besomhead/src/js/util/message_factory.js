/* exported messageFactory */

var messageFactory = (function messageFactoryModule() {
  function MessageFactory() {}

  function getCurrentTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();

    return (hours < 10 ? "0" : "")
      .concat(hours.toString())
      .concat(":")
      .concat(minutes < 10 ? "0" : "")
      .concat(minutes.toString());
  }

  function Message(date, sender, body) {
    this.day = date.getDate();
    this.month = date.getMonth();
    this.time = getCurrentTime(date);
    this.sender = sender;
    this.body = body;
  }

  MessageFactory.prototype.getMessage = function getMessage(
    date,
    sender,
    body
  ) {
    return new Message(date, sender, body);
  };

  return new MessageFactory();
})();
