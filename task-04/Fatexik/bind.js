/* exported bind */
/**
 * Функция bind фиксирует контекст, так что
 * var o = { name: 'Bob' }
 * var greet = function() { console.log(this.name); }
 * var oGreet = bind(greet, o);
 * oGreet(); // 'Bob'
 */

function bind(func, context) {
    return function getFunct() {
        func.apply(context, arguments);
    }
}