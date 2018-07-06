/**
 * Написать реализацию метода .myFilter, который работает
 * аналогично оригинальному
 * https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 */

Array.prototype.myFilter = function myFilter(fun) {
    var thisToObject = Object(this);
    var lengthOfThis = thisToObject.length;
    var thisArg;
    var result = [];
    var i;
    
    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    if (arguments.length >= 2) {
      thisArg = arguments[1];
    }
    
    for (i = 0; i < lengthOfThis; i++) {
      
        if (i in thisToObject) {
        var value = thisToObject[i];

        if (fun.call(thisArg, value, i, thisToObject)) {
          result.push(value);
        }

      }

    }

    return result;
}