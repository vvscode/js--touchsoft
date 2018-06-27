/* exported promisify  */
/**
 * Все асинхронные функции node.js и подавляющее большинство асинхронных функций внешних модулей
 * на данный момент всё же используют колбэки,
 * чтобы вернуть результат работы или сообщить об ошибке.
 * Нужно написать фукнцию promisify которая
 *  - принимает асинхронную функцию на базе error-first коллбэка
 *  - возвращает новую фукнцию, которая вместо коллбэка возвращает результат в виде промиса
 *
 * Аналог https://nodejs.org/api/util.html#util_util_promisify_original
 */
function promisify() {
    var cb = arguments[arguments.length-1];
    return function promise() {
        var args = [].slice.call(arguments);
        var context = this;
        return new Promise(function promise(resolve, reject) {
            function callBackPromise() {
                var error = arguments[0];
                var data = arguments[1];
                if (error) {
                    reject(error);
                }
                resolve(data)

            }
            args.push(callBackPromise);
            cb.apply(context, args);
        })
    }
}