/**
 * Написать реализацию eventBus в соответствии с тестами
 */

function EventBus() {
  this.trigger = function trigger(event, param) {
    var index;
    var params = [param];
    if (this[event] === undefined) {
      return;
    }
    index = 2;
    while (index < arguments.length && arguments[index] !== undefined) {
      params.push(arguments[index]);
      index++;
    }
    for (index = 0; index < this[event].length; index++) {
      this[event][index].apply(this, params);
    }
  };
  this.on = function on(event, callback) {
    if (typeof callback !== "function") {
      return;
    }
    if (this[event] === undefined) {
      this[event] = [];
    }
    this[event].push(callback);
  };
  this.off = function off(event, callback) {
    var cbIndex = this[event].indexOf(callback);
    if (cbIndex === -1) {
      return;
    }
    this[event].splice(cbIndex, 1);
  };
}

EventBus();
