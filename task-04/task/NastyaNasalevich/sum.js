/**
 * Написать фукнцию сумматор, которая будет работать
 * var s = sum();
 * console.log(s); // 0
 * console.log(s(1)); // 1
 * console.log(s(1)(2)); //3
 * console.log(s(3)(4)(5)); // 12
 * Число вызовов может быть неограниченым
 */

 function sum(result) {
   var total = result;

    if (!total) {
        total = 0;
    } 

    function totalSum(a) {
        var arg = a;

        if (!arg) {
            arg = 0;
        } 

        return sum(total + arg);
    };

    totalSum.valueOf = function setTotal() {
        return total;
    };

    return totalSum;
}