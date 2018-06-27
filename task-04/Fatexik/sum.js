/* exported sum  */
/**
 * Написать фукнцию сумматор, которая будет работать
 * var s = sum();
 * console.log(s); // 0
 * console.log(s(1)); // 1
 * console.log(s(1)(2)); //3
 * console.log(s(3)(4)(5)); // 12
 * Число вызовов может быть неограниченым
 */
function sum(value) {
    var captured = value || 0;
    function add(val) {
        return sum(val == null ? captured : captured + val);
    }
    add.toString = function toString() {
        return captured;
    };
    return add;
}