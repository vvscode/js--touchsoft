/**
 * Написать реализацию eventBus в соответствии с тестами
 */
function EventBus () {}

EventBus.prototype.trigger = function trigger(event, arg) {
    var args = [].slice.call(arguments, 1);
    this[event] = this[event] || [];
    this[event].forEach(function f(cb) {
            cb.apply(this, args);
    });
    return arg;
};

EventBus.prototype.on = function on(event, callback) {
    
    if(typeof callback !== "function") {
        return;
    }

    this[event] = this[event] || [];
    this[event].push(callback);
};

EventBus.prototype.off = function off(event, cb) {
    
    if (this[event]) {
        this[event] = this[event].filter(function f(el, i, arr) {
            return el !== cb;
        });
    }

};


