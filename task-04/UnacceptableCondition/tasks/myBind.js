/**
 * Написать метод .myBind, который будет работать аналогично
 * встроенному методу .bind у функций
 * https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 */

with(Function) {
    prototype.myBind = function myBind(func) {
        var objRef = this;
        return function bindFunc() {
            return objRef.apply(func, arguments);
        };
    };
}