/* exported promisify */

/**
 * Все асинхронные функции node.js и подавляющее большинство асинхронных функций внешних модулей
 * на данный момент всё же используют колбэки,
 * чтобы вернуть результат работы или сообщить об ошибке.
 * Нужно написать фукнцию promisify которая
 * - принимает асинхронную функцию на базе error-first коллбэка
 * - возвращает новую фукнцию, которая вместо коллбэка возвращает результат в виде промиса
 *
 * Аналог https://nodejs.org/api/util.html#util_util_promisify_original
 */

function promisify(callback) {
  return function wrapper() {
    var context = this;
    var args = Array.from(arguments);
    return new Promise(function resultPromise(resolve, reject) {
      args.push(function promiseCallback(errorObj, data) {
        if (errorObj === null) {
          resolve(data);
        } else {
          reject(errorObj);
        }
      });
      callback.apply(context, args);
    });
  };
}
