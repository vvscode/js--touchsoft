'use strict';
/**
 * Написать реализацию метода .myFilter, который работает
 * аналогично оригинальному
 * https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 */
Array.prototype.myFilter = function (callback, context) {
    var that = this;
    var array = that.slice();
    return function test(callback, context) {
        var list = [];
        var i;
        var j;
        var cbResult;
        callback = callback.bind(context);
        if(typeof callback !== "function") {
            throw "callback is not function";
        }
        for(i = 0; i< array.length; i++) {
            if(array[i]) {
                cbResult =  callback(array[i], i, array);
                i++;
                break
            }
        }
        if(cbResult === false) {
            return list;
        }
        if(cbResult === true || typeof cbResult === "string") {
            for(j = 0; j <array.length; j++) {
                list.push(array[j]);
            }
            return list;

        }
        list.push(cbResult);
        for(i; i <array.length; i++) {
            if(array[i]) {
                cbResult = callback(array[i], i, array);
                if(cbResult) {
                    list.push(array[i]);
                }
            }
        }
        return list;
    }.call(undefined, callback, context);
};


// var list = [];
// var i;
// var cbResult;
// console.log(callback);
// if(typeof callback !== "function") {
//     throw "callback is not function";
// }
// if(callback() === false) {
//     return list;
// }
// if(callback()) {
//     for(i = 0; i <this.length; i++) {
//         list.push(this[i]);
//     }
//     return list;
// }
// for(i = 0; i <this.length; i++) {
//     cbResult = callback(this[i]);
//     if(cbResult) {
//         list.push(this[i]);
//     }
// }
// return list;


//
// var list = [];
// var i;
// var j;
// var cbResult;
// console.log(context);
// if(!context) {
//     var b = undefined;
//     callback = callback.bind(NaN);
// } else {
//     callback = callback.bind(context);
// }
// if(typeof callback !== "function") {
//     throw "callback is not function";
// }
// for(i = 0; i< this.length; i++) {
//     if(this[i]) {
//         cbResult =  callback(this[i], i, this);
//         i++;
//         break
//     }
// }
// if(cbResult === false) {
//     return list;
// }
// if(cbResult === true || typeof cbResult === "string") {
//     for(j = 0; j <this.length; j++) {
//         list.push(this[j]);
//     }
//     return list;
// }
// list.push(cbResult);
// for(i; i <this.length; i++) {
//     if(this[i]) {
//         cbResult = callback(this[i], i, this);
//         if(cbResult) {
//             list.push(this[i]);
//         }
//     }
// }
// return list;