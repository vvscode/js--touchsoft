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
    function add(value) {
        return sum(value == null ? add.captured : add.captured + value);
    }
    add.captured = value || 0;
    add.toString = function () {
        return add.captured;
    };
    return add;
}




