/**
 * Написать фукнцию обратную promisify
 *
 * она принимает фукнцию, которая возвращает результат в виде promise
 * и возвращает обертку работающую на error-first коллбэке
 */

function unpromisify (promisify) {
    var promise = promisify;
    return function () {
        var args = [].slice.call(arguments);
        if(typeof args[args.length -1] === "function") {
            var callback = args[args.length - 1];
            args.pop();
            promise.apply(this, args).then( function(data){
                callback(null, data)
            }, function (data) {
                callback(data)
            });
            return;
        }
        promise()

    }
}