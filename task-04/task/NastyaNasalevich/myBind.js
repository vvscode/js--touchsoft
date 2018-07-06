/* eslint no-extend-native: ["error", { "exceptions": ["Function"] }] */

/**
 * Написать метод .myBind, который будет работать аналогично
 * встроенному методу .bind у функций
 * https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 */

Function.prototype.myBind = function myBind(context) {
    var contextOfFunction = this;
    return function fToBind() {
      return contextOfFunction.apply(context, arguments);
    };
}