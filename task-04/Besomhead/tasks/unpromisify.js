/**
 * Написать фукнцию обратную promisify
 *
 * она принимает фукнцию, которая возвращает результат в виде promise
 * и возвращает обертку работающую на error-first коллбэке
 */

function unpromisify(promisified) {
  return function wrapper() {
    var args = Array.from(arguments);
    var callback = args.pop();
    if (typeof callback !== "function") {
      promisified();
      return;
    }
    promisified.apply(this, args).then(
      function resolve(promiseData) {
        callback(null, promiseData);
      },
      function reject(promiseData) {
        callback(promiseData);
      }
    );
  };
}

unpromisify();
