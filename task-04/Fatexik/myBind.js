/* eslint no-extend-native: ["error", { "exceptions": ["Function"] }] */
/**
 * Написать метод .myBind, который будет работать аналогично
 * встроенному методу .bind у функций
 * https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 */

Function.prototype.myBind = function myBind(context) {
    var funcToBind = this;
    return function bind() {
        return funcToBind.apply(context, arguments);
    }
};