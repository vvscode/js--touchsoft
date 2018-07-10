/* exported sum */

/**
 * Написать фукнцию сумматор, которая будет работать
 * var s = sum();
 * console.log(s); // 0
 * console.log(s(1)); // 1
 * console.log(s(1)(2)); //3
 * console.log(s(3)(4)(5)); // 12
 * Число вызовов может быть неограниченым
 */

function sum(init) {
  var sumResult = init || 0;
  var summerFunc = function summer(addend) {
    return sum(sumResult + (addend || 0));
  };
  summerFunc.valueOf = function showSumResult() {
    return sumResult;
  };

  return summerFunc;
}
