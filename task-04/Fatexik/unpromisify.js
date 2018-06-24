/**
 * Написать фукнцию обратную promisify
 *
 * она принимает фукнцию, которая возвращает результат в виде promise
 * и возвращает обертку работающую на errorfirst коллбэке
 */


function unpromisify(promisify) {
    var promise = promisify;
    var callBack;
    return function () {
        var args = [].slice.call(arguments);
        if (typeof args[args.length - 1] === "function") {
            callBack = args[args.length - 1];
            args.pop();
            promise.apply(this, args).then(function (data) {
                callBack(null, data)
            }, function (data) {
                callBack(data)
            });
            return;
        }
        promise()
    }
}