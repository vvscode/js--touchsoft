/* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */
/**
 * Написать реализацию метода .myFilter, который работает
 * аналогично оригинальному
 * https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 */

Array.prototype.myFilter = function myFilter(callback, context) {
  var resultArray = [];
  var array = Array.from(this);
  var index;
  if (callback === undefined) {
    throw new Error("The first param should be callback");
  }
  for (index = 0; index < array.length; index++) {
    if (
      array[index] !== undefined &&
      callback.apply(context, [array[index], index, array])
    ) {
      resultArray.push(array[index]);
    }
  }
  return resultArray;
};
