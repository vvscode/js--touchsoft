/**
 * Написать реализацию eventBus в соответствии с тестами
 */
function EventBus() {
    this.functionsBack = [];
}

EventBus.prototype.trigger = function (key, cb) {
    var i = 0;
    var args = [].slice.call(arguments);
    args.shift();
    if (this.functionsBack[key]) {
        for (i = 0; i < this.functionsBack[key].length; i++) {
            this.functionsBack[key][i].apply(this, args);
        }
    }
};
EventBus.prototype.on = function (key, cb) {
    if (typeof cb !== "function") {
        return null;
    }
    if (!this.functionsBack[key]) {
        this.functionsBack[key] = [];
    }
    this.functionsBack[key].push(cb);
};
EventBus.prototype.off = function (key, cb) {
    var i = 0;
    for (i = 0; i < this.functionsBack[key].length; i++) {
        if (this.functionsBack[key][i] === cb) {
            this.functionsBack[key].splice(i, 1);
        }
    }
};