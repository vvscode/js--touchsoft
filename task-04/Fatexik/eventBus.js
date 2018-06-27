/**
 * Написать реализацию eventBus в соответствии с тестами
 */
function EventBus() {
    this.functionsBack = [];
}

EventBus.prototype.trigger = function trigger(key) {
    var args = [].slice.call(arguments);
    args.shift();
    if (this.functionsBack[key]) {
        this.functionsBack[key].forEach(function arrayProcessing(value) {
            value.apply(this,args)
        })
    }
};
EventBus.prototype.on = function on(key, cb) {
    if (typeof cb !== "function") {
        return null;
    }
    if (!this.functionsBack[key]) {
        this.functionsBack[key] = [];
    }
    this.functionsBack[key].push(cb);
    return true;
};
EventBus.prototype.off = function off(key, cb) {
    var i;
    for (i = 0; i < this.functionsBack[key].length; i++) {
        if (this.functionsBack[key][i] === cb) {
            this.functionsBack[key].splice(i, 1);
            break;
        }
    }
};
