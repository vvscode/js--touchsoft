/**
 * Написать метод .myBind, который будет работать аналогично
 * встроенному методу .bind у функций
 * https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 */

Function.prototype.myBind = function (func) {
    var objRef = this;
    return function() {
        return objRef.apply(func, arguments);
    };
};