/* exported debounce */

/**
 * Напишите функцию debounce(f, ms), которая возвращает обёртку, которая откладывает вызов f на ms миллисекунд.
 *
 *  «Лишние» вызовы перезаписывают предыдущие отложенные задания. Все аргументы и контекст – передаются.
 *
 *  Например:
 *
 *  function f() { ... }
 *
 *  let f = debounce(f, 1000);
 *
 *  f(1); // вызов отложен на 1000 мс
 *  f(2); // предыдущий отложенный вызов игнорируется, текущий (2) откладывается на 1000 мс
 *
 *  // через 1 секунду будет выполнен вызов f(1)
 *
 *  setTimeout( function() { f(3) }, 1100); // через 1100 мс отложим вызов еще на 1000 мс
 *  setTimeout( function() { f(4) }, 1200); // игнорируем вызов (3)
 *
 *  // через 2200 мс от начала выполнения будет выполнен вызов f(4)
 *  Упрощённо можно сказать, что debounce возвращает вариант f, срабатывающий не чаще чем раз в ms миллисекунд.
 *
 *
 */

function debounce(callback, time) {

    var callbackFunc = callback;
    var callbackTime = time;
    var timerId;

    return function start () {

        clearTimeout(timerId);

        function setupTimer() {
            timerId = setTimeout(
                callbackFunc.bind(this,arguments[0]),
                callbackTime
            );
        }

        setupTimer(arguments[0])
    };
}
