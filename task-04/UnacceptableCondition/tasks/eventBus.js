/**
 * Написать реализацию eventBus в соответствии с тестами
 */


function EventBus () {
    this.callbacs = {}
}

EventBus.prototype.trigger = function trigger (a, b) {
    var i;
    var args = [].slice.call(arguments);
    args.shift();
    if(this.callbacs[a]) {
        for(i = 0; i < this.callbacs[a].length; i++ ) {
            this.callbacs[a][i].apply(this, args);
        }
    }
    return b;
};

EventBus.prototype.on = function on (a, b) {
    if(typeof b !== "function") {
        return;
    }
    if(!this.callbacs[a]) {
        this.callbacs[a] = [];
    }
    this.callbacs[a].push(b)
};

EventBus.prototype.off = function off (a, b) {
    var i;
    if(this.callbacs[a]) {
        for(i = 0; i < this.callbacs[a].length; i++) {
            if(this.callbacs[a][i] === b) {
                this.callbacs[a].splice(i, 1);
                break;
            }
        }
    }
};